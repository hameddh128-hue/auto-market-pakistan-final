import Link from "next/link";
import Layout from "../components/Layout";
import AdCard from "../components/AdCard";
import { FiSearch, FiShield, FiZap, FiTrendingUp } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAds } from "../lib/ads";

export async function getServerSideProps() {
  let featuredCars = [], featuredBikes = [], latestAds = [];
  try {
    const [carsRes, bikesRes, latestRes] = await Promise.all([
      getAds({ category: "car", featured: "true", limit: 4 }),
      getAds({ category: "bike", featured: "true", limit: 4 }),
      getAds({ limit: 8 }),
    ]);
    featuredCars = carsRes.ads;
    featuredBikes = bikesRes.ads;
    latestAds = latestRes.ads;
  } catch (err) {
    // Supabase may be briefly unreachable during build/dev — fail gracefully
  }
  return { props: { featuredCars, featuredBikes, latestAds } };
}

export default function Home({ featuredCars, featuredBikes, latestAds }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`);
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="lane-divider absolute bottom-0 left-0 right-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <span className="plate-badge bg-amber text-ink border-white mb-5">ESTD. AUTO MARKET • PK</span>
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Buy & Sell Cars and Bikes <span className="text-amber">Across Pakistan</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
            Thousands of verified listings in Karachi, Lahore, Islamabad and beyond. Post your ad free and connect with buyers instantly on WhatsApp.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-2xl">
            <FiSearch className="ml-2 shrink-0 text-ink/40" size={20} />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by brand, model, or city e.g. 'Honda Civic Lahore'"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
            <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm shrink-0">Search</button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/search?category=car" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:border-amber hover:text-amber">Cars</Link>
            <Link href="/search?category=bike" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:border-amber hover:text-amber">Bikes</Link>
            <Link href="/post-ad" className="rounded-full border border-amber bg-amber/10 px-4 py-1.5 text-sm text-amber hover:bg-amber hover:text-ink">+ Post Free Ad</Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          <div className="flex items-center gap-3">
            <FiShield className="text-brand" size={28} />
            <div>
              <p className="font-semibold">Verified Listings</p>
              <p className="text-sm text-slate-muted">Every ad reviewed before going live</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiZap className="text-brand" size={28} />
            <div>
              <p className="font-semibold">Direct WhatsApp Contact</p>
              <p className="text-sm text-slate-muted">Message sellers instantly, no middleman</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiTrendingUp className="text-brand" size={28} />
            <div>
              <p className="font-semibold">Best Market Prices</p>
              <p className="text-sm text-slate-muted">Compare across cities and dealers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="font-display text-2xl font-bold">Browse by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Cars", href: "/search?category=car", emoji: "🚗" },
            { label: "Bikes", href: "/search?category=bike", emoji: "🏍️" },
            { label: "Featured", href: "/search?featured=true", emoji: "★" },
            { label: "All Listings", href: "/search", emoji: "📋" },
          ].map((c) => (
            <Link key={c.label} href={c.href} className="card flex flex-col items-center gap-2 px-4 py-8 text-center">
              <span className="text-3xl">{c.emoji}</span>
              <span className="font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      {featuredCars.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Featured Cars</h2>
            <Link href="/search?category=car&featured=true" className="text-sm font-semibold text-brand hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredCars.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        </section>
      )}

      {/* FEATURED BIKES */}
      {featuredBikes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Featured Bikes</h2>
            <Link href="/search?category=bike&featured=true" className="text-sm font-semibold text-brand hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredBikes.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        </section>
      )}

      {/* LATEST ADS */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Latest Ads</h2>
          <Link href="/search" className="text-sm font-semibold text-brand hover:underline">View All →</Link>
        </div>
        {latestAds.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latestAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <p className="text-slate-muted">No ads yet — be the first to post one!</p>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto my-12 max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-brand px-8 py-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Got a car or bike to sell?</h3>
            <p className="mt-1 text-white/80">List it free in minutes and reach thousands of buyers across Pakistan.</p>
          </div>
          <Link href="/post-ad" className="btn-amber shrink-0">Post Your Ad Now</Link>
        </div>
      </section>
    </Layout>
  );
}
