import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getShopBySlug } from "../../lib/shops";

export default function ShopPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!slug) return;
    getShopBySlug(slug).then(setShop);
  }, [slug]);

  if (!shop) {
    return (
      <Layout title="Shop">
        <p className="text-center py-10">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title={shop.name}>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">{shop.name}</h1>

        {shop.description && (
          <p className="mt-4">{shop.description}</p>
        )}

        <div className="mt-6 space-y-2">
          <p><strong>City:</strong> {shop.city}</p>
          <p><strong>Phone:</strong> {shop.phone}</p>
          <p><strong>Address:</strong> {shop.address}</p>
        </div>

        <div className="mt-6">
          <Link href="/my-shop" className="btn-amber">
            Back
          </Link>
        </div>
      </div>
    </Layout>
  );
}
