import { useState } from "react";
import { Upload, Save, X } from "lucide-react";
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
import { useAppContext } from "../App";

const prodiOptions = [
  "Teknik Informatika",
  "Teknik Elektro",
  "Teknik Sipil",
  "Teknik Mesin",
  "Teknik Industri",
  "Manajemen Pertahanan",
  "Hubungan Internasional",
];

export function TambahPaketPage() {
  const { addPackage } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    prodi: "",
    phone: "",
    notes: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File terlalu besar. Maksimum 5 MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
        alert("Format file tidak didukung. Gunakan .jpg, .png, atau .heic");
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preview) {
      alert("Harap upload foto paket");
      return;
    }

    // Get current date
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
    const dateString = `${day} ${month} ${year}`;

    addPackage({
      photo: preview,
      name: formData.name,
      nim: formData.nim,
      prodi: formData.prodi,
      date: dateString,
      status: "Belum Diambil",
      phone: formData.phone,
      notes: formData.notes,
    });

    // Reset form
    setFormData({
      name: "",
      nim: "",
      prodi: "",
      phone: "",
      notes: "",
    });
    setPhoto(null);
    setPreview(null);
    alert("Paket berhasil ditambahkan!");
  };

  const handleReset = () => {
    setFormData({
      name: "",
      nim: "",
      prodi: "",
      phone: "",
      notes: "",
    });
    setPhoto(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Tambah Paket Baru</h2>
        <p className="text-muted-foreground mt-1">
          Lengkapi formulir untuk mencatat paket yang baru diterima
        </p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <Label>Foto Paket *</Label>
              {!preview ? (
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2E4D3E] transition-colors">
                  <Upload className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload foto paket
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-[#2E4D3E] hover:underline">
                      Pilih file
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.heic"
                      onChange={(e) =>
                        e.target.files && handlePhotoChange(e.target.files[0])
                      }
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: .jpg, .png, .heic (Maks. 5 MB)
                  </p>
                </div>
              ) : (
                <div className="mt-2 relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Nama Penerima *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap penerima"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            {/* NIM */}
            <div>
              <Label htmlFor="nim">NIM *</Label>
              <Input
                id="nim"
                type="text"
                placeholder="Masukkan NIM"
                value={formData.nim}
                onChange={(e) =>
                  setFormData({ ...formData, nim: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            {/* Prodi */}
            <div>
              <Label htmlFor="prodi">Program Studi *</Label>
              <Select
                value={formData.prodi}
                onValueChange={(value) =>
                  setFormData({ ...formData, prodi: value })
                }
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih program studi" />
                </SelectTrigger>
                <SelectContent>
                  {prodiOptions.map((prodi) => (
                    <SelectItem key={prodi} value={prodi}>
                      {prodi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Masukkan nomor telepon (opsional)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-2"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Catatan</Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Catatan tambahan (opsional)"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4D3E] focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                <X className="mr-2 size-4" />
                Reset
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2E4D3E] hover:bg-[#2E4D3E]/90"
              >
                <Save className="mr-2 size-4" />
                Simpan Paket
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
