import { useState } from "react";

export default function SearchSection() {
  const [category, setCategory] = useState("cars");

  return (
    <section className="relative z-30 -mt-24 mb-12">
      <div className="mx-auto w-[96%] max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b bg-slate-50">
          {["Vehicles", "Cars", "Bikes", "Trucks", "Others"].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${
                category === item
                  ? "border-b-4 border-green-600 text-green-600 bg-white"
                  : "text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="grid gap-4 p-6 md:grid-cols-6">
          <input
            type="text"
            placeholder="Search vehicle..."
            className="rounded-xl border px-4 py-4 md:col-span-2"
          />

          <select className="rounded-xl border px-4 py-4">
            <option>Category</option>
          </select>

          <select className="rounded-xl border px-4 py-4">
            <option>City</option>
          </select>

          <input
            type="text"
            placeholder="Min Price"
            className="rounded-xl border px-4 py-4"
          />

          <button className="rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700">
            Search
          </button>
        </div>

      </div>
    </section>
  );
}
