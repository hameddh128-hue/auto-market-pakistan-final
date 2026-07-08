import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AdCard from "../components/AdCard";
import FilterSidebar from "../components/FilterSidebar";
import { getAds } from "../lib/ads";
import { FiSearch } from "react-icons/fi";

export default function Search() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    setFilters({
      category: q.category || "",
      city: q.city || "",
      brand: q.brand || "",
      minPrice: q.minPrice || "",
      maxPrice: q.maxPrice || "",
      minYear: q.minYear || "",
      maxYear: q.maxYear || "",
      fuelType: q.fuelType || "",
      transmission: q.transmission || "",
      sort: q.sort || "",
      featured: q.featured || "",
    });
    setKeyword(q.keyword || "");
  }, [router.isReady, router.query]);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, keyword, page, limit: 12 };
      Object.keys(params).forEach((k) => (params[k] === "" ? delete params[k] : null));
      const { ads, pages } = await getAds(params);
      setAds(ads);
      setPages(pages);
    } catch (err) {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [filters, keyword, page]);

  useEffect(() => {
    if (router.isReady) fetchAds();
  }, [fetchAds, router.isReady]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAds();
  };

  return (
    <Layout title="Search Listings">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <form onSubmit={handleSearchSubmit} className="mb-6 flex items-center gap-2 rounded-xl border border-ink/10 bg-white p-2 shadow-sm">
          <FiSearch className="ml-2 text-ink/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by brand, model, city..."
            className="w-full bg-transparent px-1 py-2 text-sm outline-none"
          />
          <button type="submit" className="btn-primary !px-5 !py-2 text-sm shrink-0">Search</button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          <FilterSidebar filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} onApply={fetchAds} />

          <div>
            <p className="mb-4 text-sm text-slate-muted">{loading ? "Loading..." : `${ads.length} results found`}</p>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-xl bg-ink/5" />
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="card p-10 text-center text-slate-muted">No ads match your filters. Try adjusting your search.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
              </div>
            )}

            {pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold ${page === i + 1 ? "bg-brand text-white" : "border border-ink/15 hover:border-brand"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
