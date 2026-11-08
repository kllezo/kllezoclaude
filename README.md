# Kllezo — Dual Experience Website

One brand, two experiences, one backend. Built from the *Kllezo Dual Experience PRD* (Nov 2026).

| URL | What it is |
|---|---|
| `/` | Experience selection — "Two ways to experience growth." Returning visitors are redirected to their remembered experience; `/?choose` always shows the selector. |
| `/creative/…` | The Creative experience, "Molten": dark, editorial and cinematic — a live liquid-gold WebGL hero, a pinned horizontal journey through the four systems, and editorial service pages. |
| `/business/…` | The Business experience: beige / forest green, SaaS-grade, interactive system visualisations. |
| `/services/<slug>`, `/work`, `/about`, `/contact` | Shared URLs. `src/proxy.ts` rewrites them into the visitor's remembered experience (default Business). Pages declare the experience URL as canonical. |

Each experience has: home, services, 9 service detail pages, work, about, contact.

## Business — problem first

The Business home tells visitors their problem before it sells anything, then shows Kllezo solving it:

| Section | What it does | File |
|---|---|---|
| Hero | "You're not short of customers. You're losing them." beside a live lead-flow simulation you can switch between *Without a system* and *With Kllezo* (illustrative) | `components/business/LeakSimulator.tsx` |
| The problem | Three disconnected vendors drawn as leaking pipes | `components/business/LeakDiagram.tsx` |
| Diagnosis | Visitors tick the problems that sound familiar; a plan of the exact services builds beside them and carries into the enquiry form (`?service=…`) | `components/business/Diagnose.tsx` |
| From problem to solved | Four case files: the problem in the customer's words → why it keeps happening → how we solve it → how it works → what changes (all from the service catalogue) | `components/business/ProblemFiles.tsx` |
| Then | One-system divisions index, AI lead flow demo, method, work, why Kllezo, measured journey, CTA | `app/business/page.tsx` |

## Creative — "One day, told twice"

The Creative home is a problem-first story, scrubbed by scroll (all scenes illustrative):

| Section | What happens | File |
|---|---|---|
| Live hero | The visitor's own clock, live, while missed calls and unread messages pile up in the corner | `components/creative/home/LiveHero.tsx` |
| Act I — a day without a system | Scroll runs the clock 06:00 → midnight; at each moment a customer slips away (post ignored, visitor bounces, DM unread, call missed, booked elsewhere) — the screen glitches, a LOST stamp lands, the counter climbs | `home/DayStory.tsx` (`mode="lost"`) |
| Rewind | The tape spins the clock back through scan lines; cold turns to gold | `home/Rewind.tsx` |
| Act II — the same day, with Kllezo | The same moments, the same times, each caught by the system that fixes it | `home/DayStory.tsx` (`mode="won"`) |
| The verdict | Drag a divider between both days | `home/Compare.tsx` |
| Four systems | Each problem, struck through, next to the system behind it | `home/Systems.tsx` |
| Finale | Live liquid-gold shader behind "Let's run your day." | `kit/MoltenGold.tsx` |

The moments are defined in `app/creative/page.tsx`. Shared: motion system (`kit/Motion.tsx`, Lenis + GSAP ScrollTrigger), optional synthesized sound (`kit/sfx.ts`, off by default), nav, cursor, footer; styles scoped to `.cx` in `kit/creative.css`. Reduced motion shows the end state of each act without scroll scrubbing.

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
- **Illustrative story** — the day, notifications and scenes on the Creative home are illustrative (labelled as such in code), not client data.
- **Logo** — `public/brand/` holds the official green mark (from the brand logo files) and a beige version for dark surfaces, trimmed of the tagline for small sizes.
- **Contact details** — WhatsApp number and email via env vars. WhatsApp CTAs stay hidden until `NEXT_PUBLIC_WHATSAPP_NUMBER` is set.
- **Copy review** — the "reply within one business day" promise, budget ranges (₹) and industry list in `src/content/site.ts`.

## Deploy

Vercel: import this repository, add the env vars from `.env.example`, run the Supabase migration.
