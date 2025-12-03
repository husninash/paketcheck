import { useState } from "react";
import { Search, Edit, Trash2, Check, Eye, Package as PackageIcon } from "lucide-react";
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
import { ConfirmationModal } from "./ConfirmationModal";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppContext, Package } from "../App";

export function DataPaketPage() {
  const { packages, deletePackage, markAsPickedUp, currentUser, isLoading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.nim.includes(searchQuery) ||
      pkg.prodi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPickedUp = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleConfirmPickup = (photoFile: File | null) => {
    if (selectedPackage && photoFile) {
      markAsPickedUp(selectedPackage.id, photoFile, currentUser);
      setIsModalOpen(false);
      setSelectedPackage(null);
    }
  };

  const handleEdit = (pkg: Package) => {
    console.log("Edit package:", pkg);
    alert("Fitur edit paket (akan diimplementasikan)");
  };

  const handleDelete = (pkg: Package) => {
    if (confirm(`Yakin ingin menghapus paket atas nama ${pkg.name}?`)) {
      deletePackage(pkg.id);
    }
  };

  const handleViewDetail = (pkg: Package) => {
    console.log("View detail:", pkg);
    alert("Fitur detail paket (akan diimplementasikan)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Data Paket</h2>
        <p className="text-muted-foreground mt-1">
          Kelola data paket masuk dan update statusnya
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            <div className="inline-block size-16 border-4 border-gray-200 border-t-[#2E4D3E] rounded-full animate-spin mb-4"></div>
            <p>Memuat data paket...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <PackageIcon className="size-16 mx-auto mb-4 opacity-20" />
            <p>Belum ada data paket</p>
            <p className="text-sm mt-2">
              Tambahkan paket baru melalui menu "Tambah Paket"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2E4D3E] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Foto Paket</th>
                  <th className="px-6 py-4 text-left">Nama</th>
                  <th className="px-6 py-4 text-left">NIM</th>
                  <th className="px-6 py-4 text-left">Prodi</th>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4">
                      <ImageWithFallback
                        src={pkg.photo}
                        alt={`Paket ${pkg.name}`}
                        className="size-16 object-cover rounded-lg"
                      />
                    </td>
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
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetail(pkg)}
                          title="Lihat Detail"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(pkg)}
                          title="Edit"
                        >
                          <Edit className="size-4 text-blue-600" />
                        </Button>
                        {pkg.status === "Belum Diambil" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsPickedUp(pkg)}
                            title="Tandai Sudah Diambil"
                          >
                            <Check className="size-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(pkg)}
                          title="Hapus"
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedPackage && (
        <ConfirmationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          packageData={{
            name: selectedPackage.name,
            nim: selectedPackage.nim,
          }}
          onConfirm={handleConfirmPickup}
        />
      )}
    </div>
  );
}
