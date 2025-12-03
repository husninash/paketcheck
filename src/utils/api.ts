import { projectId, publicAnonKey } from "./supabase/info";
import { createClient } from "@supabase/supabase-js";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ad438ac4`;

// Supabase client for frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Get auth token
async function getAuthToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || publicAnonKey;
}

// ============= AUTH API =============

export async function signUp(data: {
  email: string;
  password: string;
  name: string;
  role: string;
  nim?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to sign up");
  }

  return response.json();
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user || null;
}

// ============= PAKET API =============

export async function getPaketList() {
  const response = await fetch(`${API_BASE_URL}/paket`, {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch paket");
  }

  const data = await response.json();
  return data.paket;
}

export async function getPaketById(id: string) {
  const response = await fetch(`${API_BASE_URL}/paket/${id}`, {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch paket");
  }

  const data = await response.json();
  return data.paket;
}

export async function createPaket(paketData: {
  name: string;
  nim: string;
  prodi: string;
  phoneNumber: string;
  packageType: string;
}) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/paket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paketData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create paket");
  }

  const data = await response.json();
  return data.paket;
}

export async function updatePaketStatus(id: string, status: string) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/paket/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update paket status");
  }

  const data = await response.json();
  return data.paket;
}

export async function markPaketPickup(id: string, photoFile: File) {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append("photo", photoFile);

  const response = await fetch(`${API_BASE_URL}/paket/${id}/pickup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to mark paket as picked up");
  }

  const data = await response.json();
  return data.paket;
}

export async function deletePaket(id: string) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/paket/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete paket");
  }

  return response.json();
}

// ============= RIWAYAT API =============

export async function getRiwayat() {
  const response = await fetch(`${API_BASE_URL}/riwayat`, {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch riwayat");
  }

  const data = await response.json();
  return data.riwayat;
}

// ============= PETUGAS API =============

export async function getPetugasList() {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/petugas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch petugas");
  }

  const data = await response.json();
  return data.petugas;
}

// ============= LOG API =============

export async function getActivityLogs() {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }

  const data = await response.json();
  return data.logs;
}

// ============= STATS API =============

export async function getStats() {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  const data = await response.json();
  return data.stats;
}
