import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Initialize storage bucket
async function initStorage() {
  const bucketName = "make-ad438ac4-bukti-paket";
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Bucket ${bucketName} created successfully`);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}

// Initialize storage on startup
initStorage();

// Health check endpoint
app.get("/make-server-ad438ac4/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ROUTES =============

// Sign up route
app.post("/make-server-ad438ac4/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, nim } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, nim },
      email_confirm: true, // Auto-confirm email since email server not configured
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      nim,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: { id: data.user.id, email, name, role, nim },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Failed to sign up user" }, 500);
  }
});

// ============= PAKET ROUTES =============

// Get all paket
app.get("/make-server-ad438ac4/paket", async (c) => {
  try {
    const paketList = await kv.getByPrefix("paket:");
    return c.json({ paket: paketList || [] });
  } catch (error) {
    console.error("Error fetching paket:", error);
    return c.json({ error: "Failed to fetch paket" }, 500);
  }
});

// Get single paket by ID
app.get("/make-server-ad438ac4/paket/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const paket = await kv.get(`paket:${id}`);

    if (!paket) {
      return c.json({ error: "Paket not found" }, 404);
    }

    return c.json({ paket });
  } catch (error) {
    console.error("Error fetching paket:", error);
    return c.json({ error: "Failed to fetch paket" }, 500);
  }
});

// Create new paket
app.post("/make-server-ad438ac4/paket", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, nim, prodi, phoneNumber, packageType } = body;

    if (!name || !nim || !prodi || !phoneNumber || !packageType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = `PKT${Date.now()}`;
    const paketData = {
      id,
      name,
      nim,
      prodi,
      phoneNumber,
      packageType,
      status: "Belum Diambil",
      arrivalDate: new Date().toISOString().split("T")[0],
      pickupDate: null,
      buktiPhoto: null,
      petugas: null,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`paket:${id}`, paketData);

    // Log activity
    await kv.set(`log:${Date.now()}`, {
      timestamp: new Date().toISOString(),
      user: user.email,
      action: "Tambah Paket",
      detail: `${name} - ${nim}`,
    });

    return c.json({ success: true, paket: paketData });
  } catch (error) {
    console.error("Error creating paket:", error);
    return c.json({ error: "Failed to create paket" }, 500);
  }
});

// Update paket status
app.put("/make-server-ad438ac4/paket/:id/status", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const paket = await kv.get(`paket:${id}`);

    if (!paket) {
      return c.json({ error: "Paket not found" }, 404);
    }

    const body = await c.req.json();
    const { status } = body;

    const updatedPaket = {
      ...paket,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`paket:${id}`, updatedPaket);

    // Log activity
    await kv.set(`log:${Date.now()}`, {
      timestamp: new Date().toISOString(),
      user: user.email,
      action: "Update Status Paket",
      detail: `${paket.name} - ${status}`,
    });

    return c.json({ success: true, paket: updatedPaket });
  } catch (error) {
    console.error("Error updating paket status:", error);
    return c.json({ error: "Failed to update paket status" }, 500);
  }
});

// Mark paket as picked up with photo proof
app.post("/make-server-ad438ac4/paket/:id/pickup", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const paket = await kv.get(`paket:${id}`);

    if (!paket) {
      return c.json({ error: "Paket not found" }, 404);
    }

    const formData = await c.req.formData();
    const photoFile = formData.get("photo") as File;

    if (!photoFile) {
      return c.json({ error: "Photo is required" }, 400);
    }

    // Upload photo to Supabase Storage
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const bucketName = "make-ad438ac4-bukti-paket";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, photoFile, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload photo" }, 500);
    }

    // Get signed URL for the photo
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

    if (!signedUrlData) {
      return c.json({ error: "Failed to get photo URL" }, 500);
    }

    // Get user data for petugas name
    const userData = await kv.get(`user:${user.id}`);
    const petugasName = userData?.name || user.email;

    // Update paket
    const pickupDate = new Date().toISOString().split("T")[0];
    const updatedPaket = {
      ...paket,
      status: "Sudah Diambil",
      pickupDate,
      buktiPhoto: signedUrlData.signedUrl,
      petugas: petugasName,
      pickedUpBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`paket:${id}`, updatedPaket);

    // Add to riwayat
    await kv.set(`riwayat:${id}`, updatedPaket);

    // Log activity
    await kv.set(`log:${Date.now()}`, {
      timestamp: new Date().toISOString(),
      user: user.email,
      action: "Tandai Paket Diambil",
      detail: `${paket.name} - ${paket.nim}`,
    });

    return c.json({ success: true, paket: updatedPaket });
  } catch (error) {
    console.error("Error marking paket as picked up:", error);
    return c.json({ error: "Failed to mark paket as picked up" }, 500);
  }
});

// Delete paket
app.delete("/make-server-ad438ac4/paket/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const paket = await kv.get(`paket:${id}`);

    if (!paket) {
      return c.json({ error: "Paket not found" }, 404);
    }

    await kv.del(`paket:${id}`);

    // Log activity
    await kv.set(`log:${Date.now()}`, {
      timestamp: new Date().toISOString(),
      user: user.email,
      action: "Hapus Paket",
      detail: `${paket.name} - ${paket.nim}`,
    });

    return c.json({ success: true, message: "Paket deleted successfully" });
  } catch (error) {
    console.error("Error deleting paket:", error);
    return c.json({ error: "Failed to delete paket" }, 500);
  }
});

// ============= RIWAYAT ROUTES =============

// Get riwayat
app.get("/make-server-ad438ac4/riwayat", async (c) => {
  try {
    const riwayatList = await kv.getByPrefix("riwayat:");
    return c.json({ riwayat: riwayatList || [] });
  } catch (error) {
    console.error("Error fetching riwayat:", error);
    return c.json({ error: "Failed to fetch riwayat" }, 500);
  }
});

// ============= PETUGAS ROUTES =============

// Get all petugas
app.get("/make-server-ad438ac4/petugas", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const petugasList = users.filter(
      (user: any) => user.role === "petugas" || user.role === "admin"
    );
    return c.json({ petugas: petugasList || [] });
  } catch (error) {
    console.error("Error fetching petugas:", error);
    return c.json({ error: "Failed to fetch petugas" }, 500);
  }
});

// ============= LOG ROUTES =============

// Get activity logs
app.get("/make-server-ad438ac4/logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("log:");
    // Sort by timestamp descending
    const sortedLogs = logs.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return c.json({ logs: sortedLogs || [] });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return c.json({ error: "Failed to fetch logs" }, 500);
  }
});

// ============= STATS ROUTES =============

// Get statistics
app.get("/make-server-ad438ac4/stats", async (c) => {
  try {
    const paketList = await kv.getByPrefix("paket:");
    const riwayatList = await kv.getByPrefix("riwayat:");

    const totalPaket = paketList.length;
    const belumDiambil = paketList.filter(
      (p: any) => p.status === "Belum Diambil"
    ).length;
    const sudahDiambil = paketList.filter(
      (p: any) => p.status === "Sudah Diambil"
    ).length;

    return c.json({
      stats: {
        totalPaket,
        belumDiambil,
        sudahDiambil,
        totalRiwayat: riwayatList.length,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

Deno.serve(app.fetch);
