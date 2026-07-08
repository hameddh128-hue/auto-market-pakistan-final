import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../components/Layout";
import { useAuth } from "../lib/AuthContext";
import { getImageUrl } from "../lib/api";
import { getMyAds, deleteAd } from "../lib/ads";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiTrash2, FiEdit, FiPlusCircle } from "react-icons/fi";

const statusColors = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber/20 text-amber-dark",
  rejected: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login?redirect=/dashboard");
  }, [loading, user, router]);

  const fetchAds = async () => {
    try {
      setAds(await getMyAds(user.id));
    } catch {
      toast.error("Failed to load your ads");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchAds();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this ad permanently?")) return;
    try {
      await deleteAd(id);
      setAds((p) => p.filter((a) => a.id !== id));
      toast.success("Ad deleted");
    } catch {
      toast.error("Failed to delete ad");
    }
  };

  if (loading || !user) return null;

  return (
    <Layout title="My Ads">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">My Ads</h1>
          <Link href="/post-ad" className="btn-amber !px-4 !py-2 text-sm"><FiPlusCircle /> Post New Ad</Link>
        </div>

        {fetching ? (
          <p className="mt-6 text-slate-muted">Loading...</p>
        ) : ads.length === 0 ? (
          <div className="card mt-6 p-10 text-center text-slate-muted">You haven't posted any ads yet.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                  <Image src={getImageUrl(ad.images[0])} alt={ad.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{ad.title}</h3>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[ad.status]}`}>{ad.status}</span>
                    {ad.is_featured && <span className="rounded bg-amber/20 px-2 py-0.5 text-xs font-semibold text-amber-dark">★ Featured</span>}
                  </div>
                  <p className="text-sm text-brand font-bold mt-1">PKR {Number(ad.price).toLocaleString()}</p>
                  <p className="text-xs text-slate-muted">{ad.city} • {ad.views} views</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/ads/${ad.id}`} className="btn-outline !px-3 !py-2 text-xs">View</Link>
                  <button onClick={() => handleDelete(ad.id)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
