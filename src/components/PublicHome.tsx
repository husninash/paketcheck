import { useState } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useAppContext } from "../App";

export function PublicHome() {
  const { packages } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkName, setCheckName] = useState("");
  const [checkNim, setCheckNim] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.prodi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.nim.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckPackage = () => {
    const found = packages.find(
      (pkg) =>
        pkg.name.toLowerCase().includes(checkName.toLowerCase()) &&
        pkg.nim === checkNim
    );
    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
      alert("Paket tidak ditemukan. Pastikan nama dan NIM sudah benar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-[#2E4D3E]/10 p-6 rounded-full">
              <Package className="size-16 text-[#2E4D3E]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2>Selamat Datang di SIGAP</h2>
              <p className="text-muted-foreground mt-2">
                Sistem Informasi Gerbang Paket - Universitas Pertahanan RI
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Cek status paket Anda dengan mudah dan cepat
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-[#2E4D3E] hover:bg-[#2E4D3E]/90">
                  <Search className="mr-2 size-4" />
                  Cek Paket Saya
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cek Status Paket</DialogTitle>
                  <DialogDescription>
                    Masukkan nama dan NIM Anda untuk mengecek status paket
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block mb-2">Nama Lengkap</label>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      value={checkName}
                      onChange={(e) => setCheckName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">NIM</label>
                    <Input
                      placeholder="Masukkan NIM"
                      value={checkNim}
                      onChange={(e) => setCheckNim(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleCheckPackage}
                    className="w-full bg-[#2E4D3E] hover:bg-[#2E4D3E]/90"
                  >
                    Cari Paket
                  </Button>
                  {searchResult && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="mb-2">
                        <strong>Status:</strong>{" "}
                        <Badge
                          className={
                            searchResult.status === "Sudah Diambil"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        >
                          {searchResult.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Tanggal Datang:</strong> {searchResult.date}
                      </p>
                      <p>
                        <strong>Program Studi:</strong> {searchResult.prodi}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, NIM, atau prodi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Belum Diambil">Belum Diambil</SelectItem>
                <SelectItem value="Sudah Diambil">Sudah Diambil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredPackages.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Package className="size-16 mx-auto mb-4 opacity-20" />
              <p>Belum ada data paket</p>
              <p className="text-sm mt-2">
                Data paket akan muncul di sini setelah petugas menambahkan paket
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2E4D3E] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">No</th>
                    <th className="px-6 py-4 text-left">Nama Penerima</th>
                    <th className="px-6 py-4 text-left">NIM</th>
                    <th className="px-6 py-4 text-left">Program Studi</th>
                    <th className="px-6 py-4 text-left">Tanggal Datang</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg, index) => (
                    <tr
                      key={pkg.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{pkg.name}</td>
                      <td className="px-6 py-4">{pkg.nim}</td>
                      <td className="px-6 py-4">{pkg.prodi}</td>
                      <td className="px-6 py-4">{pkg.date}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            pkg.status === "Sudah Diambil"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            pkg.status === "Sudah Diambil"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {pkg.status === "Sudah Diambil" ? "🟢" : "🔴"}{" "}
                          {pkg.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <p className="text-blue-900">
            ℹ️ <strong>Informasi:</strong> Silakan ambil paket di pos penjagaan
            dengan menunjukkan KTM (Kartu Tanda Mahasiswa). Paket hanya dapat
            diambil oleh penerima yang bersangkutan.
          </p>
        </div>
      </div>
    </div>
  );
}
