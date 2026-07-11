import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMyShop, updateShop } from "../../../lib/shops";

export default function EditShop() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    loadShop();
  }, []);

  async function loadShop() {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) return;
const shop = await getMyShop(user.id);
    if (!shop) {
      alert("No shop found.");
      router.push("/my-shop/create");
      return;
    }

    setForm({
      id: shop.id,
      name: shop.name || "",
      description: shop.description || "",
      phone: shop.phone || "",
      city: shop.city || "",
      address: shop.address || "",
    });

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      id: shop.id,
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      await updateShop(form.id, form);

      alert("Shop updated successfully.");

      router.push("/my-shop");
    } catch (err) {
      console.error(err);
      alert("Failed to update shop.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Edit Shop
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >        <div>
          <label className="block mb-1 font-medium">
            Shop Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            City
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Address
          </label>
          <textarea
            name="address"
            rows="3"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
