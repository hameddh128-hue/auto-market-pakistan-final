import { supabase } from "./supabaseClient";

const BUCKET = "ad-images";

/**
 * Uploads a batch of File objects to the `ad-images` Storage bucket under
 * `<userId>/<folder>/<random>-<filename>` and returns their public URLs.
 * `folder` is typically the ad id (or "tmp" for a brand-new ad that doesn't
 * have an id yet).
 */
export async function uploadAdImages(files, userId, folder = "tmp") {
  const urls = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

/** Deletes previously-uploaded ad images given their public URLs. */
export async function deleteAdImages(urls = []) {
  if (!urls.length) return;
  const paths = urls
    .map((url) => {
      const marker = `/object/public/${BUCKET}/`;
      const idx = url.indexOf(marker);
      return idx === -1 ? null : url.slice(idx + marker.length);
    })
    .filter(Boolean);
  if (!paths.length) return;
  await supabase.storage.from(BUCKET).remove(paths);
}
