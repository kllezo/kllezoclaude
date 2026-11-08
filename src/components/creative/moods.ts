import type { Mood } from "./Still";

/** Art direction per service — the colour study used until footage is supplied. */
export const serviceMood: Record<string, Mood> = {
  "content-growth": "dusk",
  "personal-brand": "velvet",
  "video-production": "gold",
  "ugc-ad-creatives": "ember",
  "business-website": "noir",
  ecommerce: "tide",
  "lead-generation": "noir",
  "ai-texting": "tide",
  "ai-calling": "velvet",
};
