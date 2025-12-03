import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DataPaketPage } from "./DataPaketPage";
import { TambahPaketPage } from "./TambahPaketPage";
import { RiwayatPage } from "./RiwayatPage";

interface PetugasDashboardProps {
  onLogout: () => void;
}

export function PetugasDashboard({ onLogout }: PetugasDashboardProps) {
  const [activeMenu, setActiveMenu] = useState("data-paket");

  const renderContent = () => {
    switch (activeMenu) {
      case "data-paket":
        return <DataPaketPage />;
      case "tambah-paket":
        return <TambahPaketPage />;
      case "riwayat":
        return <RiwayatPage />;
      default:
        return <DataPaketPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={onLogout}
        role="petugas"
      />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
