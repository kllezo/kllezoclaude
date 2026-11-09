import Link from "next/link";
import LeakSimulator from "@/components/business/LeakSimulator";
import PlanLadder from "@/components/home/PlanLadder";
import JsonLd from "@/components/shared/JsonLd";
import { IconBolt, IconBrowser, IconCalendar, IconChart, IconChat, IconLayers, IconMegaphone, IconSearch, IconRocket } from "@/components/business/icons";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./growth.module.css";

export const metadata = pageMeta({
  path: "/growth",
  title: "Kllezo Growth System — managed growth, every month",
  description:
    "Content, website and AI agents connected and run by one team, with a dedicated growth manager, monthly strategy and reporting. Start with one service, grow into the system.",
});

const PAINS = [
  { t: "Nobody owns the whole picture", d: "Each vendor fixes their piece. The leaks between them stay." },
  { t: "Everything is measured differently", d: "Likes here, traffic there, calls somewhere else — no single number." },
  { t: "Improvement stops at launch", d: "The site goes live, the campaign ends, and nothing gets better." },
];

const INCLUDED = [
  { icon: IconSearch, t: "Growth manager", d: "One person who owns your numbers and the plan." },
  { icon: IconMegaphone, t: "Content, every month", d: "Planned, shot, edited and published on a calendar." },
  { icon: IconBrowser, t: "Website care & conversion", d: "Updates, landing pages and tests that lift enquiries." },
  { icon: IconChat, t: "AI texting agents", d: "WhatsApp, Instagram and site chat answered in seconds." },
  { icon: IconBolt, t: "AI calling agents", d: "Calls picked up, qualified and booked, day and night." },
  { icon: IconChart, t: "Monthly reporting", d: "One report, the numbers we agreed, what changes next." },
];

const MONTH = [
  { icon: IconChart, w: "Week 1", t: "Review", d: "Last month's numbers, what worked, what didn't." },
  { icon: IconLayers, w: "Week 2", t: "Plan & produce", d: "Content, pages and agent scripts for the month." },
  { icon: IconRocket, w: "Week 3", t: "Launch & optimise", d: "Ship it, test it, tune what underperforms." },
  { icon: IconCalendar, w: "Week 4", t: "Report", d: "One clear report and the plan for next month." },
];

const FAQS = [
  { q: "Do I have to start with the Growth System?", a: "No. Most clients start with one service — a website, content or an AI agent. Every service is built to connect, so you can move into the Growth System whenever it makes sense." },
  { q: "What if I only need part of it?", a: "We shape the system around what you need. If you don't need calling agents yet, we leave them out and add them later." },
  { q: "How is it priced?", a: "As a monthly retainer, scoped on a strategy call around your goals and the services included. You'll get a clear proposal before anything starts." },
  { q: "Who will I work with?", a: "A dedicated growth manager, backed by the content, web and AI teams in the same studio — no hand-offs between agencies." },
];

export default function GrowthPage() {
  return (
    <>
      <section className={s.hero}>
        <div className={`${b.wrap} ${s.heroGrid}`}>
          <div>
            <span className={b.eyebrow}>Kllezo Growth System</span>
            <h1 className={s.h1}>
              One team running your growth. <span className={b.serif}>Every month.</span>
            </h1>
            <p className={b.lead}>
              Content, website and AI agents — connected, managed and improved by a growth manager who owns the numbers. <b>Start with one service and grow into it, or start here.</b>
            </p>
            <div className={b.actions}>
              <Link href="/contact" className={b.btn}>
                Book a Strategy Call →
              </Link>
              <Link href="/services" className={b.btnGhost}>
                Start with one service
              </Link>
            </div>
          </div>
          <LeakSimulator />
        </div>
      </section>

      <section className={`${b.section} ${b.green}`}>
        <div className={b.wrap}>
          <span className={b.eyebrow}>Why a system</span>
          <h2 className={s.big}>
            Service by service works — <span className={b.serif}>until you&apos;re managing five vendors.</span>
          </h2>
          <ol className={s.pains}>
            {PAINS.map((p, i) => (
              <li key={p.t} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span>0{i + 1}</span>
                <b>{p.t}</b>
                <p>{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>What&apos;s included</span>
              <h2 className={b.h2}>
                Everything growth needs, <span className={b.serif}>run as one.</span>
              </h2>
            </div>
          </div>
          <ul className={s.tiles}>
            {INCLUDED.map((x, i) => {
              const Icon = x.icon;
              return (
                <li key={x.t} data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
                  <span className={s.tileIcon}>
                    <Icon size={24} />
                  </span>
                  <b>{x.t}</b>
                  <p>{x.d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={b.headInline}>
            <div>
              <span className={b.eyebrow}>A month with us</span>
              <h2 className={b.h2}>Same rhythm, every month.</h2>
            </div>
            <p className={b.lead}>So you always know what&apos;s happening — and why.</p>
          </div>
          <ol className={s.month}>
            {MONTH.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={m.t} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                  <span className={s.monthIcon}>
                    <Icon size={22} />
                  </span>
                  <small>{m.w}</small>
                  <b>{m.t}</b>
                  <p>{m.d}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>Grow into it</span>
              <h2 className={b.h2}>
                Start with one. <span className={b.serif}>Climb when you&apos;re ready.</span>
              </h2>
            </div>
          </div>
          <PlanLadder tone="light" />
        </div>
      </section>

      <section className={`${b.section} ${b.white}`}>
        <div className={`${b.wrap} ${s.faqWrap}`}>
          <div>
            <span className={b.eyebrow}>Questions</span>
            <h2 className={b.h2}>Asked often.</h2>
          </div>
          <div className={s.faq}>
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={s.cta}>
        <div className={b.wrap}>
          <h2 className={s.ctaTitle}>
            Ready for one team <span className={b.serif}>to run it all?</span>
          </h2>
          <div className={b.actions}>
            <Link href="/contact" className={b.btnGold}>
              Book a Strategy Call →
            </Link>
            <Link href="/services" className={`${b.btnGhost} ${s.ghost}`}>
              Or start with one service
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbLd([{ name: "Kllezo", path: "/" }, { name: "Growth System", path: "/growth" }])} />
    </>
  );
}
