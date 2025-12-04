import { useState } from "react";
import { Search, Edit, Trash2, UserPlus, Key, Users } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useAppContext } from "../App";

export function ManajemenPetugasPage() {
  const { petugas, addPetugas, deletePetugas, currentUser } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPetugas, setNewPetugas] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const filteredPetugas = petugas.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus petugas ${name}?`)) {
      deletePetugas(id.toString());
    }
  };

  const handleResetPassword = (name: string) => {
    alert(`Password untuk ${name} telah direset. Password baru telah dikirim via email.`);
  };

  const handleAddPetugas = () => {
    if (!newPetugas.name || !newPetugas.username || !newPetugas.email) {
      alert("Harap isi semua field yang wajib");
      return;
    }

    addPetugas({
      name: newPetugas.name,
      username: newPetugas.username,
      email: newPetugas.email,
      phone: newPetugas.phone,
      shift: "",  // default shift
      role: "petugas",  // default role
      status: "Aktif",
    });

    setNewPetugas({
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setIsAddDialogOpen(false);
    alert("Petugas berhasil ditambahkan!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Manajemen Petugas</h2>
        <p className="text-muted-foreground mt-1">
          Kelola akun dan data petugas paket
        </p>
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2E4D3E] hover:bg-[#2E4D3E]/90">
                <UserPlus className="mr-2 size-4" />
                Tambah Petugas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Petugas Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi formulir untuk menambahkan petugas baru
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="add-name">Nama Lengkap *</Label>
                  <Input
                    id="add-name"
                    value={newPetugas.name}
                    onChange={(e) =>
                      setNewPetugas({ ...newPetugas, name: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="add-username">Username *</Label>
                  <Input
                    id="add-username"
                    value={newPetugas.username}
                    onChange={(e) =>
                      setNewPetugas({ ...newPetugas, username: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="add-email">Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={newPetugas.email}
                    onChange={(e) =>
                      setNewPetugas({ ...newPetugas, email: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="add-phone">No. Telepon</Label>
                  <Input
                    id="add-phone"
                    value={newPetugas.phone}
                    onChange={(e) =>
                      setNewPetugas({ ...newPetugas, phone: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="add-password">Password *</Label>
                  <Input
                    id="add-password"
                    type="password"
                    value={newPetugas.password}
                    onChange={(e) =>
                      setNewPetugas({ ...newPetugas, password: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={handleAddPetugas}
                  className="w-full bg-[#2E4D3E] hover:bg-[#2E4D3E]/90"
                >
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredPetugas.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="size-16 mx-auto mb-4 opacity-20" />
            <p>Belum ada data petugas</p>
            <p className="text-sm mt-2">
              Tambahkan petugas baru dengan klik tombol "Tambah Petugas"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2E4D3E] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Nama</th>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Telepon</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPetugas.map((p, index) => (
                  <tr
                    key={p.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4">{p.username}</td>
                    <td className="px-6 py-4">{p.email}</td>
                    <td className="px-6 py-4">{p.phone}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={p.status === "Aktif" ? "default" : "destructive"}
                        className={
                          p.status === "Aktif"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(p.name)}
                          title="Reset Password"
                        >
                          <Key className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Edit">
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(Number(p.id), p.name)}
                          title="Hapus"
                        >
                          <Trash2 className="size-4" />
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
    </div>
  );
}
