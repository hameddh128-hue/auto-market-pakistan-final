import { supabase } from "./supabaseClient";

export async function getMyShop(userId) {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createShop(shop) {
  const { data, error } = await supabase
    .from("shops")
    .insert(shop)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShop(id, shop) {
  const { data, error } = await supabase
    .from("shops")
    .update(shop)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShopBySlug(slug) {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
