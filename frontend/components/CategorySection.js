import Link from "next/link";
import AdCard from "./AdCard";

export default function CategorySection({
  title,
  ads = [],
  viewAll = "/search",
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>

        <Link
          href={viewAll}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">

        {ads.map((ad) => (
          <div
            key={ad.id}
            className="snap-start min-w-[290px] max-w-[290px]"
          >
            <AdCard ad={ad} />
          </div>
        ))}

      </div>

    </section>
  );
}
