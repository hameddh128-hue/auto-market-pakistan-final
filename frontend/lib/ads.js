import { supabase } from "./supabaseClient";
import { uploadAdImages, deleteAdImages } from "./storage";

const SELECT_WITH_USER = "*, user:profiles(id, name, phone, email)";

function applyFilters(query, filters) {
  const {
    keyword, category, city, brand, minPrice, maxPrice,
    minYear, maxYear, fuelType, transmission, featured, status,
  } = filters;

  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);
  if (city) query = query.ilike("city", city);
  if (brand) query = query.ilike("brand", brand);
  if (fuelType) query = query.eq("fuel_type", fuelType);
  if (transmission) query = query.eq("transmission", transmission);
  if (featured === "true" || featured === true) query = query.eq("is_featured", true);
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (minYear) query = query.gte("year", Number(minYear));
  if (maxYear) query = query.lte("year", Number(maxYear));
  if (keyword) {
    const k = keyword.replace(/[%,]/g, "");
    query = query.or(
      `title.ilike.%${k}%,brand.ilike.%${k}%,model.ilike.%${k}%,city.ilike.%${k}%,description.ilike.%${k}%`
    );
  }
  return query;
}

function applySort(query, sort) {
  if (sort === "price_asc") return query.order("price", { ascending: true });
  if (sort === "price_desc") return query.order("price", { ascending: false });
  if (sort === "year_desc") return query.order("year", { ascending: false });
  return query.order("created_at", { ascending: false });
}

/**
 * Fetch a paginated, filtered list of ads. Defaults to only "approved" ads
 * (public browsing) — pass status: null/"" explicitly to lift that (used by
 * the admin moderation screen, which is itself gated by RLS to admins only).
 */
export async function getAds({
  page = 1, limit = 12, status = "approved", ...filters
} = {}) {
  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  let query = supabase.from("ads").select(SELECT_WITH_USER, { count: "exact" });
  query = applyFilters(query, { ...filters, status });
  query = applySort(query, filters.sort);
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    ads: data,
    total: count ?? 0,
    page: Number(page),
    pages: Math.max(1, Math.ceil((count ?? 0) / Number(limit))),
  };
}

export async function getAdById(id) {
  const { data, error } = await supabase
    .from("ads")
    .select(SELECT_WITH_USER)
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

/** Fire-and-forget view counter increment (runs as a security-definer RPC). */
export async function incrementAdViews(id) {
  await supabase.rpc("increment_ad_views", { ad_id: id });
}

export async function getMyAds(userId) {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * @param {object} fields - plain form fields (category, title, brand, model,
 *   year, price, city, mileage, fuelType, transmission, description, whatsapp)
 * @param {File[]} imageFiles
 * @param {string} userId
 */
export async function createAd(fields, imageFiles, userId) {
  if (!imageFiles || imageFiles.length === 0) {
    throw new Error("Please upload at least 1 image");
  }
  if (imageFiles.length > 10) {
    throw new Error("Maximum 10 images allowed");
  }

  const images = await uploadAdImages(imageFiles, userId, "tmp");

  const { data, error } = await supabase
    .from("ads")
    .insert({
      user_id: userId,
      category: fields.category,
      title: fields.title,
      brand: fields.brand,
      model: fields.model,
      year: Number(fields.year),
      price: Number(fields.price),
      city: fields.city,
      mileage: Number(fields.mileage),
      fuel_type: fields.fuelType,
      transmission: fields.transmission,
      description: fields.description,
      whatsapp: fields.whatsapp,
      images,
    })
    .select()
    .single();

  if (error) {
    await deleteAdImages(images);
    throw error;
  }
  return data;
}

/**
 * Updates an ad. If `newImageFiles` is provided, uploads them and replaces
 * the ad's image set (and removes the old images from Storage).
 * A non-admin edit is automatically reset to "pending" by a DB trigger.
 */
export async function updateAd(id, fields, newImageFiles, userId) {
  const patch = {};
  const map = {
    title: "title", brand: "brand", model: "model", city: "city",
    description: "description", whatsapp: "whatsapp", category: "category",
    fuelType: "fuel_type", transmission: "transmission",
  };
  Object.entries(map).forEach(([from, to]) => {
    if (fields[from] !== undefined) patch[to] = fields[from];
  });
  if (fields.year !== undefined) patch.year = Number(fields.year);
  if (fields.price !== undefined) patch.price = Number(fields.price);
  if (fields.mileage !== undefined) patch.mileage = Number(fields.mileage);

  let oldImages = null;
  if (newImageFiles && newImageFiles.length > 0) {
    const { data: existing } = await supabase.from("ads").select("images").eq("id", id).single();
    oldImages = existing?.images;
    patch.images = await uploadAdImages(newImageFiles, userId, id);
  }

  const { data, error } = await supabase
    .from("ads")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (oldImages) await deleteAdImages(oldImages);
  return data;
}

export async function deleteAd(id) {
  const { data: ad } = await supabase.from("ads").select("images").eq("id", id).single();
  const { error } = await supabase.from("ads").delete().eq("id", id);
  if (error) throw error;
  if (ad?.images) await deleteAdImages(ad.images);
}
