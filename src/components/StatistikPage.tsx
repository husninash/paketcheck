import { Package, CheckCircle, Clock, TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../App";

const COLORS = ["#22c55e", "#ef4444"];

export function StatistikPage() {
  const { packages, pickupHistory, petugas } = useAppContext();

  // Calculate statistics
  const totalPackages = packages.length;
  const pickedUpCount = packages.filter(
    (p) => p.status === "Sudah Diambil"
  ).length;
  const notPickedUpCount = packages.filter(
    (p) => p.status === "Belum Diambil"
  ).length;
  const pickupRate =
    totalPackages > 0
      ? Math.round((pickedUpCount / totalPackages) * 100)
      : 0;

  // Status data for pie chart
  const statusData = [
    { name: "Sudah Diambil", value: pickedUpCount },
    { name: "Belum Diambil", value: notPickedUpCount },
  ];

  // Weekly data (last 7 days)
  const getWeeklyData = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date().getDay();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const dayName = days[dayIndex];
      // Count packages for this day (simplified - in production, filter by actual date)
      const count = i === 0 ? packages.length : 0;
      weeklyData.push({ name: dayName, paket: count });
    }

    return weeklyData;
  };

  // Petugas activity data
  const getPetugasActivity = () => {
    const activityMap = new Map<string, number>();

    pickupHistory.forEach((history) => {
      const count = activityMap.get(history.petugas) || 0;
      activityMap.set(history.petugas, count + 1);
    });

    return Array.from(activityMap.entries()).map(([name, paket]) => ({
      name,
      paket,
    }));
  };

  const weeklyData = getWeeklyData();
  const petugasActivity = getPetugasActivity();

  return (
    <div className="space-y-6">
      <div>
        <h2>Statistik Paket</h2>
        <p className="text-muted-foreground mt-1">
          Overview dan analisis data paket secara keseluruhan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="size-6 text-blue-600" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <p className="text-2xl text-gray-900">{totalPackages}</p>
          <p className="text-sm text-muted-foreground">Total Paket</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="size-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{pickedUpCount}</p>
          <p className="text-sm text-muted-foreground">Sudah Diambil</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Clock className="size-6 text-red-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{notPickedUpCount}</p>
          <p className="text-sm text-muted-foreground">Belum Diambil</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="size-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{pickupRate}%</p>
          <p className="text-sm text-muted-foreground">Tingkat Pengambilan</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-[14px] shadow-sm p-6">
          <h3 className="mb-4">Jumlah Paket per Minggu</h3>
          {totalPackages === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="size-16 mx-auto mb-4 opacity-20" />
                <p>Belum ada data untuk ditampilkan</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="paket" fill="#2E4D3E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="mb-4">Persentase Status Paket</h3>
          {totalPackages === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="size-16 mx-auto mb-4 opacity-20" />
                <p>Belum ada data untuk ditampilkan</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="mb-4">Aktivitas Petugas</h3>
        {petugasActivity.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="size-16 mx-auto mb-4 opacity-20" />
              <p>Belum ada aktivitas petugas</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={petugasActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="paket" fill="#2E4D3E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
