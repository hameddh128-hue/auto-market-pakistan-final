import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { FiMenu, FiX, FiHeart, FiPlusCircle, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="lane-divider" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="plate-badge bg-brand text-white border-ink">PK</span>
          <span className="font-display text-lg font-extrabold leading-none">
            Auto Market <span className="text-brand">Pakistan</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/search?category=car" className="text-sm font-medium text-ink/80 hover:text-brand">Cars</Link>
          <Link href="/search?category=bike" className="text-sm font-medium text-ink/80 hover:text-brand">Bikes</Link>
          <Link href="/search" className="text-sm font-medium text-ink/80 hover:text-brand">All Listings</Link>
          {user && (
            <Link href="/favorites" className="flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-brand">
              <FiHeart /> Favorites
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/post-ad" className="btn-amber !px-4 !py-2 text-sm">
            <FiPlusCircle /> Sell Now
          </Link>
          {user ? (
            <div className="group relative">
              <button className="flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium">
                <FiUser />{user?.name?.trim()?.split(" ")[0] || "User"}
              </button>
              <div className="invisible absolute right-0 z-10 mt-1 w-48 rounded-lg border border-ink/10 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-sand">My Ads</Link>
                <Link href="/favorites" className="block px-4 py-2 text-sm hover:bg-sand">Favorites</Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-sand">Admin Panel</Link>
                )}
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-sand"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-semibold text-ink/80 hover:text-brand">Login</Link>
              <Link href="/auth/register" className="btn-primary !px-4 !py-2 text-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/search?category=car" onClick={() => setOpen(false)}>Cars</Link>
            <Link href="/search?category=bike" onClick={() => setOpen(false)}>Bikes</Link>
            <Link href="/search" onClick={() => setOpen(false)}>All Listings</Link>
            <Link href="/post-ad" onClick={() => setOpen(false)} className="btn-amber w-full">Sell Now</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>My Ads</Link>
                <Link href="/favorites" onClick={() => setOpen(false)}>Favorites</Link>
                {user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>}
                <button onClick={() => { logout(); setOpen(false); router.push("/"); }} className="text-left text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-primary w-full">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
