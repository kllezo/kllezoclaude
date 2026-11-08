# Kllezo — Dual Experience Website

One brand, two experiences, one backend. Built from the *Kllezo Dual Experience PRD* (Nov 2026).

| URL | What it is |
|---|---|
| `/` | Experience selection — "Two ways to experience growth." Returning visitors are redirected to their remembered experience; `/?choose` always shows the selector. |
| `/creative/…` | The Creative experience, "Molten": dark, editorial and cinematic — a live liquid-gold WebGL hero, a pinned horizontal journey through the four systems, and editorial service pages. |
| `/business/…` | The Business experience: beige / forest green, SaaS-grade, interactive system visualisations. |
| `/services/<slug>`, `/work`, `/about`, `/contact` | Shared URLs. `src/proxy.ts` rewrites them into the visitor's remembered experience (default Business). Pages declare the experience URL as canonical. |

Each experience has: home, services, 9 service detail pages, work, about, contact.

## Creative — "Molten"

Designed from scratch (Nov 2026), reusing only Kllezo's own assets from the original site (`public/creative/assets/`, mapped in `src/content/creativeMedia.ts`).

| Piece | Where |
|---|---|
| Motion system — Lenis smooth scroll + GSAP ScrollTrigger; `data-cx-*` attributes for line reveals, fades, word-by-word statements, parallax, clip reveals and magnetic elements | `components/creative/kit/Motion.tsx` |
| Liquid-gold hero (one raw WebGL fragment shader, reduced resolution, pauses off-screen) | `components/creative/kit/MoltenGold.tsx` |
| Nav (hides while reading) + full-screen menu, footer, labelled cursor follower | `components/creative/kit/` |
| Home: hero, belief, pinned horizontal chapters (with live chats in the original phone frames), studio reel with scroll-velocity skew, expanding film, gold-thread method | `app/creative/page.tsx`, `components/creative/home/` |
| Services index (cursor-following previews) and service pages (problem → why it fails → answer → how it runs → deliverables/outcomes → FAQs → next) | `components/creative/ServiceIndex.tsx`, `app/creative/services/` |
| Styles (all scoped to `.cx`) | `components/creative/kit/creative.css` |

Touch screens keep native scrolling; reduced motion shows everything in place. The previous port of the original site is in git history (commit `84d5d1c`).

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
- **Experience memory** — cookie `kllezo_experience` (1 year), set by the selector, by the switch links, and by visiting either experience directly. Every page has a visible switch that keeps you on the equivalent page.
- **Transitions** — the selector expands the chosen panel into a full-screen cover and flies the logo to the nav; the experience layout (`components/shared/Arrival.tsx`) picks up the hand-off and reveals the page (gold-line letterbox for Creative, tile lift for Business).
- **Analytics** — `src/lib/analytics.ts` sends GA4 events tagged with the experience: `experience_selected`, `experience_switched`, `ecosystem_module`, `enquiry_started`, `enquiry_submitted`, `whatsapp_click`.
- **SEO** — per-page titles/descriptions/Open Graph, canonical URLs per experience, `sitemap.xml` listing both experiences, `robots.txt`, JSON-LD (Organization, Service, FAQPage, BreadcrumbList), generated OG image.

## Content still needed from Kllezo

- **Case studies** — `src/content/work.ts` (or the `case_studies` table) is empty on purpose. The Work pages show an honest "being documented" state until approved case studies with verified results are added. Never add unverified figures — each result requires a `source`.
- **Illustrative chats** — the WhatsApp and Instagram conversations in the Creative home's AI Texting chapter are illustrative (labelled as such in code), not client quotes.
- **Logo** — `public/brand/` holds the official green mark (from the brand logo files) and a beige version for dark surfaces, trimmed of the tagline for small sizes.
- **Contact details** — WhatsApp number and email via env vars. WhatsApp CTAs stay hidden until `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Copy review** — the "reply within one business day" promise, budget ranges (₹) and industry list in `src/content/site.ts`.

## Deploy

Vercel: import this repository, add the env vars from `.env.example`, run the Supabase migration.
