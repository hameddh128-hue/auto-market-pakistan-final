import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiMapPin, FiClock } from "react-icons/fi";
import { getImageUrl } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { useState, useEffect } from "react";
import { toggleFavorite } from "../lib/favorites";
import toast from "react-hot-toast";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [name, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${name}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

export default function AdCard({ ad, favorited, onFavoriteChange }) {
  const { user, favoriteIds, refreshFavorites } = useAuth();
  const initialFav =
    typeof favorited === "boolean" ? favorited : Boolean(favoriteIds?.includes(ad.id));
  const [isFav, setIsFav] = useState(initialFav);

  useEffect(() => {
    setIsFav(typeof favorited === "boolean" ? favorited : Boolean(favoriteIds?.includes(ad.id)));
  }, [favorited, favoriteIds, ad.id]);

  const toggleFav = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save favorites");
    try {
      const nowFav = await toggleFavorite(user.id, ad.id);
      setIsFav(nowFav);
      refreshFavorites();
      onFavoriteChange?.();
    } catch (err) {
      toast.error("Could not update favorites");
    }
  };

  return (
    <Link href={`/ads/${ad.id}`} className="card group relative block overflow-hidden min-w-[300px] md:min-w-[340px] min-w-[220px] max-w-[220px] rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative h-56 w-full overflow-hidden bg-ink/5">
        <Image
          src={getImageUrl(ad.images?.[0])}
          alt={ad.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {ad.is_featured && (
          <span className="absolute left-2 top-2 rounded bg-amber px-2 py-0.5 text-xs font-bold text-ink shadow">
            ★ Featured
          </span>
        )}
        <button
          onClick={toggleFav}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
        >
          <FiHeart className={isFav ? "fill-red-500 text-red-500" : "text-ink/60"} />
        </button>
        <span className="plate-badge absolute bottom-2 left-2 bg-white">{ad.city}</span>
      </div>
      <div className="p-3.5">
        <p className="font-display text-lg font-bold text-brand">PKR {Number(ad.price).toLocaleString()}</p>
        <h3 className="mt-0.5 truncate text-sm font-semibold text-ink">{ad.title}</h3>
        <p className="mt-1 text-xs text-slate-muted">
          {ad.year} • {Number(ad.mileage).toLocaleString()} km • {ad.fuel_type} • {ad.transmission}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-muted">
          <span className="flex items-center gap-1"><FiMapPin size={12} /> {ad.city}</span>
          <span className="flex items-center gap-1"><FiClock size={12} /> {timeAgo(ad.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
