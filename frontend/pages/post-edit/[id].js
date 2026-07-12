import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useAuth } from "../../lib/AuthContext";
import { getMyAds, updateAd } from "../../lib/ads";
import toast from "react-hot-toast";

export default function EditAd() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();

  const [loadingAd, setLoadingAd] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    category: "car",
    title: "",
    description: "",
    price: "",
    city: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (loading || !user || !id) return;

    async function loadAd() {
      try {
        const ads = await getMyAds(user.id);
        const ad = ads.find((a) => String(a.id) === String(id));

        if (!ad) {
          toast.error("Ad not found");
          router.push("/dashboard");
          return;
        }

        setForm({
          category: ad.category || "car",
          title: ad.title || "",
          description: ad.description || "",
          price: ad.price || "",
          city: ad.city || "",
          brand: ad.brand || "",
          model: ad.model || "",
          year: ad.year || "",
          mileage: ad.mileage || "",
          fuelType: ad.fuelType || "",
          transmission: ad.transmission || "",
          whatsapp: ad.whatsapp || "",
        });

        setLoadingAd(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ad");
      }
    }

    loadAd();
  }, [loading, user, id]);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateAd(id, form, [], user.id);

      toast.success("Ad updated successfully");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update ad");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingAd) {
    return (
      <Layout title="Edit Ad">
        <div className="mx-auto max-w-3xl px-4 py-10">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Ad">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Edit Ad</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="input-field w-full"
            placeholder="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <textarea
            className="input-field w-full"
            rows={5}
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <input
            className="input-field w-full"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />          <input
            className="input-field w-full"
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="Model"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />

          <input
            className="input-field w-full"
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          />

          <input
            className="input-field w-full"
            type="number"
            placeholder="Mileage"
            value={form.mileage}
            onChange={(e) => update("mileage", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="Fuel Type"
            value={form.fuelType}
            onChange={(e) => update("fuelType", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="Transmission"
            value={form.transmission}
            onChange={(e) => update("transmission", e.target.value)}
          />

          <input
            className="input-field w-full"
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
          />

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </Layout>
  );
}
