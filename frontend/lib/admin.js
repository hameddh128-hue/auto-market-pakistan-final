import { supabase } from "./supabaseClient";
import { deleteAdImages } from "./storage";

/** Dashboard statistics. Runs as the logged-in admin; RLS allows admins to
 *  see every row, so plain counts/selects work with no service role needed. */
export async function getStats() {
  const [
    { count: totalUsers },
    { count: totalAds },
    { count: pendingAds },
    { count: approvedAds },
    { count: bannedUsers },
    { count: featuredAds },
    { count: totalCars },
    { count: totalBikes },
    { data: recentAds },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ads").select("*", { count: "exact", head: true }),
    supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
    supabase.from("ads").select("*", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("ads").select("*", { count: "exact", head: true }).eq("category", "car"),
    supabase.from("ads").select("*", { count: "exact", head: true }).eq("category", "bike"),
    supabase.from("ads").select("*, user:profiles(name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalUsers, totalAds, pendingAds, approvedAds,
    bannedUsers, featuredAds, totalCars, totalBikes,
    recentAds, recentUsers,
  };
}

export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleBanUser(id, currentlyBanned) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_banned: !currentlyBanned })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Deletes a user's login + profile + ads. Requires the Supabase service
 *  role key, which must never reach the browser — so this calls a small
 *  Vercel serverless function (pages/api/admin/delete-user.js) instead of
 *  talking to Supabase directly. */
export async function deleteUser(id) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch("/api/admin/delete-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify({ userId: id }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Failed to delete user");
  return body;
}

export async function getAllAdsAdmin(status) {
  let query = supabase.from("ads").select("*, user:profiles(name, email, phone)");
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateAdStatus(id, status) {
  const { data, error } = await supabase.from("ads").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function toggleFeatureAd(id, currentlyFeatured) {
  const { data, error } = await supabase
    .from("ads")
    .update({ is_featured: !currentlyFeatured })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAdAdmin(id) {
  const { data: ad } = await supabase.from("ads").select("images").eq("id", id).single();
  const { error } = await supabase.from("ads").delete().eq("id", id);
  if (error) throw error;
  if (ad?.images) await deleteAdImages(ad.images);
}
