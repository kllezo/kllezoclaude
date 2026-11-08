import Link from "next/link";
import MoltenGold from "@/components/creative/kit/MoltenGold";
import Lines from "@/components/creative/kit/Lines";
import Chapters from "@/components/creative/home/Chapters";
import Reel from "@/components/creative/home/Reel";
import Film from "@/components/creative/home/Film";
import Method from "@/components/creative/home/Method";
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
      {/* HERO — molten gold, live */}
      <section className="cx-hero">
        <MoltenGold className="cx-hero-canvas" />
        <div className="cx-wrap cx-hero-inner">
          <p className="cx-kicker" data-cx-fade="0.2">
            Kllezo Creative — Content · Websites · AI
          </p>
          <Lines as="h1" className="cx-hero-title" delay={0.1} lines={["We make brands", <em key="i">impossible</em>, "to ignore."]} />
          <div className="cx-hero-foot">
            <p data-cx-fade="0.6">Stories people stop for, websites they stay in, and a voice that answers at 2 a.m. — designed and run as one system.</p>
            <a href="#belief" className="cx-scroll" data-cx-fade="0.8">
              <span>Scroll</span>
              <i aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* BELIEF */}
      <section id="belief" className="cx-belief cx-wrap">
        <p className="cx-kicker">(01) Belief</p>
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

      {/* THE FOUR SYSTEMS — horizontal journey */}
      <div className="cx-wrap cx-chapters-head">
        <p className="cx-kicker">(02) The systems</p>
      </div>
      <Chapters />

      {/* STUDIO FRAMES */}
      <Reel />

      {/* FILM */}
      <Film src={videos.studio2} />

      {/* THE SYSTEM */}
      <Method />
    </>
  );
}
