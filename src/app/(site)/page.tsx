import Link from "next/link";
import Motion from "@/components/creative/kit/Motion";
import LiveHero from "@/components/creative/home/LiveHero";
import DayStory, { type Moment } from "@/components/creative/home/DayStory";
import Rewind from "@/components/creative/home/Rewind";
import StoryDock from "@/components/creative/home/StoryDock";
import NavTone from "@/components/home/NavTone";
import ServiceBento from "@/components/home/ServiceBento";
import PlanLadder from "@/components/home/PlanLadder";
import VsTable from "@/components/business/VsTable";
import SiteShowcase from "@/components/business/SiteShowcase";
import Diagnose from "@/components/business/Diagnose";
import MethodSteps from "@/components/business/MethodSteps";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./home.module.css";
import "@/components/creative/kit/creative.css";

export const metadata = pageMeta({
  path: "",
  title: "Content, websites & AI agents that win you customers",
  description:
    "Kllezo builds content, websites and AI texting and calling agents — hire any one on its own, or let us run all of it as your managed Growth System.",
});

// One ordinary day (illustrative): first what slips away, then the same moments caught.
const LOST: Moment[] = [
  { m: 8 * 60 + 10, kind: "ignored", tag: "08:10 · Content", t: "You post. Everyone scrolls past.", s: "No plan, no hook — the feed doesn't stop for it." },
  { m: 11 * 60 + 42, kind: "bounce", tag: "11:42 · Website", t: "Someone finds your site. Gone in six seconds.", s: "It describes the business. It never asks for anything." },
  { m: 14 * 60 + 45, kind: "unread", tag: "14:45 · Messages", t: "An enquiry lands in your DMs.", s: "Nobody sees it until tomorrow." },
  { m: 18 * 60 + 20, kind: "missed", tag: "18:20 · Calls", t: "A customer calls after hours.", s: "It rings out. They call the next name on Google." },
  { m: 22 * 60 + 30, kind: "elsewhere", tag: "22:30 · Follow-up", t: "They book with someone else.", s: "Nobody followed up. Nobody even knew." },
];
const WON: Moment[] = [
  { m: 8 * 60 + 10, kind: "stopped", tag: "08:10 · Content", t: "You post. They stop.", s: "A planned story with a hook, shot to be watched.", href: "/services/content-growth" },
  { m: 11 * 60 + 42, kind: "enquire", tag: "11:42 · Website", t: "They land — and they enquire.", s: "One clear path from interest to a booking.", href: "/services/business-website" },
  { m: 14 * 60 + 45, kind: "replied", tag: "14:45 · AI Texting", t: "Replied in seconds. Booked by 14:46.", s: "The agent answers, qualifies and books — on WhatsApp.", href: "/services/ai-texting" },
  { m: 18 * 60 + 20, kind: "answered", tag: "18:20 · AI Calling", t: "The phone rings. The agent answers.", s: "First ring, appointment booked, summary sent to your team.", href: "/services/ai-calling" },
  { m: 22 * 60 + 30, kind: "booked", tag: "22:30 · Growth System", t: "Tomorrow is already full.", s: "Follow-ups did the rest while you slept.", href: "/growth" },
];

export default function Home() {
  return (
    <>
      <NavTone />
      <Motion />

      {/* 1 · THE PROBLEM — one ordinary day, told twice */}
      <div className="cx" data-tone="dark">
        <LiveHero />
        <StoryDock />
        <DayStory id="act-1" mode="lost" title="A day without a system" moments={LOST} counterLabel="customers lost today" />
        <Rewind />
        <DayStory id="act-2" mode="won" title="The same day, with Kllezo" moments={WON} counterLabel="customers won today" />
      </div>

      {/* Bridge: night turns to morning */}
      <section className={s.sunrise} aria-labelledby="sunrise-h">
        <div className={s.sunriseDark} data-tone="dark" />
        <div className={s.sun} aria-hidden="true" />
        <div className={`${b.wrap} ${s.sunriseInner}`}>
          <p className={s.sunriseTime}>06:00 · tomorrow</p>
          <h2 id="sunrise-h" className={s.sunriseTitle}>
            Start with the leak <span className={b.serif}>that hurts most.</span>
          </h2>
          <p className={s.sunriseLede}>Every Kllezo service works on its own. Hire one, see it work, add the next when you&apos;re ready.</p>
        </div>
      </section>

      {/* 2 · THE SOLUTION — every service, sold on its own */}
      <section className={`${b.section} ${s.solution}`} id="services">
        <div className={b.wrap}>
          <div className={b.headInline}>
            <div>
              <span className={b.eyebrow}>The solution</span>
              <h2 className={b.h2}>
                Four ways to stop losing customers. <span className={b.serif}>Hire any one.</span>
              </h2>
            </div>
            <Link href="/services" className={b.btnGhost}>
              All services →
            </Link>
          </div>
          <ServiceBento />
        </div>
      </section>

      {/* 3 · THE UPGRADE — the Growth System */}
      <section className={`${b.section} ${b.green} ${s.system}`} aria-labelledby="sys-h">
        <div className={b.wrap}>
          <div className={s.systemHead}>
            <span className={b.eyebrow}>When you&apos;re ready</span>
            <h2 id="sys-h" className={s.systemTitle}>
              Or let us run <span className={b.serif}>the whole thing.</span>
            </h2>
            <p className={s.systemLede}>
              The <b>Kllezo Growth System</b>: content, website and AI agents working as one — with a growth manager who runs it, reports on it and improves it every month.
            </p>
          </div>
          <PlanLadder />
        </div>
      </section>

      {/* 4 · WHY US */}
      <section className={`${b.section} ${b.white}`} aria-labelledby="why-h">
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>Why Kllezo</span>
              <h2 id="why-h" className={b.h2}>
                One studio. <span className={b.serif}>Every piece built to connect.</span>
              </h2>
            </div>
          </div>
          <VsTable />
        </div>
      </section>

      <section className={b.section} aria-labelledby="work-h">
        <div className={b.wrap}>
          <div className={b.headInline}>
            <div>
              <span className={b.eyebrow}>The work</span>
              <h2 id="work-h" className={b.h2}>Real builds from the studio.</h2>
            </div>
            <p className={b.lead}>Hover a frame to scroll the whole page.</p>
          </div>
          <SiteShowcase />
        </div>
      </section>

      {/* 5 · START — diagnosis, then the call */}
      <section className={`${b.section} ${b.white}`} id="diagnose" aria-labelledby="dx-h">
        <div className={b.wrap}>
          <div className={b.headCenter}>
            <div>
              <span className={b.eyebrow}>Not sure where to start?</span>
              <h2 id="dx-h" className={b.h2}>
                Tick what <span className={b.serif}>sounds familiar.</span>
              </h2>
              <p className={b.lead}>Your first step builds itself — and carries straight into the form.</p>
            </div>
          </div>
          <Diagnose />
        </div>
      </section>

      <section className={s.cta}>
        <div className={b.wrap}>
          <div className={s.ctaTop} data-reveal>
            <div>
              <span className={b.eyebrow}>Strategy call</span>
              <h2 className={s.ctaTitle}>
                Make tomorrow <span className={b.serif}>look like that.</span>
              </h2>
            </div>
            <div className={b.actions}>
              <Link href="/contact" className={b.btnGold}>
                Book a Strategy Call →
              </Link>
              <Link href="/growth" className={b.btnGhost}>
                The Growth System
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
