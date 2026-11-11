/* ============================================================
   Which animation explains which line. Every problem, outcome and
   workflow step on a service page is shown as a short animation
   (components/services/Vignette.tsx) with a few-word label, so the
   point lands without reading the full sentence.
   Order matches services.ts: problems[i], outcomes[i], workflow[i].
   ============================================================ */

export type Vkind =
  // problems
  | "igFlat" | "igMess" | "lockOverdue" | "noData" | "googleMissing" | "notesBlank" | "calBusy" | "profilesMismatch"
  | "ytClones" | "launchCountdown" | "filesPile" | "shakyCam" | "adsFatigue" | "adsOne" | "feedSkip" | "adConfused"
  | "siteBounce" | "safariSlow" | "storeGeneric" | "checkoutDrop" | "silosApps" | "adsSpend" | "inboxJunk" | "formVoid"
  | "sheetMess" | "waUnread" | "waCold" | "waRepeat" | "waPingPong" | "iosMissed" | "callQueue" | "callbackList" | "calNoShow"
  // outcomes
  | "docStrategy" | "calendarReal" | "igGood" | "dashEngage" | "linkedin" | "profilesMatch" | "podcastReal" | "youtubeReal"
  | "storyboard" | "formatsReal" | "timelineReal" | "everywhere" | "thumbLab" | "adsVariants" | "ugcNative" | "demoReel"
  | "siteReal" | "siteEnquiry" | "lighthouse" | "dashCampaign" | "storeReal" | "checkoutGood" | "connectedApps"
  | "landingReal" | "qualifyForm" | "waLead" | "funnelTracked" | "waInstant" | "waQualify" | "waFollow" | "waBooked"
  | "callAnswered" | "callTranscript" | "outboundCalls" | "callBooked"
  // steps
  | "researchBoard" | "pillars" | "hooksDoc" | "cameraReal" | "target" | "palette" | "brainstorm" | "scriptReal"
  | "gradeReal" | "deliverFiles" | "sitemap" | "figmaReal" | "code" | "deployLive" | "catalogue" | "account" | "abTest"
  | "flow" | "train" | "testRun" | "convoLog" | "voice";

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
      ["You post, but nobody sees it", "igFlat"],
      ["There's no plan behind it", "igMess"],
      ["It only happens when someone has time", "lockOverdue"],
      ["Nobody knows what actually works", "noData"],
    ],
    outcomes: [
      ["A strategy your team can follow", "docStrategy"],
      ["A month planned before it starts", "calendarReal"],
      ["Content that goes out like clockwork", "igGood"],
      ["Reports that show what's working", "dashEngage"],
    ],
    steps: ["researchBoard", "pillars", "hooksDoc", "cameraReal", "dashCampaign"],
  },
  "personal-brand": {
    problems: [
      ["You're the expert. Nobody can find you.", "googleMissing"],
      ["You don't know what to say", "notesBlank"],
      ["Content always loses to the calendar", "calBusy"],
      ["Every profile looks like someone else", "profilesMismatch"],
    ],
    outcomes: [
      ["A story people remember", "linkedin"],
      ["One look, one voice, everywhere", "profilesMatch"],
      ["One session, a month of content", "podcastReal"],
      ["A library that works while you don't", "youtubeReal"],
    ],
    steps: ["target", "palette", "brainstorm", "scriptReal", "everywhere"],
  },
  "video-production": {
    problems: [
      ["Your video looks like everyone else's", "ytClones"],
      ["Launch is close. There's no film.", "launchCountdown"],
      ["Hours of footage. No story.", "filesPile"],
      ["They shoot. Nobody directs.", "shakyCam"],
    ],
    outcomes: [
      ["One clear idea, told well", "storyboard"],
      ["Every format you need", "formatsReal"],
      ["Sound, motion and colour, finished", "timelineReal"],
      ["Assets that work everywhere", "everywhere"],
    ],
    steps: ["brainstorm", "scriptReal", "cameraReal", "gradeReal", "deliverFiles"],
  },
  "ugc-ad-creatives": {
    problems: [
      ["Your ads die within a week", "adsFatigue"],
      ["One ad, nothing to test it against", "adsOne"],
      ["Too polished. Scrolled past.", "feedSkip"],
      ["Nobody gets what it does", "adConfused"],
    ],
    outcomes: [
      ["Fresh creatives, every cycle", "thumbLab"],
      ["Hooks built to be tested", "adsVariants"],
      ["Feels native. Stops the scroll.", "ugcNative"],
      ["The value lands in seconds", "demoReel"],
    ],
    steps: ["hooksDoc", "scriptReal", "cameraReal", "adsVariants", "dashCampaign"],
  },
  "business-website": {
    problems: [
      ["They can't even find you", "googleMissing"],
      ["The few who do, leave", "siteBounce"],
      ["It's slow on their phone", "safariSlow"],
      ["You can't see any of it happening", "noData"],
    ],
    outcomes: [
      ["A site as good as your business", "siteReal"],
      ["A clear path to enquire", "siteEnquiry"],
      ["Fast on every device", "lighthouse"],
      ["Every visit, measured", "dashCampaign"],
    ],
    steps: ["researchBoard", "sitemap", "figmaReal", "code", "deployLive"],
  },
  ecommerce: {
    problems: [
      ["Your store looks like a template", "storeGeneric"],
      ["Carts die at checkout", "checkoutDrop"],
      ["Orders, stock and shipping don't talk", "silosApps"],
      ["You don't know what sells, or why", "noData"],
    ],
    outcomes: [
      ["A store built around your products", "storeReal"],
      ["Checkout in one tap", "checkoutGood"],
      ["Everything connected", "connectedApps"],
      ["The whole journey, measured", "dashCampaign"],
    ],
    steps: ["catalogue", "checkoutGood", "connectedApps", "account", "deployLive"],
  },
  "lead-generation": {
    problems: [
      ["You pay for clicks, not customers", "adsSpend"],
      ["The leads you get aren't ready", "inboxJunk"],
      ["Leads die in the inbox", "formVoid"],
      ["Nobody knows which ad worked", "sheetMess"],
    ],
    outcomes: [
      ["One page, one clear action", "landingReal"],
      ["Qualified before they reach you", "qualifyForm"],
      ["On your WhatsApp in seconds", "waLead"],
      ["Every enquiry traced to its ad", "funnelTracked"],
    ],
    steps: ["target", "landingReal", "qualifyForm", "waLead", "abTest"],
  },
  "ai-texting": {
    problems: [
      ["Messages wait hours for a reply", "waUnread"],
      ["Leads go cold while you're busy", "waCold"],
      ["The same questions, all day", "waRepeat"],
      ["Booking takes ten messages", "waPingPong"],
    ],
    outcomes: [
      ["Instant replies, even at 2am", "waInstant"],
      ["Qualified before your team steps in", "waQualify"],
      ["Follow-ups that never forget", "waFollow"],
      ["Booked, confirmed and reminded", "waBooked"],
    ],
    steps: ["flow", "train", ["connectedApps", "chat"], "testRun", "convoLog"],
  },
  "ai-calling": {
    problems: [
      ["After hours, every call is missed", "iosMissed"],
      ["Your team is stuck on routine calls", "callQueue"],
      ["Call-backs that never happen", "callbackList"],
      ["No reminder, so they don't show", "calNoShow"],
    ],
    outcomes: [
      ["Every call answered, day or night", "callAnswered"],
      ["Sent to the right person", "callTranscript"],
      ["Follow-up calls, right on time", "outboundCalls"],
      ["Reminded, so they show up", "callBooked"],
    ],
    steps: [["hooksDoc", "calls"], "voice", ["connectedApps", "calls"], "testRun", "convoLog"],
  },
};
