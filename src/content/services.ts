/* ============================================================
   Kllezo service catalogue — the single source of truth.
   Both the Creative and Business experiences render from this
   file. Change a service here and it changes everywhere:
   navigation, service pages, the enquiry form, sitemap and
   structured data.
   ============================================================ */

export type DivisionId = "content" | "websites" | "ai";

export type DemoKind =
  | "calendar"
  | "brand"
  | "film"
  | "ads"
  | "browser"
  | "store"
  | "funnel"
  | "chat"
  | "call";

export interface WorkflowStep {
  title: string;
  detail: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceVariant {
  name: string;
  points: string[];
}

export interface Service {
  slug: string;
  division: DivisionId;
  code: string;
  name: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  problems: string[];
  /** Why the usual way of solving these problems falls short — the bridge from problem to solution. */
  whyItFails: string;
  outcomes: string[];
  workflow: WorkflowStep[];
  faqs: Faq[];
  demo: DemoKind;
  variants?: ServiceVariant[];
}

export interface Division {
  id: DivisionId;
  index: string;
  name: string;
  shortName: string;
  positioning: string;
  creativeLine: string;
  businessLine: string;
}

export const divisions: Division[] = [
  {
    id: "content",
    index: "01",
    name: "Content Creation",
    shortName: "Content",
    positioning: "Content that earns attention, builds authority and drives demand.",
    creativeLine: "Stories people stop for.",
    businessLine: "A content system, not a stream of isolated posts.",
  },
  {
    id: "websites",
    index: "02",
    name: "Website Experiences",
    shortName: "Websites",
    positioning: "Digital experiences engineered to convert.",
    creativeLine: "Rooms people want to stay in.",
    businessLine: "Websites built around one job: turning visitors into enquiries.",
  },
  {
    id: "ai",
    index: "03",
    name: "AI Communication Systems",
    shortName: "AI Systems",
    positioning: "AI that responds, qualifies, follows up and converts.",
    creativeLine: "A voice that never sleeps.",
    businessLine: "Every message answered. Every call picked up. Every lead followed up.",
  },
];

export const services: Service[] = [
  /* ---------------- 01 · CONTENT CREATION ---------------- */
  {
    slug: "content-growth",
    division: "content",
    code: "C1",
    name: "Content Growth System",
    tagline: "A complete content strategy and execution system.",
    summary:
      "We research your brand and audience, design the strategy and pillars, then plan, produce, publish and refine content every month — so growth comes from a system, not from luck.",
    deliverables: [
      "Brand and audience research",
      "Content strategy",
      "Content pillars",
      "Monthly content calendars",
      "Short-form video planning",
      "Reels and Shorts production",
      "Social media content",
      "Caption and copywriting",
      "Performance analysis",
      "Content optimisation",
    ],
    problems: [
      "Posting consistently but seeing little reach or enquiry",
      "No clear strategy behind what gets published",
      "Content depends on whoever has time that week",
      "No idea which content actually drives business",
    ],
    whyItFails:
      "Most content is made week to week by whoever has time. Without research, pillars or a review loop there is nothing to learn from, so the same mistakes repeat and reach never turns into demand.",
    outcomes: [
      "A documented strategy and pillars your team can follow",
      "A predictable monthly calendar, planned in advance",
      "Short-form video produced on a steady cadence",
      "Monthly reporting that shows what works and what changes next",
    ],
    workflow: [
      { title: "Research", detail: "Brand, audience and competitor research to find what your market responds to." },
      { title: "Strategy", detail: "Positioning, content pillars and platform priorities agreed in writing." },
      { title: "Calendar", detail: "A monthly calendar with hooks, formats and captions, approved before production." },
      { title: "Production", detail: "Reels, Shorts and social content produced, edited and scheduled." },
      { title: "Optimise", detail: "Performance reviewed monthly; the next calendar is shaped by the data." },
    ],
    faqs: [
      { q: "How many posts are included each month?", a: "Volume is set in your proposal after the research stage, based on your platforms and goals rather than a fixed package." },
      { q: "Do you shoot on location?", a: "Yes. Production can be on location, in studio or a mix, depending on your brand and calendar." },
      { q: "Who approves content before it goes live?", a: "You do. Every calendar and every piece of content is shared for approval before publishing." },
    ],
    demo: "calendar",
  },
  {
    slug: "personal-brand",
    division: "content",
    code: "C2",
    name: "Personal Brand System",
    tagline: "Build a recognisable and authoritative personal brand.",
    summary:
      "For founders, experts and creators who want to be known for something specific. We define your positioning, shape your story and produce the content that builds authority over time.",
    deliverables: [
      "Personal positioning",
      "Brand identity direction",
      "Content strategy",
      "Personal storytelling",
      "Thought leadership content",
      "Founder-led video content",
      "Podcast clips",
      "Authority-building content",
      "Platform-specific content strategy",
    ],
    problems: [
      "Expertise that isn't visible online",
      "Unsure what to talk about or how to say it",
      "No time to plan, record and edit content",
      "A profile that looks inconsistent across platforms",
    ],
    whyItFails:
      "Founders and experts tend to post when inspiration strikes, in a voice that shifts from post to post. Without a defined position and a steady cadence, the audience never learns what you stand for.",
    outcomes: [
      "A clear positioning statement and story you can use everywhere",
      "A consistent visual and verbal identity",
      "A repeatable recording workflow that respects your time",
      "A library of founder-led and thought leadership content",
    ],
    workflow: [
      { title: "Positioning", detail: "Interviews to define what you stand for and who you speak to." },
      { title: "Identity", detail: "Who you are, who you help and what you stand for, and how you sound saying it." },
      { title: "Story bank", detail: "Your experiences turned into a bank of stories and talking points." },
      { title: "Record", detail: "Efficient recording sessions for video, podcast and long-form." },
      { title: "Publish", detail: "Edited clips and posts tailored to each platform, then reviewed and refined." },
    ],
    faqs: [
      { q: "How much of my time does it take?", a: "We design the workflow around batch recording sessions so your time is concentrated and predictable." },
      { q: "Do you write in my voice?", a: "Yes. Tone of voice is defined in the identity stage and every piece is approved by you." },
      { q: "Can you work with an existing podcast?", a: "Yes. We can turn existing episodes into clips and written content." },
    ],
    demo: "brand",
  },
  {
    slug: "video-production",
    division: "content",
    code: "C3",
    name: "Premium Video Production",
    tagline: "High-quality cinematic video production.",
    summary:
      "From concept to colour grade: creative direction, scripting, production and post-production for commercials, brand films and promotional video.",
    deliverables: [
      "Creative direction",
      "Concept development",
      "Scriptwriting",
      "Storyboarding",
      "Video production",
      "Cinematic editing",
      "Motion graphics",
      "Sound design",
      "Colour grading",
      "Commercial and promotional videos",
    ],
    problems: [
      "Video that looks the same as every competitor",
      "A launch or campaign that needs a hero film",
      "Footage that exists but was never shaped into a story",
      "Production partners who shoot but don't direct",
    ],
    whyItFails:
      "One-off shoots are planned around the camera, not the outcome. Footage is captured without a script or a distribution plan, so an expensive production ends up as a single post.",
    outcomes: [
      "A film with a clear concept and creative direction",
      "Cut-downs and formats for every platform you need",
      "Finished sound design, motion graphics and colour grade",
      "Assets you can use across ads, website and social",
    ],
    workflow: [
      { title: "Concept", detail: "Creative direction and concept development around a single idea." },
      { title: "Script & board", detail: "Script, shot list and storyboard approved before the shoot." },
      { title: "Production", detail: "Directed shoot with the crew and equipment the concept needs." },
      { title: "Post", detail: "Edit, motion graphics, sound design and colour grade." },
      { title: "Deliver", detail: "Master film plus platform-specific cut-downs and formats." },
    ],
    faqs: [
      { q: "Do you handle locations, talent and crew?", a: "Yes. Pre-production includes planning locations, talent and crew to match the concept and budget." },
      { q: "How long does a production take?", a: "Timelines depend on scope and are set out in your proposal before work begins." },
      { q: "Can you edit footage we already have?", a: "Yes. We can direct the edit, sound and grade on existing footage." },
    ],
    demo: "film",
  },
  {
    slug: "ugc-ad-creatives",
    division: "content",
    code: "C4",
    name: "UGC & Ad Creatives",
    tagline: "Creative assets designed for paid advertising and conversion.",
    summary:
      "Ad concepts, hooks and UGC-style creatives produced in multiple variations so your paid campaigns always have something new and testable to run.",
    deliverables: [
      "Ad concepts",
      "UGC-style creatives",
      "Product demonstrations",
      "Promotional videos",
      "Hook development",
      "Multiple creative variations",
      "Performance-oriented editing",
      "Creative testing assets",
    ],
    problems: [
      "Ads that fatigue quickly and stop performing",
      "Too few creative variations to test properly",
      "Polished ads that don't feel native to the feed",
      "Product benefits that aren't shown clearly",
    ],
    whyItFails:
      "Ads usually run on one or two creatives until they fatigue. Without a pipeline of new hooks and formats to test, costs creep up and nobody can say which message is working.",
    outcomes: [
      "A steady pipeline of testable ad creatives",
      "Hook and format variations built for structured testing",
      "Native-feeling UGC-style content",
      "Clear product demonstrations that explain the value fast",
    ],
    workflow: [
      { title: "Angles", detail: "Ad angles and hooks developed from your product and audience." },
      { title: "Scripts", detail: "Short scripts written for each angle and format." },
      { title: "Produce", detail: "UGC-style, demonstration and promotional footage produced." },
      { title: "Variations", detail: "Edited into multiple hooks, lengths and aspect ratios." },
      { title: "Iterate", detail: "Learnings from your campaign data inform the next creative batch." },
    ],
    faqs: [
      { q: "Do you run the ads as well?", a: "This service focuses on creative production. We can coordinate with your media buyer or in-house team." },
      { q: "How many variations do we receive?", a: "The number of concepts and variations is defined in your proposal according to your testing plan." },
      { q: "Which platforms do you produce for?", a: "Formats are produced for the platforms in your plan, such as Meta, YouTube and TikTok." },
    ],
    demo: "ads",
  },

  /* ---------------- 02 · WEBSITE EXPERIENCES ---------------- */
  {
    slug: "business-website",
    division: "websites",
    code: "W1",
    name: "Business Website",
    tagline: "Custom-built professional websites.",
    summary:
      "A custom website designed around your brand and your customer's decision — fast, responsive, discoverable and measured from day one.",
    deliverables: [
      "Brand-aligned UI/UX",
      "Custom website development",
      "Responsive design",
      "Interactive experiences",
      "SEO foundations",
      "Performance optimisation",
      "Contact and enquiry forms",
      "Analytics integration",
      "Deployment and launch",
    ],
    problems: [
      "Customers can't find you online — and the few who do never become customers",
      "Visitors arrive but don't get in touch",
      "Slow pages, especially on mobile",
      "No visibility into what visitors actually do",
    ],
    whyItFails:
      "Many websites are built as brochures: they describe the business but give visitors no clear path to act. Templates make them quick to launch and hard to improve.",
    outcomes: [
      "A custom site that reflects the quality of your business",
      "Clear journeys from landing to enquiry",
      "Fast, responsive pages with SEO foundations in place",
      "Analytics configured so you can see what's working",
    ],
    workflow: [
      { title: "Discovery", detail: "Goals, audience, content and competitors mapped out." },
      { title: "Architecture", detail: "Sitemap, page structure and conversion journeys defined." },
      { title: "Design", detail: "Brand-aligned UI/UX designed and approved page by page." },
      { title: "Build", detail: "Custom development, responsive layouts and integrations." },
      { title: "Launch", detail: "Performance checks, analytics, deployment and handover." },
    ],
    faqs: [
      { q: "Will I be able to update the website myself?", a: "Yes. Where you need to edit content, we set up an editing workflow suited to your team." },
      { q: "Do you write the website copy?", a: "We can. Copywriting can be included in your proposal alongside design and development." },
      { q: "Where is the website hosted?", a: "We typically deploy on modern cloud hosting such as Vercel and agree the setup with you before launch." },
    ],
    demo: "browser",
  },
  {
    slug: "ecommerce",
    division: "websites",
    code: "W2",
    name: "E-commerce Experience",
    tagline: "Custom online shopping experiences.",
    summary:
      "A complete online store — catalogue, product pages, cart, checkout, payments, orders, accounts, shipping and inventory — designed to make buying feel effortless.",
    deliverables: [
      "Product catalogue",
      "Category management",
      "Product detail pages",
      "Shopping cart",
      "Checkout",
      "Payment gateway integration",
      "Order management",
      "Customer accounts",
      "Order tracking",
      "Inventory integration",
      "Shipping integration",
      "Analytics",
    ],
    problems: [
      "A store that feels generic next to your products",
      "Customers dropping off between cart and payment",
      "Orders, stock and shipping managed in separate places",
      "No clear view of what sells and why",
    ],
    whyItFails:
      "Stores are often launched on a theme and left alone. Slow pages, thin product information and a long checkout quietly lose buyers who were ready to purchase.",
    outcomes: [
      "A branded storefront built around your products",
      "A streamlined cart and checkout flow",
      "Orders, inventory and shipping connected",
      "Analytics across the purchase journey",
    ],
    workflow: [
      { title: "Catalogue", detail: "Products, categories and data structure planned." },
      { title: "Experience", detail: "Product pages, cart and checkout journeys designed." },
      { title: "Integrations", detail: "Payments, inventory and shipping connected." },
      { title: "Accounts", detail: "Customer accounts, order history and tracking set up." },
      { title: "Launch", detail: "Testing across devices, analytics and go-live." },
    ],
    faqs: [
      { q: "Which payment gateways can you integrate?", a: "We integrate the gateway that suits your market and business, for example Razorpay, Stripe or similar providers." },
      { q: "Can you migrate an existing store?", a: "Yes. Product, customer and order migration can be scoped into your project." },
      { q: "Can it connect to our inventory system?", a: "Inventory integration is part of the service; the approach depends on the system you use today." },
    ],
    demo: "store",
  },
  {
    slug: "lead-generation",
    division: "websites",
    code: "W3",
    name: "Lead Generation Website",
    tagline: "Websites designed to turn visitors into qualified enquiries.",
    summary:
      "Conversion-focused landing pages, qualification forms and enquiry workflows — connected to WhatsApp and tracked end to end — so marketing spend turns into conversations.",
    deliverables: [
      "Conversion-focused landing pages",
      "Lead capture forms",
      "Custom enquiry workflows",
      "Qualification forms",
      "WhatsApp integration",
      "Conversion tracking",
      "CTA optimisation",
      "Analytics and reporting",
    ],
    problems: [
      "Paid traffic that doesn't turn into enquiries",
      "Enquiries that aren't qualified or ready",
      "Leads lost between the form and the follow-up",
      "No reliable way to attribute enquiries to campaigns",
    ],
    whyItFails:
      "Paid traffic is often sent to a homepage that tries to speak to everyone. Without a focused page, a qualifying form and instant follow-up, clicks become bounces instead of conversations.",
    outcomes: [
      "Landing pages built around one clear action",
      "Qualification built into the form itself",
      "Instant routing to WhatsApp, email or your CRM",
      "Conversion tracking from click to enquiry",
    ],
    workflow: [
      { title: "Offer", detail: "Audience, offer and single conversion goal defined." },
      { title: "Page", detail: "Landing page structured and written around the offer." },
      { title: "Qualify", detail: "Forms and enquiry workflows that filter and route leads." },
      { title: "Connect", detail: "WhatsApp, notifications and tracking wired up." },
      { title: "Optimise", detail: "CTAs and pages refined using real conversion data." },
    ],
    faqs: [
      { q: "Can enquiries go straight to WhatsApp?", a: "Yes. Enquiries can be routed to WhatsApp, email or your CRM, depending on your workflow." },
      { q: "Do you set up conversion tracking?", a: "Yes. Conversion tracking and reporting are included so you can see which campaigns produce enquiries." },
      { q: "Can this pair with an AI agent?", a: "Yes. Lead generation pages pair naturally with our AI texting and calling agents for instant follow-up." },
    ],
    demo: "funnel",
  },

  /* ---------------- 03 · AI COMMUNICATION SYSTEMS ---------------- */
  {
    slug: "ai-texting",
    division: "ai",
    code: "A1",
    name: "AI Texting Agents",
    tagline: "Support, sales and booking agents for WhatsApp and website chat.",
    summary:
      "AI agents that answer customer questions, qualify and nurture leads, and book appointments over WhatsApp and website chat — handing over to your team when a person is needed.",
    variants: [
      {
        name: "Customer Support Agent",
        points: [
          "Automated customer responses",
          "Frequently asked questions",
          "Product and service information",
          "Customer enquiry handling",
          "Conversation routing",
        ],
      },
      {
        name: "Sales Agent",
        points: [
          "Lead qualification",
          "Product recommendations",
          "Sales conversations",
          "Automated follow-ups",
          "Lead nurturing",
          "Enquiry management",
        ],
      },
      {
        name: "Appointment Booking Agent",
        points: [
          "Appointment scheduling",
          "Availability handling",
          "Booking confirmations",
          "Rescheduling",
          "Appointment reminders",
        ],
      },
    ],
    deliverables: [
      "Agent design for support, sales or booking",
      "Knowledge base from your products, services and FAQs",
      "Lead qualification logic",
      "Automated follow-ups and nurturing",
      "Booking and calendar handling",
      "Human handover and conversation routing",
      "WhatsApp and website chat integration",
    ],
    problems: [
      "Messages answered hours later, or not at all",
      "Leads that go cold because nobody followed up",
      "The team answering the same questions all day",
      "Bookings handled manually back and forth",
    ],
    whyItFails:
      "Generic chatbots answer FAQs but can't qualify, book or hand over properly, and shared inboxes get checked when someone has time. Leads who message after hours simply move on.",
    outcomes: [
      "Instant responses, any time of day",
      "Leads qualified before they reach your team",
      "Consistent follow-ups that don't depend on memory",
      "Appointments booked, confirmed and reminded automatically",
    ],
    workflow: [
      { title: "Map", detail: "Your conversations, questions and handover rules mapped." },
      { title: "Train", detail: "The agent is configured with your knowledge, tone and logic." },
      { title: "Integrate", detail: "Connected to WhatsApp and website chat, plus calendar and CRM where needed." },
      { title: "Test", detail: "Tested against real scenarios before going live." },
      { title: "Monitor", detail: "Conversations reviewed and the agent improved over time." },
    ],
    faqs: [
      { q: "Which channels are supported?", a: "WhatsApp and website chat are supported, depending on integration requirements." },
      { q: "What happens when the agent can't answer?", a: "Conversations are routed to your team according to handover rules we agree together." },
      { q: "Will it sound like a robot?", a: "The agent's tone is configured to match your brand, and you review its responses before launch." },
    ],
    demo: "chat",
  },
  {
    slug: "ai-calling",
    division: "ai",
    code: "A2",
    name: "AI Calling Agents",
    tagline: "Inbound and outbound AI voice agents.",
    summary:
      "Voice agents that answer incoming calls, qualify callers and book appointments — and outbound agents that follow up, qualify and remind, within approved outreach.",
    variants: [
      {
        name: "Inbound AI Voice Agent",
        points: [
          "Answers incoming calls",
          "Handles common enquiries",
          "Qualifies potential customers",
          "Captures customer information",
          "Routes calls where necessary",
          "Books appointments",
        ],
      },
      {
        name: "Outbound AI Voice Agent",
        points: [
          "Makes automated calls",
          "Follows up with leads",
          "Conducts qualification conversations",
          "Sends appointment reminders",
          "Performs approved customer outreach",
        ],
      },
    ],
    deliverables: [
      "Inbound and/or outbound voice agent design",
      "Call scripts and conversation logic",
      "Qualification and data capture",
      "Call routing and transfer rules",
      "Appointment booking integration",
      "Call summaries and logs",
    ],
    problems: [
      "Missed calls outside business hours",
      "Staff time spent on routine enquiries",
      "Leads that never receive a follow-up call",
      "No-shows because nobody sent a reminder",
    ],
    whyItFails:
      "Calls go to voicemail outside office hours, and staff spend their day on routine questions. Hiring more people is expensive, and rigid phone menus frustrate callers instead of helping them.",
    outcomes: [
      "Every inbound call answered",
      "Callers qualified and routed to the right person",
      "Timely follow-up calls to new leads",
      "Automated reminders before appointments",
    ],
    workflow: [
      { title: "Script", detail: "Call goals, scripts and qualification questions designed." },
      { title: "Voice", detail: "Voice, tone and conversation logic configured." },
      { title: "Connect", detail: "Phone numbers, routing, calendar and CRM connected." },
      { title: "Test", detail: "Calls tested end to end before going live." },
      { title: "Review", detail: "Call logs reviewed and scripts refined." },
    ],
    faqs: [
      { q: "Can calls be transferred to a person?", a: "Yes. Routing and transfer rules are part of the setup." },
      { q: "Is outbound calling compliant?", a: "Outbound agents only perform approved outreach, configured to follow the rules that apply to your market." },
      { q: "Do we get a record of each call?", a: "Call summaries and logs can be captured and shared with your team or CRM." },
    ],
    demo: "call",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const servicesIn = (division: DivisionId) => services.filter((s) => s.division === division);
export const divisionById = (id: DivisionId) => divisions.find((d) => d.id === id)!;
