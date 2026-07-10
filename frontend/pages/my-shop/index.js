import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../lib/AuthContext";
import { getMyShop } from "../../lib/shops";
import Link from "next/link";

export default function MyShopPage() {
  const { user, loading } = useAuth();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!user) return;
    getMyShop(user.id)
      .then(setShop)
      .catch(console.error);
  }, [user]);

  if (loading) return null;

  return (
    <Layout title="My Shop">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">My Shop</h1>

        {!shop ? (
          <div className="card p-6">
            <p>You don't have a shop yet.</p>

            <Link
              href="/my-shop/create"
              className="btn-amber inline-block mt-4"
            >
              Create Shop
            </Link>
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-xl font-semibold">{shop.name}</h2>

            <p className="mt-2 text-slate-600">
              {shop.description || "No description"}
            </p>

            <p className="mt-3">
              <strong>City:</strong> {shop.city}
            </p>

            <p>
              <strong>Phone:</strong> {shop.phone}
            </p>

            <Link
              href={`/shop/${shop.slug}`}
              className="btn-amber inline-block mt-4"
            >
              View Shop
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
