import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { primarySlug } from "@/lib/creativeOriginal";

/* Both experiences are listed with their own canonical URLs so each
   is independently discoverable. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/services", "/work", "/about", "/contact"];
  const entries: MetadataRoute.Sitemap = [{ url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 }];

  for (const exp of ["business", "creative"] as const) {
    for (const p of pages) {
      entries.push({
        url: `${site.url}/${exp}${p}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: p === "" ? 0.9 : p === "/services" ? 0.8 : 0.6,
      });
    }
    // Creative presents services by system (the original site's four pages), so only
    // each system page's canonical URL is listed; Business has one page per service.
    const slugs = exp === "creative" ? Object.values(primarySlug) : services.map((sv) => sv.slug);
    for (const slug of slugs) {
      entries.push({ url: `${site.url}/${exp}/services/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  return entries;
}
