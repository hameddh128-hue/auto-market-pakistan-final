import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getStats } from "../../lib/admin";
import { FiUsers, FiList, FiClock, FiCheckCircle, FiStar, FiSlash } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return <AdminLayout title="Admin Dashboard"><p className="text-slate-muted">Loading stats...</p></AdminLayout>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "bg-brand" },
    { label: "Total Ads", value: stats.totalAds, icon: <FiList />, color: "bg-ink" },
    { label: "Pending Ads", value: stats.pendingAds, icon: <FiClock />, color: "bg-amber" },
    { label: "Approved Ads", value: stats.approvedAds, icon: <FiCheckCircle />, color: "bg-green-600" },
    { label: "Featured Ads", value: stats.featuredAds, icon: <FiStar />, color: "bg-purple-600" },
    { label: "Banned Users", value: stats.bannedUsers, icon: <FiSlash />, color: "bg-red-600" },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-white ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-slate-muted">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-display text-base font-bold">Recent Ads</h2>
          <ul className="divide-y divide-ink/10">
            {stats.recentAds.map((ad) => (
              <li key={ad.id} className="flex items-center justify-between py-2 text-sm">
                <span>{ad.title}</span>
                <span className="text-xs text-slate-muted">{ad.user?.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-display text-base font-bold">Recent Users</h2>
          <ul className="divide-y divide-ink/10">
            {stats.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2 text-sm">
                <span>{u.name}</span>
                <span className="text-xs text-slate-muted">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
