import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DivisionId } from "@/content/services";

/* The original Kllezo Creative services pages (kllezo-v3) are kept verbatim in
   src/content/creative-original/. This reads one at build time, keeps its <body>
   markup and maps its relative links and assets onto the app's routes. */

export type OriginalPage = "services" | "content-systems" | "website-experiences" | "ai-texting-agents" | "ai-calling-agents";

/** Which original page presents each catalogue service. The original site
    presented services by system (content, websites, texting, calling). */
export function originalPageFor(slug: string, division: DivisionId): Exclude<OriginalPage, "services"> {
  if (division === "content") return "content-systems";
  if (division === "websites") return "website-experiences";
  return slug === "ai-calling" ? "ai-calling-agents" : "ai-texting-agents";
}

/** Canonical catalogue slug for each original system page. */
export const primarySlug: Record<Exclude<OriginalPage, "services">, string> = {
  "content-systems": "content-growth",
  "website-experiences": "business-website",
  "ai-texting-agents": "ai-texting",
  "ai-calling-agents": "ai-calling",
};

const ASSETS: [RegExp, string][] = [
  [/(?:\.\.\/)?assets\/content creation {2}orb\.png/g, "/creative/assets/content-creation-orb.webp"],
  [/(?:\.\.\/)?assets\/websites orb\.png/g, "/creative/assets/websites-orb.webp"],
  [/(?:\.\.\/)?assets\/texting orb\.png/g, "/creative/assets/texting-orb.webp"],
  [/(?:\.\.\/)?assets\/calling orb\.png/g, "/creative/assets/calling-orb.webp"],
  [/(?:\.\.\/)?assets\/liquid gold\.mp4/g, "/creative/assets/liquid-gold.mp4"],
  [/(?:\.\.\/)?services\/content creation\/t1\/(v[12])\.mp4/g, "/creative/assets/content-$1.mp4"],
];

export function loadOriginalPage(page: OriginalPage, enquirySlug?: string) {
  const file = path.join(process.cwd(), "src/content/creative-original", `${page}.html`);
  const src = fs.readFileSync(file, "utf8");
  const title = src.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&amp;/g, "&") ?? "KLLEZO";
  const description = src.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  let html = src.slice(src.indexOf(">", src.indexOf("<body")) + 1, src.lastIndexOf("</body>"));

  html = html.replace(/<script[\s\S]*?<\/script>/g, "");
  for (const [re, to] of ASSETS) html = html.replace(re, to);

  const contact = enquirySlug ? `/creative/contact?service=${enquirySlug}` : "/creative/contact";
  html = html
    .replace(/href="(?:\.\.\/)?index\.html"/g, 'href="/creative"')
    .replace(/href="(?:\.\.\/)?services\.html"/g, 'href="/creative/services"')
    .replace(/href="(?:services\/)?(content-systems|website-experiences|ai-texting-agents|ai-calling-agents)\.html"/g, (_, p: keyof typeof primarySlug) => `href="/creative/services/${primarySlug[p]}"`)
    .replace(/href="mailto:hello@kllezo\.com"/g, `href="${contact}"`);

  // Shared Kllezo navigation: keep the original back link and add the experience switch beside it.
  html = html.replace(/(<a [^>]*class="back-btn"[\s\S]*?<\/a>)/, '<div class="kz-head-actions">$1<a href="#" class="back-btn kz-switch" data-exp-switch><span>Business view</span></a></div>');

  // Video loading: the original autoplays every clip at once; defer those off-screen (see OriginalServices).
  html = html.replace(/<video src="([^"]+)" autoplay/g, '<video data-src="$1" preload="none" autoplay');

  return { title: title.replace(/^KLLEZO — /, ""), description, html };
}
