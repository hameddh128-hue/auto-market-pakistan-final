import Link from "next/link";
import AdCard from "../AdCard";

export default function FeaturedCars({ ads = [] }) {
  if (!ads.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Cars</h2>

        <Link
          href="/search?category=car&featured=true"
          className="text-sm font-semibold text-green-600"
        >
          View All →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="snap-start min-w-[300px] max-w-[300px]"
          >
            <AdCard ad={ad} />
          </div>
        ))}
      </div>
    </section>
  );
}
