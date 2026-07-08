// Ad images are now full public Supabase Storage URLs (see lib/storage.js),
// so there's no more "prepend the API host" logic — just a placeholder
// fallback for ads that somehow have no image.
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23E4F3EC'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%230E7C53' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

export const getImageUrl = (path) => {
  if (!path) return PLACEHOLDER;
  return path;
};
