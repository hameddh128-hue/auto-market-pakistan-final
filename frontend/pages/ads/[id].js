import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../../components/Layout";
import { getImageUrl } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { getAdById, incrementAdViews } from "../../lib/ads";
import { toggleFavorite } from "../../lib/favorites";
import toast from "react-hot-toast";
import { FiHeart, FiMapPin, FiCalendar, FiTruck, FiDroplet, FiSettings, FiMessageCircle } from "react-icons/fi";

export async function getServerSideProps({ params }) {
  // Server-side rendering here only ever has an *anonymous* Supabase client
  // (there's no session cookie to read), so RLS will only return this ad if
  // it's already "approved". That's the common case and is great for SEO.
  // If it's null (a pending/rejected ad the owner or an admin wants to
  // preview), the component below re-fetches client-side using the visitor's
  // real signed-in session, which RLS does grant access to.
  const ad = await getAdById(params.id);
  if (ad) await incrementAdViews(params.id);
  return { props: { initialAd: ad, adId: params.id } };
}

export default function AdDetail({ initialAd, adId }) {
  const { user, loading: authLoading, favoriteIds, refreshFavorites } = useAuth();
  const router = useRouter();
  const [ad, setAd] = useState(initialAd);
  const [checkedPrivate, setCheckedPrivate] = useState(Boolean(initialAd));
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (ad || authLoading) return;
    // No public row was found during SSR — try again as the signed-in user,
    // in case this is their own pending/rejected ad (or they're an admin).
    if (!user) {
      setCheckedPrivate(true);
      return;
    }
    getAdById(adId).then((found) => {
      setAd(found);
      setCheckedPrivate(true);
      if (found) incrementAdViews(adId);
    });
  }, [ad, authLoading, user, adId]);

  useEffect(() => {
    if (!ad) return;
    setIsFav(Boolean(favoriteIds?.includes(ad.id)));
  }, [favoriteIds, ad]);

  if (!ad) {
    if (!checkedPrivate || authLoading) return null;
    return (
      <Layout title="Ad Not Found">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">This ad isn't available</h1>
          <p className="mt-2 text-sm text-slate-muted">
            It may have been removed, or is still awaiting approval.
          </p>
        </div>
      </Layout>
    );
  }

  const toggleFav = async () => {
    if (!user) return toast.error("Please login to save favorites");
    try {
      const nowFav = await toggleFavorite(user.id, ad.id);
      setIsFav(nowFav);
      refreshFavorites();
      toast.success(nowFav ? "Added to favorites" : "Removed from favorites");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const whatsappLink = `https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi, I'm interested in your ${ad.title} listed on Auto Market Pakistan for PKR ${Number(ad.price).toLocaleString()}.`
  )}`;

  return (
    <Layout title={ad.title} description={ad.description?.slice(0, 150)}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-ink/5 md:h-[420px]">
              <Image src={getImageUrl(ad.images[activeImg])} alt={ad.title} fill className="object-cover" priority />
              {ad.is_featured && (
                <span className="absolute left-3 top-3 rounded bg-amber px-2.5 py-1 text-xs font-bold text-ink shadow">★ Featured</span>
              )}
            </div>
            {ad.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {ad.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${activeImg === idx ? "border-brand" : "border-transparent"}`}
                  >
                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="card mt-6 p-6">
              <h2 className="mb-3 font-display text-lg font-bold">Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{ad.description}</p>
            </div>

            <div className="card mt-6 p-6">
              <h2 className="mb-4 font-display text-lg font-bold">Specifications</h2>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <Spec icon={<FiCalendar />} label="Year" value={ad.year} />
                <Spec icon={<FiTruck />} label="Mileage" value={`${Number(ad.mileage).toLocaleString()} km`} />
                <Spec icon={<FiDroplet />} label="Fuel" value={ad.fuel_type} />
                <Spec icon={<FiSettings />} label="Transmission" value={ad.transmission} />
                <Spec icon={<FiMapPin />} label="City" value={ad.city} />
                <Spec label="Brand / Model" value={`${ad.brand} ${ad.model}`} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="plate-badge mb-2 bg-sand">{ad.category === "car" ? "Car" : "Bike"}</p>
                  <h1 className="font-display text-xl font-bold">{ad.title}</h1>
                </div>
                <button onClick={toggleFav} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15">
                  <FiHeart className={isFav ? "fill-red-500 text-red-500" : "text-ink/50"} />
                </button>
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-brand">PKR {Number(ad.price).toLocaleString()}</p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 font-semibold text-white transition hover:bg-[#1ebd5a]"
              >
                <FiMessageCircle size={20} /> Contact on WhatsApp
              </a>

              <div className="mt-5 border-t border-ink/10 pt-4 text-sm">
                <p className="font-semibold">Seller</p>
                <p className="text-slate-muted">{ad.user?.name}</p>
              </div>
            </div>

            <div className="card p-4 text-center text-xs text-slate-muted">
              Always inspect the vehicle in person and verify documents before making any payment. Auto Market Pakistan is not responsible for transactions between buyers and sellers.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-brand">{icon}</span>}
      <div>
        <p className="text-xs text-slate-muted">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
