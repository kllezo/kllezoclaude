import Link from "next/link";
import Ecosystem from "@/components/business/Ecosystem";
import LeadFlow from "@/components/business/LeadFlow";
import BrowserShowcase from "@/components/business/BrowserShowcase";
import ConversionJourney from "@/components/business/ConversionJourney";
import ServiceArchitecture from "@/components/business/ServiceArchitecture";
import { divisions, servicesIn } from "@/content/services";
import { publishedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./home.module.css";

export const metadata = pageMeta({
  exp: "business",
  path: "",
  title: "Build smarter. Grow stronger.",
  description:
    "Kllezo builds connected growth systems for businesses: content that attracts, websites that convert and AI agents that respond, qualify, follow up and book.",
});

const how = [
  { t: "Diagnose", d: "We map where growth is leaking today — attention, conversion or follow-up — before recommending anything." },
  { t: "Design the system", d: "Content, website and AI components are scoped to work together, with clear deliverables and owners." },
  { t: "Build & launch", d: "We produce, build and integrate, then launch with tracking in place from day one." },
  { t: "Measure & refine", d: "Monthly reviews of the numbers that matter, and changes made where the data points." },
];

const why = [
  { t: "One connected system", d: "Content, websites and AI built by one team, designed to hand off to each other — not three vendors guessing." },
  { t: "Creative and technical under one roof", d: "Cinematic production and engineering in the same studio, so quality doesn't drop at the hand-off." },
  { t: "AI that's actually integrated", d: "Agents connected to your WhatsApp, website, calendar and CRM, with human handover built in." },
  { t: "Honest measurement", d: "We agree the metrics up front and report on them plainly. We publish results only when they're verified." },
];

export default function BusinessHome() {
  const cases = publishedCaseStudies();
  return (
    <>
      {/* 2 · HERO */}
      <section className={s.hero}>
        <div className={b.wrap}>
          <div className={s.heroCopy}>
            <span className={b.eyebrow} data-arrive-item>
              Content · Websites · AI Systems
            </span>
            <h1 className={b.h1} data-arrive-item>
              Build smarter.
              <br />
              Grow <span className={b.serif}>stronger.</span>
            </h1>
            <p className={b.lead} data-arrive-item>
              Your business doesn&apos;t need another disconnected service provider. It needs a growth system that works together.
            </p>
            <div className={b.actions} data-arrive-item>
              <Link href="/business/services" className={b.btn}>
                Explore Our Systems →
              </Link>
              <Link href="/business/contact" className={b.btnGhost}>
                Book a Strategy Call
              </Link>
            </div>
          </div>
          <div className={s.heroVisual} data-arrive-item>
            <Ecosystem />
          </div>
        </div>
      </section>

      {/* 3 · VALUE PROPOSITION */}
      <section className={`${b.section} ${b.tight}`}>
        <div className={b.wrap}>
          <p className={s.statement} data-reveal>
            Growth doesn&apos;t come from doing more. It comes from doing <span className={b.serif}>the right things.</span> We build them.
          </p>
          <div className={s.triad} data-reveal>
            <span>
              Content that <b>attracts.</b>
            </span>
            <span>
              Websites that <b>convert.</b>
            </span>
            <span>
              AI that <b>closes.</b>
            </span>
          </div>
        </div>
      </section>

      {/* 4 · THREE DIVISIONS */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Three divisions</span>
              <h2 className={b.h2}>Everything growth needs, built to work together.</h2>
            </div>
            <p className={b.lead}>Each division stands on its own. Together they form one system — from first impression to booked customer.</p>
          </div>
          <div className={s.divisions}>
            {divisions.map((d, i) => (
              <Link key={d.id} href={`/business/services#${d.id}`} className={`${b.card} ${b.cardLink} ${s.division}`} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className={s.dIndex}>{d.index}</span>
                <h3 className={b.h3}>{d.name}</h3>
                <p className={b.muted}>{d.positioning}</p>
                <ul className={s.dList}>
                  {servicesIn(d.id).map((sv) => (
                    <li key={sv.slug}>{sv.name}</li>
                  ))}
                </ul>
                <span className={s.dMore}>View division →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · HOW KLLEZO WORKS */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>How Kllezo works</span>
              <h2 className={b.h2}>
                A method, <span className={b.serif}>not a menu.</span>
              </h2>
            </div>
            <p className={b.lead}>Every engagement follows the same four stages, so you always know what&apos;s happening and why.</p>
          </div>
          <ol className={s.how}>
            {how.map((h, i) => (
              <li key={h.t} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className={s.hNum}>0{i + 1}</span>
                <h3 className={b.h3}>{h.t}</h3>
                <p className={b.muted}>{h.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · INTERACTIVE GROWTH ECOSYSTEM — service architecture + live system */}
      <section className={`${b.section} ${b.white}`} id="systems">
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Service architecture</span>
              <h2 className={b.h2}>See exactly how each service runs.</h2>
            </div>
            <p className={b.lead}>Pick a division, then a service, to see its workflow and deliverables.</p>
          </div>
          <div data-reveal>
            <ServiceArchitecture />
          </div>
        </div>
      </section>

      <section className={`${b.section} ${b.green}`}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>AI communication systems</span>
              <h2 className={b.h2}>
                Every lead answered, <span className={b.serif}>qualified and routed.</span>
              </h2>
            </div>
            <p className={b.lead}>Messages and calls from every channel flow through one AI layer that responds, qualifies, books and hands over to your team.</p>
          </div>
          <div data-reveal>
            <LeadFlow />
          </div>
        </div>
      </section>

      {/* 7 · FEATURED WORK */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Featured work</span>
              <h2 className={b.h2}>Websites engineered to convert.</h2>
            </div>
            <p className={b.lead}>
              {cases.length
                ? "Selected engagements across content, websites and AI automation."
                : "Our case studies are being documented with verified client results. Here’s the kind of system we build."}
            </p>
          </div>
          {cases.length > 0 ? (
            <div className={s.cases}>
              {cases.slice(0, 3).map((c) => (
                <Link key={c.slug} href={`/business/work#${c.slug}`} className={`${b.card} ${b.cardLink}`}>
                  <h3 className={b.h3}>{c.client}</h3>
                  <p className={b.muted}>{c.intro}</p>
                </Link>
              ))}
            </div>
          ) : (
            <BrowserShowcase />
          )}
          <div className={b.actions}>
            <Link href="/business/work" className={b.btnGhost}>
              View our work →
            </Link>
          </div>
        </div>
      </section>

      {/* 8 · WHY KLLEZO */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Why Kllezo</span>
              <h2 className={b.h2}>Built by people who understand how businesses operate.</h2>
            </div>
          </div>
          <div className={s.why}>
            {why.map((w, i) => (
              <div key={w.t} className={s.whyItem} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span className={s.whyMark} aria-hidden="true" />
                <h3 className={b.h3}>{w.t}</h3>
                <p className={b.muted}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · RESULTS & MEASURABLE OUTCOMES */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Results &amp; measurable outcomes</span>
              <h2 className={b.h2}>From visitor to customer — measured at every step.</h2>
            </div>
            <p className={b.lead}>We agree the numbers that matter before we start, track them at each stage, and report on them every month.</p>
          </div>
          <div data-reveal>
            <ConversionJourney />
          </div>
        </div>
      </section>

      {/* 10 · FINAL CTA */}
      <section className={s.cta}>
        <div className={b.wrap}>
          <div className={s.ctaBox} data-reveal>
            <span className={b.eyebrow}>Strategy call</span>
            <h2 className={b.h2}>
              Let&apos;s design your <span className={b.serif}>growth system.</span>
            </h2>
            <p className={b.lead}>A focused conversation about where growth is leaking and which system would fix it. No obligation.</p>
            <div className={b.actions}>
              <Link href="/business/contact" className={b.btnGold}>
                Book a Strategy Call →
              </Link>
              <Link href="/business/services" className={b.btnGhost}>
                Explore Our Systems
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
