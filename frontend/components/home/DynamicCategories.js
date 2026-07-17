import Link from "next/link";
import AdCard from "../AdCard";

const categories = [
  { title: "Latest Cars", slug: "car", viewAll: "/search?category=car" },
  { title: "Latest Kids Cars", slug: "kids-car", viewAll: "/search?category=kids-car" },
  { title: "Latest Bikes", slug: "bike", viewAll: "/search?category=bike" },
  { title: "Latest Trucks", slug: "truck", viewAll: "/search?category=truck" },
  { title: "Latest Buses", slug: "bus", viewAll: "/search?category=bus" },
  { title: "Latest Tractors", slug: "tractor", viewAll: "/search?category=tractor" },
  { title: "Latest Spare Parts", slug: "parts", viewAll: "/search?category=parts" },
  { title: "Latest Machinery", slug: "machinery", viewAll: "/search?category=machinery" },
  { title: "Latest Showrooms", slug: "showroom", viewAll: "/search?category=showroom" },
];

export default function DynamicCategories({ ads = [] }) {
  return (
    <>
      {categories.map((section) => {
        const sectionAds = ads.filter(
          (ad) => ad.category === section.slug
        );

        if (sectionAds.length === 0) return null;

        return (
          <section
            key={section.slug}
            className="mx-auto max-w-7xl px-4 py-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {section.title}
              </h2>

              <Link
                href={section.viewAll}
                className="text-sm font-semibold text-blue-600"
              >
                
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">

              {sectionAds.map((ad) => (
                <div
                  key={ad.id}
                  className="snap-start min-w-[300px] md:min-w-[340px]"
                >
                  <AdCard ad={ad} />
                </div>
              ))}

            </div>
          </section>
        );
      })}
    </>
  );
}
