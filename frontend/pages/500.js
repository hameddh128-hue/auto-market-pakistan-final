import Link from "next/link";
import Layout from "../components/Layout";
import { FiHome, FiRefreshCw } from "react-icons/fi";

export default function Custom500() {
  return (
    <Layout title="Something Went Wrong">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <span className="plate-badge mb-4 bg-amber text-ink border-ink/30">500</span>
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          Something went wrong on our end
        </h1>
        <p className="mt-3 text-sm text-slate-muted">
          Please try again in a moment. If the problem continues, head back to the
          homepage and try a different page.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn-primary !px-5 !py-2.5 text-sm">
            <FiRefreshCw /> Try Again
          </button>
          <Link href="/" className="btn-outline !px-5 !py-2.5 text-sm">
            <FiHome /> Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
