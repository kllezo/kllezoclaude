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

Designed from scratch (Nov 2026), reusing only Kllezo's own assets from the original site (`public/creative/assets/`, mapped in `src/content/creativeMedia.ts`). Every system on the home page is something you can play with:

| Section | What it does | File |
|---|---|---|
| Loader | The wings fill with liquid gold to 100, then the frame splits (first visit per session) | `components/creative/kit/Loader.tsx` |
| Hero | Live liquid-gold WebGL shader; press and hold to heat and swirl the metal under the pointer | `components/creative/kit/MoltenGold.tsx` |
| Tapes | Two crossing tapes that surge with scroll speed | `components/creative/home/Tapes.tsx` |
| 01 Content | A phone feed you can flick — it always comes to rest on a Kllezo post | `home/ScrollStopper.tsx` |
| 02 Websites | A website builds itself as you scroll, from wireframe to the first enquiry | `home/SiteBuilder.tsx` |
| 03 AI Calling | 2:14 a.m. — the phone rings, the voice agent answers, talks it through and books | `home/NightCall.tsx` |
| 04 AI Texting | Hold to flood the inbox from every channel; every message gets answered | `home/Flood.tsx` |
| 24 hours | Scroll runs the clock from 6 a.m. to 8 a.m. while the system works through a day | `home/DayClock.tsx` |
| One system | The four orbs on gold strings — grab one and throw it | `home/Constellation.tsx` |
| Reel, film | Studio frames that skew with scroll; a film that opens to full frame | `home/Reel.tsx`, `home/Film.tsx` |

Shared: one motion system (`kit/Motion.tsx`, Lenis + GSAP ScrollTrigger, `data-cx-*` attributes), synthesized sound effects that stay off until the visitor turns them on (`kit/sfx.ts`), nav with full-screen menu, cursor follower, footer. Styles are scoped to `.cx` in `kit/creative.css`. Touch screens keep native scrolling (tap the feed phone to flick it); reduced motion shows everything in place. Calls, chats and inbox messages are illustrative.

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
- **Illustrative demos** — the call script, inbox messages and 24-hour timeline on the Creative home are illustrative (labelled as such in code), not client data.
- **Logo** — `public/brand/` holds the official green mark (from the brand logo files) and a beige version for dark surfaces, trimmed of the tagline for small sizes.
- **Contact details** — WhatsApp number and email via env vars. WhatsApp CTAs stay hidden until `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Copy review** — the "reply within one business day" promise, budget ranges (₹) and industry list in `src/content/site.ts`.

## Deploy

Vercel: import this repository, add the env vars from `.env.example`, run the Supabase migration.
