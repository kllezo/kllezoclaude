import Link from "next/link";
import Ecosystem from "@/components/business/Ecosystem";
import LeadFlow from "@/components/business/LeadFlow";
import BrowserShowcase from "@/components/business/BrowserShowcase";
import ConversionJourney from "@/components/business/ConversionJourney";
import ServiceArchitecture from "@/components/business/ServiceArchitecture";
import LeakDiagram from "@/components/business/LeakDiagram";
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

const leaks = [
  { vendor: "Content agency", where: "Attention", t: "Content without a system", d: "Posts go out, but they aren't planned to bring the right people to you — so reach never becomes demand.", fix: "Content Creation" },
  { vendor: "Web developer", where: "Conversion", t: "A website that only describes", d: "Visitors arrive, read and leave, because there's no clear path from interest to enquiry.", fix: "Website Experiences" },
  { vendor: "Chatbot", where: "Follow-up", t: "Leads that wait", d: "Enquiries arrive after hours and across channels, and go cold before anyone replies.", fix: "AI Communication Systems" },
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

      {/* 3 · THE PROBLEM — where growth leaks, before any solution is offered */}
      <section className={`${b.section} ${b.tight}`}>
        <div className={b.wrap}>
          <span className={b.eyebrow} data-reveal>
            The problem
          </span>
          <p className={s.statement} data-reveal>
            Most businesses buy growth in pieces — a content agency, a web developer, a chatbot. <span className={s.statementMuted}>None of them are built to work together, so growth leaks between them.</span>
          </p>
          <LeakDiagram leaks={leaks} />
        </div>
      </section>

      {/* 4 · THREE DIVISIONS */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>The solution · Three divisions</span>
              <h2 className={b.h2}>Everything growth needs, built to work together.</h2>
            </div>
            <p className={b.lead}>Each division stands on its own. Together they form one system — from first impression to booked customer.</p>
          </div>
          {/* The answer to the broken pipes above: one continuous line through all three. */}
          <ol className={s.divisions}>
            {divisions.map((d, i) => (
              <li key={d.id} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <Link href={`/business/services#${d.id}`} className={s.division}>
                  <span className={s.dIndex}>{d.index}</span>
                  <span className={s.dHead}>
                    <span className={s.dName}>{d.name}</span>
                    <span className={s.dPos}>{d.positioning}</span>
                  </span>
                  <span className={s.dList}>
                    {servicesIn(d.id).map((sv) => (
                      <span key={sv.slug}>{sv.name}</span>
                    ))}
                  </span>
                  <span className={s.dMore} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
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
                <span className={s.whyNum}>0{i + 1}</span>
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
        <div className={`${b.wrap} ${s.ctaGrid}`}>
          <div data-reveal>
            <span className={b.eyebrow}>Strategy call</span>
            <h2 className={s.ctaTitle}>
              Let&apos;s design your <span className={b.serif}>growth system.</span>
            </h2>
            <div className={b.actions}>
              <Link href="/business/contact" className={b.btnGold}>
                Book a Strategy Call →
              </Link>
              <Link href="/business/services" className={b.btnGhost}>
                Explore Our Systems
              </Link>
            </div>
          </div>
          <ol className={s.ctaSteps} data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <li>
              <span>01</span>
              <p>
                <b>A focused conversation.</b> Where growth is leaking today, in attention, conversion or follow-up.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <b>A recommended system.</b> Which services fit, how they connect and what we&apos;d build first.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <b>No obligation.</b> You leave with a clear plan whether or not we work together.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
