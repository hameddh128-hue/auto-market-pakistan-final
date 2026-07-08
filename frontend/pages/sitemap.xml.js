import { getAds } from "../lib/ads";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.automarketpakistan.com";

function generateSiteMap(ads) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
  <url><loc>${SITE_URL}/search</loc></url>
  <url><loc>${SITE_URL}/search?category=car</loc></url>
  <url><loc>${SITE_URL}/search?category=bike</loc></url>
  ${ads.map((ad) => `<url><loc>${SITE_URL}/ads/${ad.id}</loc></url>`).join("\n  ")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  let ads = [];
  try {
    const { ads: fetchedAds } = await getAds({ limit: 1000 });
    ads = fetchedAds;
  } catch (err) {}

  res.setHeader("Content-Type", "text/xml");
  res.write(generateSiteMap(ads));
  res.end();
  return { props: {} };
}

export default function SiteMap() {
  return null;
}
