import { useState, useEffect } from "react";
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
    toast.error("Failed to update ad");
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
      <h1 className="text-2xl font-bold">Edit Ad</h1>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">

        <div>
          <label>Title</label>
          <input
            className="input-field"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            className="input-field"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>
        <div>
          <label>City</label>
          <input
            className="input-field"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>

        <div>
          <label>Brand</label>
          <input
            className="input-field"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
        </div>

        <div>
          <label>Model</label>
          <input
            className="input-field"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows={5}
            className="input-field"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

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

