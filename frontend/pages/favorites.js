import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AdCard from "../components/AdCard";
import { useAuth } from "../lib/AuthContext";
import { getFavorites } from "../lib/favorites";

export default function Favorites() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login?redirect=/favorites");
  }, [loading, user, router]);

  const fetchFavs = async () => {
    try {
      setAds(await getFavorites(user.id));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchFavs();
  }, [user]);

  if (loading || !user) return null;

  return (
    <Layout title="My Favorites">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="font-display text-2xl font-bold">My Favorites</h1>
        {fetching ? (
          <p className="mt-6 text-slate-muted">Loading...</p>
        ) : ads.length === 0 ? (
          <div className="card mt-6 p-10 text-center text-slate-muted">No favorites yet. Browse listings and tap the heart icon to save them.</div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} favorited onFavoriteChange={fetchFavs} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
