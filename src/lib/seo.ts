import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Service } from "@/content/services";

/** Per-page metadata with a canonical URL. */
export function pageMeta(opts: { path: string; title: string; description: string }): Metadata {
  const canonical = opts.path || "/";
  const title = opts.path ? `${opts.title} — Kllezo` : `Kllezo — ${opts.title}`;
  return {
    title,
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: opts.description,
      url: canonical,
      siteName: site.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title, description: opts.description },
  };
}

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#org`,
  name: site.name,
  url: site.url,
  slogan: site.tagline,
  description: site.description,
  email: site.email,
  areaServed: "IN",
  knowsAbout: ["Content creation", "Video production", "Website development", "E-commerce", "AI chat agents", "AI voice agents"],
});

export const serviceLd = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.name,
  description: s.summary,
  serviceType: s.name,
  url: `${site.url}/services/${s.slug}`,
  provider: { "@id": `${site.url}/#org` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${s.name} deliverables`,
    itemListElement: s.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d } })),
  },
});

export const faqLd = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
});
