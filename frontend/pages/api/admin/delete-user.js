import { createClient } from "@supabase/supabase-js";

// This route runs as a Vercel serverless function (not a separate backend
// server) and is the only place in the whole project that uses the Supabase
// SERVICE ROLE key — required because deleting a Supabase Auth user is a
// privileged operation the anon/browser client can never be allowed to do.
// SUPABASE_SERVICE_ROLE_KEY must be set as a server-only env var on Vercel
// (NOT prefixed with NEXT_PUBLIC_, so it's never sent to the browser).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({
      message: "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel > Project Settings > Environment Variables.",
    });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing auth token" });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the caller is a signed-in, non-banned admin before doing anything.
  const {
    data: { user: caller },
    error: callerError,
  } = await admin.auth.getUser(token);
  if (callerError || !caller) return res.status(401).json({ message: "Invalid session" });

  const { data: callerProfile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();
  if (callerProfile?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const { data: targetProfile } = await admin.from("profiles").select("role").eq("id", userId).single();
  if (targetProfile?.role === "admin") {
    return res.status(400).json({ message: "Cannot delete an admin" });
  }

  // Deleting the auth user cascades to `profiles` (FK on delete cascade),
  // which cascades to `ads` and `favorites` in turn.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return res.status(500).json({ message: error.message });

  return res.status(200).json({ message: "User and their ads deleted" });
}
