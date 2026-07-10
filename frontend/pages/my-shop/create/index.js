import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useAuth } from "../../../lib/AuthContext";
import { createShop } from "../../../lib/shops";

export default function CreateShop() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    phone: "",
    city: "",
    address: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createShop({
        owner_id: user.id,
        ...form,
      });

      alert("Shop created successfully");
      router.push("/my-shop");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Layout title="Create Shop">
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Create Shop</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Shop Name"
            className="w-full border rounded p-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Slug"
            className="w-full border rounded p-2"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded p-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="w-full border rounded p-2"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="City"
            className="w-full border rounded p-2"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />

          <input
            placeholder="Address"
            className="w-full border rounded p-2"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <button
            type="submit"
            className="btn-amber w-full"
          >
            Create Shop
          </button>
        </form>
      </div>
    </Layout>
  );
}
