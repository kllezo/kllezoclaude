import Link from "next/link";
import Image from "next/image";
import Lines from "@/components/creative/kit/Lines";
import { orbs } from "@/content/creativeMedia";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/about",
  title: "Studio",
  description: site.description,
});

const SYSTEMS = [
  { orb: orbs.content, name: "Content", line: "Stories people stop for.", href: "/creative/services/content-growth" },
  { orb: orbs.websites, name: "Websites", line: "Rooms people want to stay in.", href: "/creative/services/business-website" },
  { orb: orbs.calling, name: "AI Calling", line: "A voice that never sleeps.", href: "/creative/services/ai-calling" },
  { orb: orbs.texting, name: "AI Texting", line: "Every message, answered.", href: "/creative/services/ai-texting" },
];

const PRINCIPLES = [
  { t: "Desire before reach", d: "We would rather a hundred of the right people want you than a million scroll past." },
  { t: "One studio, no hand-offs", d: "Story, design, engineering and AI sit at one table, so nothing is lost between vendors." },
  { t: "Craft you can measure", d: "Every frame is made to be felt — and every system is measured against numbers we agree with you up front." },
  { t: "Honest by default", d: "We publish results only when clients have verified them. No inflated claims, ever." },
];

export default function CreativeAbout() {
  return (
    <>
      <section className="cx-page-hero cx-wrap">
        <p className="cx-kicker" data-cx-fade>
          The studio
        </p>
        <Lines as="h1" className="cx-display" lines={["Creative brains,", <em key="a">automated gains.</em>]} />
      </section>
      <section className="cx-belief cx-wrap" aria-label="What we believe">
        <p className="cx-statement" data-cx-words>
          {site.positioning} Kllezo is where <em>creative thinking</em> meets <em>intelligent execution</em> — a studio that makes brands wanted, then builds the systems that turn wanting into business.
        </p>
      </section>
      <section className="cx-wrap cx-orbs" aria-label="The four systems">
        {SYSTEMS.map((s, i) => (
          <Link key={s.name} href={s.href} className="cx-orb-card" data-cx-fade={i * 0.08} data-cursor="Explore">
            <Image src={s.orb.src} alt="" width={s.orb.w} height={s.orb.h} sizes="(max-width: 760px) 60vw, 22vw" unoptimized />
            <span className="cx-orb-name">{s.name}</span>
            <span className="cx-orb-line">{s.line}</span>
          </Link>
        ))}
      </section>
      <section className="cx-wrap cx-sv-block" aria-labelledby="principles">
        <p className="cx-kicker" id="principles">
          How we work
        </p>
        <ol className="cx-principles">
          {PRINCIPLES.map((p, i) => (
            <li key={p.t} data-cx-fade={i * 0.06}>
              <span className="cx-gold">0{i + 1}</span>
              <h2>{p.t}</h2>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
