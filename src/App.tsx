import { useState, createContext, useContext, useEffect } from "react";
import { PublicNavbar } from "./components/PublicNavbar";
import { PublicHome } from "./components/PublicHome";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { PetugasDashboard } from "./components/PetugasDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import * as api from "./utils/api";

type View = "public" | "login" | "signup" | "petugas" | "admin";

// Types
export interface Package {
  id: string;
  photo: string;
  name: string;
  nim: string;
  prodi: string;
  date: string;
  status: "Belum Diambil" | "Sudah Diambil";
  phone?: string;
  notes?: string;
  phoneNumber?: string;
  packageType?: string;
  arrivalDate?: string;
  pickupDate?: string | null;
  buktiPhoto?: string | null;
  petugas?: string | null;
}

export interface Petugas {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  status: "Aktif" | "Nonaktif";
  shift: string;
  role: string;
}

export interface PickupHistory {
  id: string;
  packageId?: string;
  photo: string;
  name: string;
  nim: string;
  prodi: string;
  pickupDate: string;
  petugas: string;
  buktiPhoto: string;
}

export interface LogEntry {
  id?: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  detail?: string;
  type?: "create" | "update" | "delete";
}

// Context
interface AppContextType {
  packages: Package[];
  petugas: Petugas[];
  pickupHistory: PickupHistory[];
  logActivities: LogEntry[];
  currentUser: string;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addPackage: (pkg: Omit<Package, "id">) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  markAsPickedUp: (id: string, buktiPhoto: File, petugasName: string) => Promise<void>;
  addPetugas: (ptgs: Omit<Petugas, "id">) => void;
  updatePetugas: (id: string, ptgs: Partial<Petugas>) => void;
  deletePetugas: (id: string) => void;
  addLog: (log: Omit<LogEntry, "id" | "timestamp">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("public");
  const [currentUser, setCurrentUser] = useState<string>("System");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // State - akan diisi dari Supabase
  const [packages, setPackages] = useState<Package[]>([]);
  const [petugas, setPetugas] = useState<Petugas[]>([]);
  const [pickupHistory, setPickupHistory] = useState<PickupHistory[]>([]);
  const [logActivities, setLogActivities] = useState<LogEntry[]>([]);

  // Fungsi untuk format timestamp
  const getCurrentTimestamp = () => {
    const now = new Date();
    const day = now.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // Load data from Supabase
  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch paket
      const paketData = await api.getPaketList();
      setPackages(
        paketData.map((p: any) => ({
          id: p.id,
          photo: p.buktiPhoto || "",
          name: p.name,
          nim: p.nim,
          prodi: p.prodi,
          date: p.arrivalDate || p.createdAt?.split("T")[0] || "",
          status: p.status,
          phone: p.phoneNumber,
          phoneNumber: p.phoneNumber,
          packageType: p.packageType,
          arrivalDate: p.arrivalDate,
          pickupDate: p.pickupDate,
          buktiPhoto: p.buktiPhoto,
          petugas: p.petugas,
        }))
      );

      // Fetch riwayat
      const riwayatData = await api.getRiwayat();
      setPickupHistory(
        riwayatData.map((r: any) => ({
          id: r.id,
          photo: r.buktiPhoto || "",
          name: r.name,
          nim: r.nim,
          prodi: r.prodi,
          pickupDate: r.pickupDate || "",
          petugas: r.petugas || "",
          buktiPhoto: r.buktiPhoto || "",
        }))
      );

      // Fetch logs jika user sudah login
      if (currentView === "admin" || currentView === "petugas") {
        const logsData = await api.getActivityLogs();
        setLogActivities(
          logsData.map((l: any) => ({
            id: l.timestamp,
            timestamp: l.timestamp,
            user: l.user,
            action: l.action,
            details: l.detail || l.details || "",
            type: "update" as const,
          }))
        );

        const petugasData = await api.getPetugasList();
        setPetugas(
          petugasData.map((p: any) => ({
            id: p.id,
            name: p.name,
            username: p.email?.split("@")[0] || "",
            email: p.email,
            phone: p.nim || "",
            status: "Aktif" as const,
            shift: "Pagi",
            role: p.role,
          }))
        );
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data saat pertama kali
  useEffect(() => {
    refreshData();
  }, [currentView]);

  // Check auth state
  useEffect(() => {
    api.getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user.email || "User");
        const role = user.user_metadata?.role || "petugas";
        setUserRole(role);
        if (role === "admin") {
          setCurrentView("admin");
        } else if (role === "petugas") {
          setCurrentView("petugas");
        }
      }
    });
  }, []);

  // CRUD Packages
  const addPackage = async (pkg: Omit<Package, "id">) => {
    try {
      setIsLoading(true);
      const newPackage = await api.createPaket({
        name: pkg.name,
        nim: pkg.nim,
        prodi: pkg.prodi,
        phoneNumber: pkg.phone || pkg.phoneNumber || "",
        packageType: pkg.packageType || "Paket Biasa",
      });
      await refreshData();
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Gagal menambahkan paket: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePackage = async (id: string, pkg: Partial<Package>) => {
    try {
      setIsLoading(true);
      if (pkg.status) {
        await api.updatePaketStatus(id, pkg.status);
      }
      await refreshData();
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Gagal memperbarui paket: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    try {
      setIsLoading(true);
      await api.deletePaket(id);
      await refreshData();
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Gagal menghapus paket: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPickedUp = async (
    id: string,
    buktiPhoto: File,
    petugasName: string
  ) => {
    try {
      setIsLoading(true);
      await api.markPaketPickup(id, buktiPhoto);
      await refreshData();
    } catch (error) {
      console.error("Error marking package as picked up:", error);
      alert("Gagal menandai paket diambil: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Petugas (masih local, bisa diimplementasi dengan Supabase Auth nanti)
  const addPetugas = (ptgs: Omit<Petugas, "id">) => {
    // TODO: Implement with Supabase
    console.log("Add petugas:", ptgs);
  };

  const updatePetugas = (id: string, ptgs: Partial<Petugas>) => {
    // TODO: Implement with Supabase
    console.log("Update petugas:", id, ptgs);
  };

  const deletePetugas = (id: string) => {
    // TODO: Implement with Supabase
    console.log("Delete petugas:", id);
  };

  // Add Log (sudah otomatis di server)
  const addLog = (log: Omit<LogEntry, "id" | "timestamp">) => {
    // Log akan otomatis ditambahkan di server
    console.log("Log:", log);
  };

  const handleLogin = async (role: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      const { session, user } = await api.signIn(username, password);
      
      if (user) {
        const userRole = user.user_metadata?.role || role;
        setCurrentUser(user.email || username);
        setUserRole(userRole);
        
        if (userRole === "admin") {
          setCurrentView("admin");
        } else {
          setCurrentView("petugas");
        }
        
        await refreshData();
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.signOut();
      setCurrentUser("System");
      setUserRole("");
      setCurrentView("public");
      setPackages([]);
      setPetugas([]);
      setPickupHistory([]);
      setLogActivities([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const contextValue: AppContextType = {
    packages,
    petugas,
    pickupHistory,
    logActivities,
    currentUser,
    isLoading,
    refreshData,
    addPackage,
    updatePackage,
    deletePackage,
    markAsPickedUp,
    addPetugas,
    updatePetugas,
    deletePetugas,
    addLog,
  };

  if (currentView === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setCurrentView("public")}
      />
    );
  }

  if (currentView === "signup") {
    return (
      <SignUpPage
        onBack={() => setCurrentView("login")}
        onSuccess={() => setCurrentView("login")}
      />
    );
  }

  if (currentView === "petugas") {
    return (
      <AppContext.Provider value={contextValue}>
        <PetugasDashboard onLogout={handleLogout} />
      </AppContext.Provider>
    );
  }

  if (currentView === "admin") {
    return (
      <AppContext.Provider value={contextValue}>
        <AdminDashboard onLogout={handleLogout} />
      </AppContext.Provider>
    );
  }

  // Public view
  return (
    <AppContext.Provider value={contextValue}>
      <PublicNavbar onLoginClick={() => setCurrentView("login")} />
      <PublicHome />
    </AppContext.Provider>
  );
}
