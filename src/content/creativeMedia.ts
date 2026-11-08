/* Original Kllezo studio assets, mapped to where the Creative experience shows them.
   Every image here is Kllezo's own work from the original site — no stock, no placeholders. */

const A = "/creative/assets";

export type Media = { src: string; w: number; h: number; alt: string };

const img = (file: string, w: number, h: number, alt: string): Media => ({ src: `${A}/${file}`, w, h, alt });

export const orbs = {
  content: img("content-creation-orb.webp", 1024, 1024, "Content Creation"),
  websites: img("websites-orb.webp", 1024, 1024, "Website Experiences"),
  calling: img("calling-orb.webp", 1024, 1024, "AI Calling Agents"),
  texting: img("texting-orb.webp", 1024, 1024, "AI Texting Agents"),
  gold: img("golden-orb.webp", 800, 800, "Kllezo golden orb"),
};

export const studioFrames: Media[] = [
  img("content/1a-1d.webp", 1672, 941, "Campaign frames: “We don’t build content. We build desire.”"),
  img("content/2.webp", 1536, 1024, "Content calendar system"),
  img("content/3.webp", 1536, 1024, "Podcast quote design"),
  img("content/4.webp", 1536, 1024, "Raw camera stream from a product shoot"),
  img("content/5.webp", 1477, 1065, "Luxury real-estate social post"),
  img("content/6.webp", 1536, 1024, "Instagram feed system"),
  img("content/7.webp", 1536, 1024, "A-roll script on set"),
  img("content/8.webp", 1536, 1024, "Engagement reporting"),
  img("content/9.webp", 1535, 1024, "Thumbnail lab"),
  img("content/10.webp", 1536, 1024, "Long-form channel design"),
  img("content/11.webp", 1536, 1024, "Production content preview"),
  img("content/12.webp", 1536, 1024, "Campaign performance overview"),
];

export const websites: Media[] = [
  img("niche-1.webp", 793, 1983, "Hospitality website"),
  img("niche-2.webp", 863, 1822, "Restaurant website"),
  img("niche-3.webp", 862, 1824, "Fitness brand website"),
  img("niche-4.webp", 853, 1844, "Automotive website"),
  img("niche-5.webp", 863, 1823, "Technology website"),
];

export const calling: Media[] = [
  img("calling-agent-1.webp", 1156, 1361, "AI voice call in progress"),
  img("calling-agent-2.webp", 1099, 1431, "Live call transcript"),
  img("calling-agent-3.webp", 1193, 1318, "Appointment secured by the voice agent"),
];

export const texting: Media[] = [
  img("kllezo-bot.webp", 852, 1846, "Kllezo AI assistant chat"),
  img("whatsapp.webp", 853, 1844, "WhatsApp conversation handled by the AI agent"),
  img("instagram.webp", 853, 1844, "Instagram DM handled by the AI agent"),
];

export const videos = {
  studio: `${A}/content-v1.mp4`,
  studio2: `${A}/content-v2.mp4`,
};

/** One image per service, for previews and service heroes. */
export const serviceMedia: Record<string, Media> = {
  "content-growth": studioFrames[1],
  "personal-brand": studioFrames[2],
  "video-production": studioFrames[10],
  "ugc-ad-creatives": studioFrames[8],
  "business-website": websites[0],
  ecommerce: websites[3],
  "lead-generation": websites[4],
  "ai-texting": texting[0],
  "ai-calling": calling[0],
};

export const serviceOrb = (slug: string, division: string): Media =>
  slug === "ai-calling" ? orbs.calling : slug === "ai-texting" ? orbs.texting : division === "websites" ? orbs.websites : orbs.content;
