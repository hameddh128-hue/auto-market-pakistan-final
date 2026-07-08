import Link from "next/link";
import Layout from "../components/Layout";
import { FiSearch, FiHome } from "react-icons/fi";

export default function Custom404() {
  return (
    <Layout title="Page Not Found">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <span className="plate-badge mb-4 bg-amber text-ink border-ink/30">404</span>
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          We couldn't find that page
        </h1>
        <p className="mt-3 text-sm text-slate-muted">
          The page you're looking for may have been moved, sold, or never existed.
          Let's get you back on the road.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary !px-5 !py-2.5 text-sm">
            <FiHome /> Back to Home
          </Link>
          <Link href="/search" className="btn-outline !px-5 !py-2.5 text-sm">
            <FiSearch /> Browse Listings
          </Link>
        </div>
      </div>
    </Layout>
  );
}
