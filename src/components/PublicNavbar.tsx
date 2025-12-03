import { Package } from "lucide-react";
import { Button } from "./ui/button";

interface PublicNavbarProps {
  onLoginClick: () => void;
}

export function PublicNavbar({ onLoginClick }: PublicNavbarProps) {
  return (
    <nav className="bg-[#2E4D3E] text-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="size-8" />
            <div>
              <h1 className="text-xl text-white">SIGAP</h1>
              <p className="text-xs text-white/80">Sistem Informasi Gerbang Paket</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-white hover:text-white/80 transition-colors">Beranda</a>
            <Button 
              onClick={onLoginClick}
              className="bg-white text-[#2E4D3E] hover:bg-white/90"
            >
              Login
            </Button>
          </div>
          
          <Button 
            onClick={onLoginClick}
            className="md:hidden bg-white text-[#2E4D3E] hover:bg-white/90"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
