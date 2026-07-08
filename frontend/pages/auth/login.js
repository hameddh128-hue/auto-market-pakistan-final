import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useAuth } from "../../lib/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(router.query.redirect || (user.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Login">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
        <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-muted">Login to manage your ads and favorites.</p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Email</label>
            <input required type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Password</label>
            <input required type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-muted">
          Don't have an account? <Link href="/auth/register" className="font-semibold text-brand">Sign up</Link>
        </p>
      </div>
    </Layout>
  );
}
