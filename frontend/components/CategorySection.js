import Link from "next/link";

const categories = [
  { label: "Cars", href: "/search?category=car", image: "/categories/cars.png" },
  { label: "Bikes", href: "/search?category=bike", image: "/categories/bikes.png" },
  { label: "Trucks", href: "/search?category=truck", image: "/categories/trucks.png" },
  { label: "Buses", href: "/search?category=bus", image: "/categories/buses.png" },
  { label: "Tractors", href: "/search?category=tractor", image: "/categories/tractors.png" },
  { label: "Heavy Machinery", href: "/search?category=machinery", image: "/categories/machinery.png" },
  { label: "Spare Parts", href: "/search?category=parts", image: "/categories/parts.png" },
  { label: "Cycles", href: "/search?category=cycle", image: "/categories/cycles.png" },
  { label: "Rickshaws", href: "/search?category=rickshaw", image: "/categories/rickshaws.png" },
  { label: "Kids Cars", href: "/search?category=kids-car", image: "/categories/kidscars.png" },
  { label: "Tyres", href: "/search?category=tyres", image: "/categories/tyres.png" },
  { label: "Batteries", href: "/search?category=battery", image: "/categories/batteries.png" },
  { label: "Oil Shop", href: "/search?category=oil", image: "/categories/oil.png" },
];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <h2 className="mb-8 text-3xl font-bold">
        Browse by Category
      </h2>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-7">
        {categories.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center group"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.label}
                className="w-32 h-32 md:w-36 md:h-36 object-contain"
              />
            </div>

            <span className="mt-3 text-sm font-semibold text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
