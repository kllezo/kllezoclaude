import Link from "next/link";
import { IconBolt, IconCalendar, IconChart, IconLayers } from "@/components/business/icons";
import LeakSimulator from "@/components/business/LeakSimulator";
import Diagnose from "@/components/business/Diagnose";
import SolutionSwitcher from "@/components/business/SolutionSwitcher";
import VsTable from "@/components/business/VsTable";
import MethodSteps from "@/components/business/MethodSteps";
import LeadFlow from "@/components/business/LeadFlow";
import SiteShowcase from "@/components/business/SiteShowcase";
import LeakDiagram from "@/components/business/LeakDiagram";
import { publishedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./home.module.css";

export const metadata = pageMeta({
  exp: "business",
  path: "",
  title: "You're not short of customers. You're losing them.",
  description:
    "Kllezo finds where your business leaks customers — attention, conversion or follow-up — and builds the connected system of content, websites and AI agents that keeps them.",
});

const leaks = [
  { vendor: "Content agency", where: "Attention", t: "Content without a system", d: "Reach that never turns into demand.", fix: "Content Creation" },
  { vendor: "Web developer", where: "Conversion", t: "A website that only describes", d: "Visitors read, then leave.", fix: "Website Experiences" },
  { vendor: "Chatbot", where: "Follow-up", t: "Leads that wait", d: "Enquiries go cold before anyone replies.", fix: "AI Communication Systems" },
];

const PROOF = [
  { icon: IconLayers, t: "Content, web & AI", d: "One team, one plan" },
  { icon: IconBolt, t: "Replies in seconds", d: "24/7, every channel" },
  { icon: IconCalendar, t: "Bookings, not likes", d: "Built around enquiries" },
  { icon: IconChart, t: "Reported monthly", d: "Numbers agreed up front" },
];

export default function BusinessHome() {
  const cases = publishedCaseStudies();
  return (
    <>
      {/* HERO — the problem, named in the first line */}
      <section className={s.hero}>
        <div className={`${b.wrap} ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <span className={b.eyebrow} data-arrive-item>
              Content · Websites · AI Systems
            </span>
            <h1 className={b.h1} data-arrive-item>
              You&apos;re not short of customers.
              <br />
              <span className={b.serif}>You&apos;re losing them.</span>
            </h1>
            <p className={b.lead} data-arrive-item>
              Buyers slip away between your post, your website and your reply. <b>We find where — and fix it.</b>
            </p>
            <div className={b.actions} data-arrive-item>
              <a href="#diagnose" className={b.btn}>
                Diagnose my business →
              </a>
              <Link href="/business/contact" className={b.btnGhost}>
                Book a Strategy Call
              </Link>
            </div>
          </div>
          <div className={s.heroVisual} data-arrive-item>
            <LeakSimulator />
          </div>
        </div>
        <div className={b.wrap}>
          <ul className={s.proof} data-arrive-item>
            {PROOF.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.t}>
                  <span className={s.proofIcon}>
                    <Icon size={20} />
                  </span>
                  <span>
                    <b>{p.t}</b>
                    <small>{p.d}</small>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3 · THE PROBLEM — where growth leaks, before any solution is offered */}
      <section className={`${b.section} ${b.green} ${s.problemBand}`}>
        <div className={b.wrap}>
          <span className={b.eyebrow} data-reveal>
            The problem
          </span>
          <p className={s.statement} data-reveal>
            Growth bought in pieces <span className={s.statementMuted}>leaks between the pieces.</span>
          </p>
          <LeakDiagram leaks={leaks} dark />
        </div>
      </section>

      {/* PROBLEM → SOLVED */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>From problem to solved</span>
              <h2 className={b.h2}>
                We don&apos;t sell services. <span className={b.serif}>We solve problems.</span>
              </h2>
            </div>
            <p className={b.lead}>Pick a problem. Drag the line to see it solved.</p>
          </div>
          <div data-reveal>
            <SolutionSwitcher />
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
            <p className={b.lead}>Every channel, one AI layer. Responds, qualifies, books, hands over.</p>
          </div>
          <div data-reveal>
            <LeadFlow />
          </div>
        </div>
      </section>

      {/* 7 · FEATURED WORK */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.headInline}>
            <div>
              <span className={b.eyebrow}>Featured work</span>
              <h2 className={b.h2}>Websites engineered to convert.</h2>
            </div>
            <p className={b.lead}>
              {cases.length
                ? "Selected engagements across content, websites and AI automation."
                : "Real builds from the studio. Hover a frame to scroll the whole page."}
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
            <SiteShowcase />
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
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>Why Kllezo</span>
              <h2 className={b.h2}>
                One team <span className={b.serif}>instead of three vendors.</span>
              </h2>
            </div>
          </div>
          <VsTable />
        </div>
      </section>

      {/* DIAGNOSE — the visitor names their own problems */}
      <section className={`${b.section} ${b.white}`} id="diagnose">
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>Your turn · 30 seconds</span>
              <h2 className={b.h2}>
                Which of these <span className={b.serif}>sound familiar?</span>
              </h2>
            </div>
            <p className={b.lead}>Tick what applies. Your plan builds itself.</p>
          </div>
          <div data-reveal>
            <Diagnose />
          </div>
        </div>
      </section>

      {/* FINAL CTA — what happens next, as four steps */}
      <section className={s.cta}>
        <div className={b.wrap}>
          <div className={s.ctaTop} data-reveal>
            <div>
              <span className={b.eyebrow}>Strategy call</span>
              <h2 className={s.ctaTitle}>
                Let&apos;s find your leaks — <span className={b.serif}>and close them.</span>
              </h2>
            </div>
            <div className={b.actions}>
              <Link href="/business/contact" className={b.btnGold}>
                Book a Strategy Call →
              </Link>
              <Link href="/business/services" className={b.btnGhost}>
                Explore Our Systems
              </Link>
            </div>
          </div>
          <div className={s.ctaSteps} data-reveal>
            <p className={s.ctaNext}>What happens next</p>
            <MethodSteps tone="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
