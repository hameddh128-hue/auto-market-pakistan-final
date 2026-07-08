import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useAuth } from "../../lib/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", city: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { profile, needsConfirmation } = await register(form);
      if (needsConfirmation) {
        toast.success("Account created! Check your email to confirm it, then log in.");
        router.push("/auth/login");
      } else {
        toast.success(`Account created! Welcome, ${profile.name}.`);
        router.push("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Create Account">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
        <h1 className="font-display text-2xl font-bold">Create Your Account</h1>
        <p className="mt-1 text-sm text-slate-muted">Join Auto Market Pakistan to post and save ads.</p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Full Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Email</label>
            <input required type="email" className="input-field" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Phone</label>
            <input required className="input-field" placeholder="03001234567" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">City</label>
            <input className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-muted">Password</label>
            <input required type="password" minLength={6} className="input-field" value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-muted">
          Already have an account? <Link href="/auth/login" className="font-semibold text-brand">Login</Link>
        </p>
      </div>
    </Layout>
  );
}
