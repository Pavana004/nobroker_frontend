import type { MetadataRoute } from "next";
import { Property } from "@/types";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// Note: at real 10k+ scale, split this into a sitemap index referencing
// multiple paginated sitemap files (Google's limit is 50,000 URLs per
// sitemap) — see docs/SEO_STRATEGY.md.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "hourly", priority: 0.9 },
  ];

  const result = await serverFetch<Property[]>("/properties/search?limit=50", 3600);
  const propertyRoutes: MetadataRoute.Sitemap = (result ?? []).map((property) => ({
    url: `${SITE_URL}/properties/${property.id}`,
    lastModified: property.updatedAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
