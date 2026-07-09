import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="lane-divider" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="plate-badge bg-amber text-ink border-white">PK</span>
            <span className="font-display text-lg font-extrabold text-white">Auto Market Pakistan</span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Pakistan's trusted marketplace to buy and sell cars and bikes — fast, simple and secure.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Browse</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/search?category=car">Cars for Sale</Link></li>
            <li><Link href="/search?category=bike">Bikes for Sale</Link></li>
            <li><Link href="/search">All Listings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Account</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/post-ad">Sell Now</Link></li>
            <li><Link href="/auth/login">Login</Link></li>
            <li><Link href="/auth/register">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Cities</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/search?city=Karachi">Karachi</Link></li>
            <li><Link href="/search?city=Lahore">Lahore</Link></li>
            <li><Link href="/search?city=Islamabad">Islamabad</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Auto Market Pakistan. All rights reserved.
      </div>
    </footer>
  );
}
