# Kllezo — website

One site. It opens on the problem, shows the services that fix it (each sold on its own), offers the managed **Kllezo Growth System** as the upgrade, and closes on why Kllezo.

| URL | What it is |
|---|---|
| `/` | Homepage: the problem as one day told twice under a live sky → sunrise → services (hire any one) → Growth System ladder → why Kllezo → real work → "not sure where to start?" diagnosis → CTA |
| `/services`, `/services/<slug>` | Every service on its own page; each ends with "Start here · add later" pairings (`src/content/pairings.ts`) |
| `/growth` | The Kllezo Growth System — managed growth, every month (the upsell) |
| `/work`, `/about`, `/contact` | Work, studio and the shared enquiry form |

Old `/creative/…` and `/business/…` URLs redirect permanently to their equivalent (see `next.config.ts`). `/creative/assets/*` are image files and stay put.

## Homepage pieces

| Section | File |
|---|---|
| Live hero (visitor's own clock and sky; macOS-style notifications) | `components/creative/home/LiveHero.tsx` |
| The day without a system / with Kllezo (scroll-scrubbed clock, scenes, LOST/WON) | `components/creative/home/DayStory.tsx` |
| Rewind between the two days | `components/creative/home/Rewind.tsx` |
| Realistic sky (dawn → midday → sunset → stars, city skyline) | `components/creative/kit/Sky.tsx` |
| CTA dock that rides along the story | `components/creative/home/StoryDock.tsx` |
| Services bento (each service hireable on its own) | `components/home/ServiceBento.tsx` |
| Growth System ladder (one service → connected → managed) | `components/home/PlanLadder.tsx` |
| Nav goes transparent over the dark story | `components/home/NavTone.tsx` + `components/business/Nav.tsx` |
| Scroll motion (Lenis + GSAP) | `components/creative/kit/Motion.tsx` |

The day, notifications and scenes are illustrative and marked as such in code.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional in development
npm run dev                  # http://localhost:3100
```

Without Supabase credentials, enquiries in development are appended to `.data/enquiries.jsonl` (git-ignored). In production, missing storage credentials return an error rather than silently dropping leads.

## Architecture

- **Single source of truth** — `src/content/services.ts` holds every division and service (deliverables, problems, outcomes, workflow, FAQs, demo type). Navigation, both service catalogues, detail pages, the enquiry form, sitemap and structured data all render from it.
- **Shared backend** — `POST /api/enquiries` (validation, honeypot, rate limit) → Supabase `enquiries` table via REST → Resend email to `KLLEZO_NOTIFY_EMAIL`. Schema: `supabase/migrations/0001_enquiries_and_case_studies.sql` (includes a `status` column for lead management).
- **Analytics** — `src/lib/analytics.ts` sends GA4 events tagged with the page: `enquiry_started`, `enquiry_submitted`, `whatsapp_click`, `diagnose_symptom`, `diagnose_cta`, `dock_cta`.
- **SEO** — per-page titles/descriptions/Open Graph and canonical URLs, `sitemap.xml`, `robots.txt`, JSON-LD (Organization, Service, FAQPage, BreadcrumbList), generated OG image.

## Content still needed from Kllezo

- **Case studies** — `src/content/work.ts` (or the `case_studies` table) is empty on purpose. The Work pages show an honest "being documented" state until approved case studies with verified results are added. Never add unverified figures — each result requires a `source`.
- **Illustrative story** — the day, notifications and scenes on the homepage are illustrative (labelled as such in code), not client data.
- **Logo** — `public/brand/` holds the official green mark (from the brand logo files) and a beige version for dark surfaces, trimmed of the tagline for small sizes.
- **Contact details** — WhatsApp number and email via env vars. WhatsApp CTAs stay hidden until `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Copy review** — the "reply within one business day" promise, budget ranges (₹) and industry list in `src/content/site.ts`.

## Deploy

Vercel: import this repository, add the env vars from `.env.example`, run the Supabase migration.
