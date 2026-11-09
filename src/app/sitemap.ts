import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { p: "", priority: 1 },
    { p: "/services", priority: 0.9 },
    { p: "/growth", priority: 0.9 },
    { p: "/work", priority: 0.6 },
    { p: "/about", priority: 0.6 },
    { p: "/contact", priority: 0.8 },
  ];
  return [
    ...pages.map(({ p, priority }) => ({ url: `${site.url}${p || "/"}`, lastModified: now, changeFrequency: "monthly" as const, priority })),
    ...services.map((sv) => ({ url: `${site.url}/services/${sv.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
