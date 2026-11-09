import Link from "next/link";
import MoltenGold from "@/components/creative/kit/MoltenGold";
import Lines from "@/components/creative/kit/Lines";
import LiveHero from "@/components/creative/home/LiveHero";
import DayStory, { type Moment } from "@/components/creative/home/DayStory";
import Rewind from "@/components/creative/home/Rewind";
import Compare from "@/components/creative/home/Compare";
import Systems from "@/components/creative/home/Systems";
import StoryDock from "@/components/creative/home/StoryDock";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "",
  title: "One day, told twice",
  description:
    "Watch one ordinary business day without a system — and the same day with Kllezo's content, websites and AI agents catching every customer.",
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
  { m: 8 * 60 + 10, kind: "stopped", tag: "08:10 · Content Engine", t: "You post. They stop.", s: "A planned story with a hook, shot to be watched.", href: "/creative/services/content-growth" },
  { m: 11 * 60 + 42, kind: "enquire", tag: "11:42 · Website Experiences", t: "They land — and they enquire.", s: "One clear path from interest to a booking.", href: "/creative/services/business-website" },
  { m: 14 * 60 + 45, kind: "replied", tag: "14:45 · AI Texting Agents", t: "Replied in seconds. Booked by 14:46.", s: "The agent answers, qualifies and books — on WhatsApp.", href: "/creative/services/ai-texting" },
  { m: 18 * 60 + 20, kind: "answered", tag: "18:20 · AI Calling Agents", t: "The phone rings. The agent answers.", s: "First ring, appointment booked, summary sent to your team.", href: "/creative/services/ai-calling" },
  { m: 22 * 60 + 30, kind: "booked", tag: "22:30 · The whole system", t: "Tomorrow is already full.", s: "Follow-ups did the rest while you slept." },
];

const COLD = ["#121518", "#1a1f23", "#20262a", "#1b2024", "#14181b", "#0c0f11", "#08090a"];
const WARM = ["#2b2213", "#3a2b12", "#0d3a34", "#0f4a42", "#3a2410", "#0b1714", "#070a09"];

export default function CreativeHome() {
  return (
    <>
      <LiveHero />
      <StoryDock />

      <DayStory id="act-1" mode="lost" title="A day without a system" moments={LOST} counterLabel="customers lost today" sky={COLD} />

      <Rewind />

      <DayStory id="act-2" mode="won" title="The same day, with Kllezo" moments={WON} counterLabel="customers won today" sky={WARM} />

      <Compare />

      <Systems />

      <section className="cx-finale" aria-labelledby="fin-h">
        <MoltenGold className="cx-finale-gold" />
        <div className="cx-wrap cx-finale-inner">
          <p className="cx-kicker">Your turn</p>
          <Lines as="h2" id="fin-h" className="cx-finale-title" lines={["Let's run", <em key="d">your day.</em>]} />
          <div className="cx-finale-actions" data-cx-fade="0.3">
            <Link href="/creative/contact" className="cx-pill" data-cx-magnetic>
              Start a project
            </Link>
            <Link href="/creative/services" className="cx-arrow-link">
              All services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
