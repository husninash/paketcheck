import { useState } from "react";
import { Search, Calendar, FileText } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppContext } from "../App";

export function LogAktivitasPage() {
  const { logActivities } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = logActivities.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "create":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Tambah</Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Update</Badge>
        );
      case "delete":
        return <Badge className="bg-red-500 hover:bg-red-600">Hapus</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Log Aktivitas</h2>
        <p className="text-muted-foreground mt-1">
          Riwayat semua aktivitas yang dilakukan dalam sistem
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="create">Tambah</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Hapus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="size-16 mx-auto mb-4 opacity-20" />
            <p>Belum ada log aktivitas</p>
            <p className="text-sm mt-2">
              Aktivitas akan tercatat secara otomatis saat ada perubahan data
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2E4D3E] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Waktu</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Aksi</th>
                  <th className="px-6 py-4 text-left">Detail</th>
                  <th className="px-6 py-4 text-left">Tipe</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-muted-foreground" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">{log.user}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {log.details}
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(log.type)}</td>
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
