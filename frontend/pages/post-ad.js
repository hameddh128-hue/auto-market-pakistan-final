import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useAuth } from "../lib/AuthContext";
import { createAd } from "../lib/ads";
import toast from "react-hot-toast";
import { FiUploadCloud, FiX } from "react-icons/fi";

const BRANDS = ["Toyota", "Honda", "Suzuki", "Kia", "Hyundai", "Changan", "MG", "Yamaha", "Atlas Honda", "United", "Other"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

export default function PostAd() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    category: "car", title: "", brand: "", model: "", year: "", price: "",
    city: "", mileage: "", fuelType: "Petrol", transmission: "Manual",
    description: "", whatsapp: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to post an ad");
      router.push("/auth/login?redirect=/post-ad");
    }
  }, [loading, user, router]);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      return toast.error("Maximum 10 images allowed");
    }
    setImages((p) => [...p, ...files]);
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Please upload at least 1 image");

    setSubmitting(true);
    try {
      await createAd(form, images, user.id);
      toast.success("Ad submitted! It will be visible after admin approval.");
      router.push(`/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to post ad");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <Layout title="Post an Ad">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <h1 className="font-display text-2xl font-bold">Post Your {form.category === "car" ? "Car" : "Bike"} Ad</h1>
        <p className="mt-1 text-sm text-slate-muted">Fill in accurate details — your ad will be reviewed before going live.</p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className="input-field" value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="car">Car</option>
<option value="truck">Truck</option>
<option value="bus">Bus</option>
<option value="tractor">Tractor</option>
<option value="machinery">Heavy Machinery</option>
<option value="parts">Spare Parts</option>
                <option value="bike">Bike</option>
              </select>
            </Field>
            <Field label="Ad Title">
              <input required className="input-field" placeholder="e.g. 2020 Honda Civic Oriel" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Brand">
              <select required className="input-field" value={form.brand} onChange={(e) => update("brand", e.target.value)}>
                <option value="">Select Brand</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Model">
              <input required className="input-field" placeholder="e.g. Civic" value={form.model} onChange={(e) => update("model", e.target.value)} />
            </Field>
            <Field label="Year">
              <input required type="number" min="1970" max={new Date().getFullYear() + 1} className="input-field" value={form.year} onChange={(e) => update("year", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Price (PKR)">
              <input required type="number" className="input-field" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </Field>
            <Field label="Mileage (km)">
              <input required type="number" className="input-field" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} />
            </Field>
            <Field label="City">
              <select required className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)}>
                <option value="">Select City</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel Type">
              <select className="input-field" value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)}>
                {["Petrol", "Diesel", "CNG", "Hybrid", "Electric"].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Transmission">
              <select className="input-field" value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </Field>
          </div>

          <Field label="WhatsApp Number (with country code, e.g. 92300xxxxxxx)">
            <input required className="input-field" placeholder="923001234567" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </Field>

          <Field label="Description">
            <textarea required rows={5} className="input-field" placeholder="Describe condition, features, documents, reason for sale..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>

          <Field label={`Images (up to 10) — ${images.length}/10 selected`}>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/20 py-8 text-sm text-slate-muted hover:border-brand">
              <FiUploadCloud size={28} />
              Click to upload images
              <input type="file" accept="image/*" multiple hidden onChange={handleImages} />
            </label>
            {previews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink/10">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white">
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
            {submitting ? "Submitting..." : "Submit Ad for Review"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-muted">{label}</label>
      {children}
    </div>
  );
}
