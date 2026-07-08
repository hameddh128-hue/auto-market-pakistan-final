import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "./Layout";
import { useAuth } from "../lib/AuthContext";
import { FiGrid, FiUsers, FiList, FiHome } from "react-icons/fi";

export default function AdminLayout({ children, title }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login?redirect=/admin");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") return null;

  const links = [
    { href: "/admin", label: "Dashboard", icon: <FiGrid /> },
    { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
    { href: "/admin/ads", label: "Manage Ads", icon: <FiList /> },
  ];

  return (
    <Layout title={title || "Admin Panel"}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="card h-fit p-3">
          <Link href="/" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-muted hover:bg-sand">
            <FiHome /> Back to Site
          </Link>
          <nav className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${router.pathname === l.href ? "bg-brand text-white" : "hover:bg-sand"}`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </Layout>
  );
}
