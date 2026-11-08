# Kllezo — Dual Experience Website

One brand, two experiences, one backend. Built from the *Kllezo Dual Experience PRD* (Nov 2026).

| URL | What it is |
|---|---|
| `/` | Experience selection — "Two ways to experience growth." Returning visitors are redirected to their remembered experience; `/?choose` always shows the selector. |
| `/creative/…` | The Creative experience: **the original Kllezo website (kllezo-v3), restored** — the WebGL "universe" homepage and the original services pages. |
| `/business/…` | The Business experience: beige / forest green, SaaS-grade, interactive system visualisations. |
| `/services/<slug>`, `/work`, `/about`, `/contact` | Shared URLs. `src/proxy.ts` rewrites them into the visitor's remembered experience (default Business). Pages declare the experience URL as canonical. |

Each experience has: home, services, 9 service detail pages, work, about, contact.

## Creative = the original site (kllezo-v3)

Source of truth: `~/Documents/windows/kllezo/kllezo-v3` (git, last commit 3 Jul 2026). It is ported, not rewritten:

| Original | In the app |
|---|---|
| `index.html` + `main.js` (Three.js r134 universe) | `components/creative/Universe.tsx` hosts the markup; `components/creative/original/universe.js` is `main.js` verbatim inside a mount/destroy lifecycle |
| `services.html`, `services/*.html` | `src/content/creative-original/*.html` (verbatim), rendered by `lib/creativeOriginal.ts` + `components/creative/OriginalServices.tsx` |
| `services.js` | `components/creative/original/services-runtime.js` (verbatim, lifecycle-wrapped) |
| `style.css`, `services.css` | `components/creative/original/{universe,services}.css` — selectors scoped with `:where()` so original specificity is unchanged; fixes are marked `PORT FIX` |
| `assets/` | `public/creative/assets/` — same images, converted to WebP at original dimensions (61 MB → 5 MB); videos re-encoded H.264 with faststart |

The original presented services by system, so the nine catalogue slugs map onto its four pages (content → Content Systems, websites → Website Experiences, AI texting / calling → their own pages); each system page's canonical URL is its first slug. Contact, work and about (which the original did not have) reuse its header, glow, cursor and type system.

To re-port after editing the original: `node scripts/port-creative-original.mjs <kllezo-v3 dir> src/components/creative/original` (the stylesheets were scoped once with `scripts/scope-creative-css.mjs` and then fixed by hand — re-scoping would drop the `PORT FIX` edits).

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
- **Original metrics to verify before launch** — the restored Creative service pages keep the original site's "Validated Performance Metrics" verbatim: Content Systems (2.4M+ monthly impressions, 8.6% engagement, 98/100 brand authority), Website Experiences (99/100 Lighthouse, 3.2x conversion uplift, 0.4s load), AI Texting (92%+ qualification accuracy, <1.0s response, 40%+ booking rate), AI Calling (sub-300ms latency, 94% human equivalence, 5.2x outbound efficiency). Keep only the ones you can source; they live in `src/content/creative-original/*.html`.
- **Original content slip** — the original Website Experiences page reuses the Content Systems FAQs ("How fast can we launch the Content Engine?"). Left as-is to stay faithful; worth replacing with website FAQs.
- **Logo** — `public/brand/` holds the official green mark (from the brand logo files) and a beige version for dark surfaces, trimmed of the tagline for small sizes.
- **Contact details** — WhatsApp number and email via env vars. WhatsApp CTAs stay hidden until `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Copy review** — the "reply within one business day" promise, budget ranges (₹) and industry list in `src/content/site.ts`.

## Deploy

Vercel: set the root directory to `kllezo-website`, add the env vars from `.env.example`, run the Supabase migration.
