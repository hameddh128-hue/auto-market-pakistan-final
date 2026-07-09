import { useState, useEffect } from "react";

const BRANDS = ["Toyota", "Honda", "Suzuki", "Kia", "Hyundai", "Changan", "MG", "Yamaha", "Atlas Honda", "United"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

export default function FilterSidebar({ filters, setFilters, onApply }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters]);

  const update = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const apply = () => {
    setFilters(local);
    onApply?.();
  };

  const reset = () => {
    const cleared = { category: "", city: "", brand: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", fuelType: "", transmission: "", sort: "" };
    setLocal(cleared);
    setFilters(cleared);
    onApply?.();
  };

  return (
    <aside className="card h-fit space-y-5 p-5">
      <h3 className="font-display text-base font-bold">Filters</h3>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Category</label>
        <select className="input-field" value={local.category || ""} onChange={(e) => update("category", e.target.value)}>
          <option value="">All</option>
          <option value="car">Cars</option>
<option value="truck">Trucks</option>
<option value="bus">Buses</option>
<option value="tractor">Tractors</option>
<option value="machinery">Heavy Machinery</option>
<option value="parts">Spare Parts</option>
          <option value="bike">Bikes</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">City</label>
        <select className="input-field" value={local.city || ""} onChange={(e) => update("city", e.target.value)}>
          <option value="">All Cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Brand</label>
        <select className="input-field" value={local.brand || ""} onChange={(e) => update("brand", e.target.value)}>
          <option value="">All Brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Price Range (PKR)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" className="input-field" value={local.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} />
          <input type="number" placeholder="Max" className="input-field" value={local.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Year Range</label>
        <div className="flex gap-2">
          <input type="number" placeholder="From" className="input-field" value={local.minYear || ""} onChange={(e) => update("minYear", e.target.value)} />
          <input type="number" placeholder="To" className="input-field" value={local.maxYear || ""} onChange={(e) => update("maxYear", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Fuel Type</label>
        <select className="input-field" value={local.fuelType || ""} onChange={(e) => update("fuelType", e.target.value)}>
          <option value="">Any</option>
          {["Petrol", "Diesel", "CNG", "Hybrid", "Electric"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Transmission</label>
        <select className="input-field" value={local.transmission || ""} onChange={(e) => update("transmission", e.target.value)}>
          <option value="">Any</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-muted">Sort By</label>
        <select className="input-field" value={local.sort || ""} onChange={(e) => update("sort", e.target.value)}>
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={apply} className="btn-primary flex-1 !py-2 text-sm">Apply</button>
        <button onClick={reset} className="btn-outline flex-1 !py-2 text-sm">Reset</button>
      </div>
    </aside>
  );
}
