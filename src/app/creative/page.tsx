import Link from "next/link";
import MoltenGold from "@/components/creative/kit/MoltenGold";
import Lines from "@/components/creative/kit/Lines";
import Loader from "@/components/creative/kit/Loader";
import Tapes from "@/components/creative/home/Tapes";
import ScrollStopper from "@/components/creative/home/ScrollStopper";
import SiteBuilder from "@/components/creative/home/SiteBuilder";
import NightCall from "@/components/creative/home/NightCall";
import Flood from "@/components/creative/home/Flood";
import DayClock from "@/components/creative/home/DayClock";
import Constellation from "@/components/creative/home/Constellation";
import Reel from "@/components/creative/home/Reel";
import Film from "@/components/creative/home/Film";
import { videos } from "@/content/creativeMedia";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "",
  title: "We make brands impossible to ignore",
  description:
    "Kllezo Creative: cinematic content, flagship websites and AI agents that answer every call and message — designed as one system for brands that want to be wanted.",
});

export default function CreativeHome() {
  return (
    <>
      <Loader />

      {/* HERO — molten gold, live; press and hold to heat it */}
      <section className="cx-hero">
        <MoltenGold className="cx-hero-canvas" />
        <div className="cx-wrap cx-hero-inner">
          <p className="cx-kicker" data-cx-fade="0.2">
            Kllezo Creative — Content · Websites · AI
          </p>
          <Lines as="h1" className="cx-hero-title" delay={0.1} lines={["We make brands", <em key="i">impossible</em>, "to ignore."]} />
          <div className="cx-hero-foot">
            <p data-cx-fade="0.6">Stories people stop for, websites they stay in, and a voice that answers at 2 a.m. — designed and run as one system.</p>
            <p className="cx-hero-hint" data-cx-fade="0.7" aria-hidden="true">
              <i /> Press and hold to melt the gold
            </p>
            <a href="#belief" className="cx-scroll" data-cx-fade="0.8">
              <span>Scroll</span>
              <i aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <Tapes />

      {/* BELIEF */}
      <section id="belief" className="cx-belief cx-wrap">
        <p className="cx-kicker">Belief</p>
        <p className="cx-statement" data-cx-words>
          Attention is earned before it is converted. We build the whole journey — <em>the story</em> people stop for, <em>the website</em> they stay in, <em>the voice</em> that answers when you can&apos;t — and we build it as one system.
        </p>
        <div className="cx-belief-foot">
          <p data-cx-fade>Four systems. One studio. Nothing lost in the hand-off.</p>
          <Link href="/creative/services" className="cx-arrow-link" data-cx-fade="0.1">
            All services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* THE FOUR SYSTEMS — each one a toy you can play with */}
      <ScrollStopper />
      <SiteBuilder />
      <NightCall />
      <Flood />

      {/* A DAY OF THE SYSTEM */}
      <DayClock />

      {/* ONE STUDIO */}
      <Constellation />

      {/* STUDIO FRAMES + FILM FINALE */}
      <Reel />
      <Film src={videos.studio2} />
    </>
  );
}
