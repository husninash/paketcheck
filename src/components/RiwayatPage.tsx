import { useState } from "react";
import { Search, Eye, History } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppContext, PickupHistory } from "../App";

export function RiwayatPage() {
  const { pickupHistory } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBukti, setSelectedBukti] = useState<PickupHistory | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredHistory = pickupHistory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.includes(searchQuery) ||
      item.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewBukti = (item: PickupHistory) => {
    setSelectedBukti(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Riwayat Pengambilan Paket</h2>
        <p className="text-muted-foreground mt-1">
          Daftar paket yang telah diambil beserta bukti serah terima
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama, NIM, atau prodi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <History className="size-16 mx-auto mb-4 opacity-20" />
            <p>Belum ada riwayat pengambilan</p>
            <p className="text-sm mt-2">
              Riwayat akan muncul setelah paket ditandai sebagai sudah diambil
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
                  <th className="px-6 py-4 text-left">Tanggal Diambil</th>
                  <th className="px-6 py-4 text-left">Petugas</th>
                  <th className="px-6 py-4 text-left">Bukti Foto</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4">
                      <ImageWithFallback
                        src={item.photo}
                        alt={`Paket ${item.name}`}
                        className="size-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.nim}</td>
                    <td className="px-6 py-4">{item.prodi}</td>
                    <td className="px-6 py-4">{item.pickupDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{item.petugas}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBukti(item)}
                      >
                        <Eye className="mr-2 size-4" />
                        Lihat Bukti
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bukti Modal */}
      {selectedBukti && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bukti Serah Terima Paket</DialogTitle>
              <DialogDescription>
                {selectedBukti.name} - {selectedBukti.nim}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nama Penerima</p>
                  <p>{selectedBukti.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">NIM</p>
                  <p>{selectedBukti.nim}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Program Studi</p>
                  <p>{selectedBukti.prodi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Diambil</p>
                  <p>{selectedBukti.pickupDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Petugas</p>
                  <p>{selectedBukti.petugas}</p>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">Foto Bukti Serah Terima</p>
                <ImageWithFallback
                  src={selectedBukti.buktiPhoto}
                  alt="Bukti serah terima"
                  className="w-full max-h-[500px] object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
