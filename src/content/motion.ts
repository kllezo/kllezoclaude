/* ============================================================
   Which animation explains which line. Every problem, outcome and
   workflow step on a service page is shown as a short animation
   (components/services/Vignette.tsx) with a few-word label, so the
   point lands without reading the full sentence.
   Order matches services.ts: problems[i], outcomes[i], workflow[i].
   ============================================================ */

export type Vkind =
  // problems
  | "unread" | "cold" | "repeat" | "pingpong" | "missed" | "noShow" | "busy" | "flatViews" | "scatter" | "blind"
  | "drain" | "fewVariants" | "scrollPast" | "confused" | "dated" | "bounce" | "slow" | "ghost" | "writerBlock"
  | "mismatch" | "clones" | "countdown" | "pile" | "shaky" | "cartDrop" | "silos" | "leak" | "junkLeads"
  | "lostLead" | "tangle"
  // outcomes
  | "instantReply" | "followUp" | "booked" | "answered" | "plan" | "statement" | "match" | "calFill" | "cadence"
  | "report" | "library" | "batch" | "idea" | "formats" | "grade" | "everywhere" | "pipeline" | "variants"
  | "native" | "demo" | "premium" | "journey" | "fast" | "checkoutGo" | "connected" | "oneAction" | "filter"
  | "route" | "track"
  // steps
  | "scan" | "pillars" | "record" | "optimise" | "palette" | "brainstorm" | "script" | "hooks" | "sitemap"
  | "wireframe" | "code" | "launch" | "catalogue" | "account" | "target" | "flow" | "train" | "test" | "voice";

export type Alt = "calls" | "chat";
/** [short label, animation, variant] */
export type Beat = [string, Vkind, Alt?];
export type Step = Vkind | [Vkind, Alt];

export interface ServiceMotion {
  problems: Beat[];
  outcomes: Beat[];
  steps: Step[];
}

export const motion: Record<string, ServiceMotion> = {
  "content-growth": {
    problems: [
      ["Posting, but no reach", "flatViews"],
      ["No strategy behind it", "scatter"],
      ["Whoever has time that week", "busy"],
      ["What actually works?", "blind"],
    ],
    outcomes: [
      ["A plan your team can follow", "plan"],
      ["A calendar set in advance", "calFill"],
      ["Video on a steady beat", "cadence"],
      ["Reports that steer the next month", "report"],
    ],
    steps: ["scan", "pillars", "hooks", "record", "optimise"],
  },
  "personal-brand": {
    problems: [
      ["Expertise nobody sees", "ghost"],
      ["Not sure what to say", "writerBlock"],
      ["No time to make content", "busy"],
      ["Looks different everywhere", "mismatch"],
    ],
    outcomes: [
      ["A story you can tell anywhere", "statement"],
      ["One look, one voice", "match"],
      ["Record once, post all month", "batch"],
      ["A library of your content", "library"],
    ],
    steps: ["target", "palette", "brainstorm", "record", "everywhere"],
  },
  "video-production": {
    problems: [
      ["Looks like every competitor", "clones"],
      ["A launch that needs a film", "countdown"],
      ["Footage, but no story", "pile"],
      ["They shoot, nobody directs", "shaky"],
    ],
    outcomes: [
      ["One clear idea", "idea"],
      ["Every format you need", "formats"],
      ["Sound, motion & colour done", "grade"],
      ["Use it everywhere", "everywhere"],
    ],
    steps: ["brainstorm", "script", "record", "grade", "formats"],
  },
  "ugc-ad-creatives": {
    problems: [
      ["Ads that die in a week", "drain"],
      ["Too few versions to test", "fewVariants"],
      ["Too polished for the feed", "scrollPast"],
      ["The benefit isn't obvious", "confused"],
    ],
    outcomes: [
      ["A steady creative pipeline", "pipeline"],
      ["Hooks built for testing", "variants"],
      ["Native, scroll-stopping", "native"],
      ["Value shown in seconds", "demo"],
    ],
    steps: ["hooks", "script", "record", "variants", "optimise"],
  },
  "business-website": {
    problems: [
      ["Dated, template look", "dated"],
      ["Visitors leave silently", "bounce"],
      ["Slow on mobile", "slow"],
      ["No idea what visitors do", "blind"],
    ],
    outcomes: [
      ["A site as good as your business", "premium"],
      ["A clear path to enquiry", "journey"],
      ["Fast on every device", "fast"],
      ["See what's working", "report"],
    ],
    steps: ["scan", "sitemap", "wireframe", "code", "launch"],
  },
  ecommerce: {
    problems: [
      ["Generic next to your products", "clones"],
      ["Carts abandoned at payment", "cartDrop"],
      ["Orders, stock & shipping apart", "silos"],
      ["What sells, and why?", "blind"],
    ],
    outcomes: [
      ["A store built around your products", "premium"],
      ["A smooth checkout", "checkoutGo"],
      ["Everything connected", "connected"],
      ["The whole journey measured", "report"],
    ],
    steps: ["catalogue", "checkoutGo", "connected", "account", "launch"],
  },
  "lead-generation": {
    problems: [
      ["Clicks, but no enquiries", "leak"],
      ["Leads that aren't ready", "junkLeads"],
      ["Lost after the form", "lostLead"],
      ["Which campaign worked?", "tangle"],
    ],
    outcomes: [
      ["One page, one action", "oneAction"],
      ["Qualified at the form", "filter"],
      ["Routed instantly", "route"],
      ["Tracked from click to enquiry", "track"],
    ],
    steps: ["target", "wireframe", "filter", "route", "optimise"],
  },
  "ai-texting": {
    problems: [
      ["Replies hours late", "unread"],
      ["Leads go cold", "cold"],
      ["Same questions all day", "repeat"],
      ["Booking ping-pong", "pingpong"],
    ],
    outcomes: [
      ["Instant replies, 24/7", "instantReply"],
      ["Qualified before your team", "filter"],
      ["Follow-ups that never forget", "followUp"],
      ["Booked & reminded", "booked"],
    ],
    steps: ["flow", "train", ["connected", "chat"], "test", "optimise"],
  },
  "ai-calling": {
    problems: [
      ["Missed after hours", "missed"],
      ["Staff stuck on routine calls", "busy", "calls"],
      ["Leads never called back", "cold", "calls"],
      ["No-shows, no reminder", "noShow"],
    ],
    outcomes: [
      ["Every call answered", "answered"],
      ["Routed to the right person", "route", "calls"],
      ["Follow-up calls on time", "followUp", "calls"],
      ["Reminded before every visit", "booked"],
    ],
    steps: ["script", "voice", ["connected", "calls"], "test", "optimise"],
  },
};
