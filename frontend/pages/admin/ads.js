import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "../../components/AdminLayout";
import { getImageUrl } from "../../lib/api";
import { getAllAdsAdmin, updateAdStatus, toggleFeatureAd, deleteAdAdmin } from "../../lib/admin";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiStar, FiTrash2 } from "react-icons/fi";

const TABS = ["pending", "approved", "rejected", "all"];

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    setLoading(true);
    try {
      setAds(await getAllAdsAdmin(tab));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, [tab]);

  const updateStatus = async (id, status) => {
    try {
      await updateAdStatus(id, status);
      toast.success(`Ad ${status}`);
      fetchAds();
    } catch {
      toast.error("Action failed");
    }
  };

  const toggleFeature = async (id, currentlyFeatured) => {
    try {
      await toggleFeatureAd(id, currentlyFeatured);
      fetchAds();
      toast.success("Feature status updated");
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteAd = async (id) => {
    if (!confirm("Delete this ad permanently?")) return;
    try {
      await deleteAdAdmin(id);
      setAds((p) => p.filter((a) => a.id !== id));
      toast.success("Ad deleted");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout title="Manage Ads">
      <h1 className="font-display text-2xl font-bold">Manage Ads</h1>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${tab === t ? "bg-brand text-white" : "border border-ink/15"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-muted">Loading ads...</p>
        ) : ads.length === 0 ? (
          <div className="card p-10 text-center text-slate-muted">No ads in this category.</div>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                <Image src={getImageUrl(ad.images[0])} alt={ad.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{ad.title}</h3>
                  <span className="rounded bg-sand px-2 py-0.5 text-xs font-semibold capitalize">{ad.status}</span>
                  {ad.is_featured && <span className="rounded bg-amber/20 px-2 py-0.5 text-xs font-semibold text-amber-dark">★ Featured</span>}
                </div>
                <p className="mt-1 text-sm font-bold text-brand">PKR {Number(ad.price).toLocaleString()}</p>
                <p className="text-xs text-slate-muted">By {ad.user?.name} ({ad.user?.email}) • {ad.city}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {ad.status !== "approved" && (
                  <button onClick={() => updateStatus(ad.id, "approved")} className="flex items-center gap-1 rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50">
                    <FiCheck /> Approve
                  </button>
                )}
                {ad.status !== "rejected" && (
                  <button onClick={() => updateStatus(ad.id, "rejected")} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <FiX /> Reject
                  </button>
                )}
                <button onClick={() => toggleFeature(ad.id, ad.is_featured)} className="flex items-center gap-1 rounded-lg border border-amber/40 px-3 py-2 text-xs font-semibold text-amber-dark hover:bg-amber/10">
                  <FiStar /> {ad.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => deleteAd(ad.id)} className="flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold hover:border-red-300 hover:text-red-600">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
