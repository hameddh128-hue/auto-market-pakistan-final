import Link from "next/link";

export default function FloatingSearch() {
  return (
    <div className="relative z-30 -mt-16 px-4">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)] border">

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          <input
            type="text"
            placeholder="Search vehicle..."
            className="rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-green-600"
          />

          <select className="rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-green-600">
            <option>Category</option>
            <option>Cars</option>
            <option>Bikes</option>
            <option>Trucks</option>
            <option>Buses</option>
            <option>Tractors</option>
            <option>Heavy Machinery</option>
            <option>Spare Parts</option>
          </select>

          <input
            type="text"
            placeholder="City"
            className="rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-green-600"
          />

          <input
            type="number"
            placeholder="Min Price"
            className="rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-green-600"
          />

          <input
            type="number"
            placeholder="Max Price"
            className="rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-green-600"
          />

          <Link
            href="/search"
            className="rounded-xl bg-green-600 py-4 text-center font-semibold text-white hover:bg-green-700"
          >
            Search
          </Link>

        </div>

      </div>
    </div>
  );
}
