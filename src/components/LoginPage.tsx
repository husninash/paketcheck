import { useState } from "react";
import { Package, Lock, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface LoginPageProps {
  onLogin: (role: string, username: string, password: string) => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && role) {
      onLogin(role, username, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E4D3E] to-[#1a2d24] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#2E4D3E] p-4 rounded-full">
              <Package className="size-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl text-[#2E4D3E] mb-2">Login SIGAP</h2>
            <p className="text-muted-foreground">
              Sistem Informasi Gerbang Paket
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="username">Username / Email</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username atau email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">Login Sebagai</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas">Petugas Paket</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2E4D3E] hover:bg-[#2E4D3E]/90"
              size="lg"
            >
              Login
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-[#2E4D3E] hover:underline"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-white/80 text-sm">
          <p>© 2025 Universitas Pertahanan</p>
          <p className="mt-1">Sistem Monitoring dan Penerimaan Paket Asrama</p>
        </div>
      </div>
    </div>
  );
}
