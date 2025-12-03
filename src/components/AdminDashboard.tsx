import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { StatistikPage } from "./StatistikPage";
import { DataPaketPage } from "./DataPaketPage";
import { TambahPaketPage } from "./TambahPaketPage";
import { RiwayatPage } from "./RiwayatPage";
import { ManajemenPetugasPage } from "./ManajemenPetugasPage";
import { LogAktivitasPage } from "./LogAktivitasPage";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState("statistik");

  const renderContent = () => {
    switch (activeMenu) {
      case "statistik":
        return <StatistikPage />;
      case "data-paket":
        return <DataPaketPage />;
      case "tambah-paket":
        return <TambahPaketPage />;
      case "riwayat":
        return <RiwayatPage />;
      case "manajemen-petugas":
        return <ManajemenPetugasPage />;
      case "log-aktivitas":
        return <LogAktivitasPage />;
      default:
        return <StatistikPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={onLogout}
        role="admin"
      />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
