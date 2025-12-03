import { Package, Plus, History, LogOut, BarChart3, Users, FileText } from "lucide-react";

interface DashboardSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  onLogout: () => void;
  role: "petugas" | "admin";
}

export function DashboardSidebar({
  activeMenu,
  onMenuChange,
  onLogout,
  role,
}: DashboardSidebarProps) {
  const petugasMenuItems = [
    { id: "data-paket", label: "Data Paket", icon: Package },
    { id: "tambah-paket", label: "Tambah Paket", icon: Plus },
    { id: "riwayat", label: "Riwayat Pengambilan", icon: History },
  ];

  const adminMenuItems = [
    { id: "statistik", label: "Statistik Paket", icon: BarChart3 },
    { id: "data-paket", label: "Semua Data Paket", icon: Package },
    { id: "tambah-paket", label: "Tambah Paket", icon: Plus },
    { id: "riwayat", label: "Riwayat Paket", icon: History },
    { id: "manajemen-petugas", label: "Manajemen Petugas", icon: Users },
    { id: "log-aktivitas", label: "Log Aktivitas", icon: FileText },
  ];

  const menuItems = role === "admin" ? adminMenuItems : petugasMenuItems;

  return (
    <div className="w-64 bg-[#2E4D3E] text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Package className="size-8" />
          <div>
            <h1 className="text-xl text-white">SIGAP</h1>
            <p className="text-xs text-white/60">
              {role === "admin" ? "Admin Dashboard" : "Petugas Dashboard"}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut className="size-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
