import { useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: {
    name: string;
    nim: string;
  };
  onConfirm: (photoFile: File | null) => void;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  packageData,
  onConfirm,
}: ConfirmationModalProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isValidated, setIsValidated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
    if (!validTypes.includes(file.type)) {
      alert("Format file harus .jpg, .png, atau .heic");
      return;
    }

    // Validasi ukuran file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleConfirm = () => {
    if (!photoFile || !isValidated) {
      alert("Harap upload foto dan centang validasi");
      return;
    }
    onConfirm(photoFile);
    // Reset state
    setPhotoFile(null);
    setPhotoPreview("");
    setIsValidated(false);
  };

  const handleCancel = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setIsValidated(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pengambilan Paket</DialogTitle>
          <DialogDescription>
            Pastikan data sudah benar dan upload foto bukti serah terima
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto">
          {/* Data Penerima */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">
                Nama Penerima
              </label>
              <p className="mt-1 p-2 bg-gray-50 rounded-lg">{packageData.name}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">NIM</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-lg">{packageData.nim}</p>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="text-sm mb-2 block">
              Upload Foto Bukti Serah Terima *
            </label>
            {!photoPreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[#2E4D3E] bg-[#2E4D3E]/5"
                    : "border-gray-300 hover:border-[#2E4D3E]"
                }`}
              >
                <Upload className="size-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop foto di sini atau
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="relative"
                >
                  Pilih File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Format: .jpg .png .heic | Max: 5MB
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={photoPreview}
                  alt="Preview foto bukti"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Checkbox Validasi */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Checkbox
              id="validation"
              checked={isValidated}
              onCheckedChange={(checked) => setIsValidated(checked as boolean)}
            />
            <label
              htmlFor="validation"
              className="text-sm leading-relaxed cursor-pointer"
            >
              Saya telah menyerahkan paket kepada penerima yang sesuai dan
              bertanggung jawab atas kebenaran data ini.
            </label>
          </div>

        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            <X className="mr-2 size-4" />
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!photoFile || !isValidated}
            className="flex-1 bg-[#2E4D3E] hover:bg-[#2E4D3E]/90"
          >
            <Check className="mr-2 size-4" />
            Simpan & Tandai Diambil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
