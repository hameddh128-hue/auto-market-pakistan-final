import Link from "next/link";
import { categories } from "./categories-data";


export default function HomeCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Browse Categories</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="min-w-[105px] min-h-[110px] rounded-2xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center"
          >
            <div className="text-3xl">{item.icon}</div>
            <div className="mt-2 text-xs text-center font-medium">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
