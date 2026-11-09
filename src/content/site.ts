/* Shared brand and site configuration for both experiences. */

export type Experience = "creative" | "business";


export const site = {
  name: "Kllezo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kllezo.com",
  positioning:
    "Growth doesn't come from doing more. It comes from doing the right things. We build them.",
  tagline: "Content that attracts. Websites that convert. AI that closes.",
  closing: "Kllezo is where creative thinking meets intelligent execution.",
  description:
    "Kllezo is an AI-powered digital growth and automation agency: content creation, website experiences and AI communication systems that work together as one growth system.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@kllezo.com",
  /** International format, digits only, e.g. 919876543210. Leave unset to hide WhatsApp CTAs. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const whatsappLink = (text = "Hi Kllezo, I'd like to talk about growing my business.") =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : null;

export const industries = [
  "Hospitality",
  "Restaurants & food",
  "Luxury & lifestyle",
  "Retail & e-commerce",
  "Real estate",
  "Healthcare & wellness",
  "Education",
  "Professional services",
  "Technology / SaaS",
  "Personal brand / creator",
  "Other",
];

export const budgets = [
  "Under ₹50,000",
  "₹50,000 – ₹1,50,000",
  "₹1,50,000 – ₹5,00,000",
  "₹5,00,000+",
  "Not sure yet",
];

/** Pages that exist in both experiences, in nav order. */
export const sharedPages = [
  { slug: "services", label: "Services" },
  { slug: "work", label: "Work" },
  { slug: "about", label: "About" },
  { slug: "contact", label: "Contact" },
] as const;

