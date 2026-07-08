import { supabase } from "./supabaseClient";

/** Returns the full ad rows (with seller info) a user has favorited. */
export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("ad_id, ads(*, user:profiles(id, name, phone))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => row.ads).filter(Boolean);
}

/** Returns just the set of ad ids a user has favorited (cheap, for badges). */
export async function getFavoriteIds(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("ad_id")
    .eq("user_id", userId);
  if (error) throw error;
  return data.map((row) => row.ad_id);
}

/** Toggles a favorite; returns the new state (true = now favorited). */
export async function toggleFavorite(userId, adId) {
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("ad_id", adId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase.from("favorites").insert({ user_id: userId, ad_id: adId });
  if (error) throw error;
  return true;
}
