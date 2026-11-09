/* Start with one service; each one names the next that makes it work harder.
   This is the upgrade path from a single service to the connected stack. */
export const pairings: Record<string, { slug: string; why: string }[]> = {
  "content-growth": [
    { slug: "business-website", why: "Send the attention somewhere built to convert." },
    { slug: "ai-texting", why: "Answer every DM your content starts." },
  ],
  "personal-brand": [
    { slug: "video-production", why: "Footage that matches the brand you're building." },
    { slug: "business-website", why: "A home for the name you're making." },
  ],
  "video-production": [
    { slug: "ugc-ad-creatives", why: "Cut the shoot into ads that sell." },
    { slug: "content-growth", why: "Turn one shoot into a month of content." },
  ],
  "ugc-ad-creatives": [
    { slug: "lead-generation", why: "Land every ad click on a page built to convert." },
    { slug: "ai-texting", why: "Reply to ad enquiries in seconds." },
  ],
  "business-website": [
    { slug: "ai-texting", why: "Reply to every visitor in seconds, day or night." },
    { slug: "content-growth", why: "Bring the right people to your new site." },
  ],
  ecommerce: [
    { slug: "ugc-ad-creatives", why: "Ads that bring buyers to the store." },
    { slug: "ai-texting", why: "Answer product questions before the cart goes cold." },
  ],
  "lead-generation": [
    { slug: "ai-calling", why: "Call every new lead back within minutes." },
    { slug: "ugc-ad-creatives", why: "Creatives that fill the funnel." },
  ],
  "ai-texting": [
    { slug: "ai-calling", why: "Cover the phone as well as the chat." },
    { slug: "business-website", why: "A site that sends the agent better leads." },
  ],
  "ai-calling": [
    { slug: "ai-texting", why: "Follow every call up on WhatsApp." },
    { slug: "lead-generation", why: "More qualified calls to answer." },
  ],
};
