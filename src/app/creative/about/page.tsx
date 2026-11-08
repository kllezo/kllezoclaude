import Link from "next/link";
import Image from "next/image";
import OriginalShell from "@/components/creative/OriginalShell";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/about",
  title: "About",
  description: site.description,
});

/* The four systems, in the original orb-card markup from services.html. */
const systems = [
  { href: "/creative/services/content-growth", img: "content-creation-orb", title: "Content Systems", sub: "Cinematic storytelling & authority engine" },
  { href: "/creative/services/business-website", img: "websites-orb", title: "Website Experiences", sub: "High-converting WebGL flagships" },
  { href: "/creative/services/ai-texting", img: "texting-orb", title: "AI Texting Agents", sub: "24/7 Omnichannel sales dialogue" },
  { href: "/creative/services/ai-calling", img: "calling-orb", title: "AI Calling Agents", sub: "Human-grade autonomous voice models" },
];

export default function CreativeAbout() {
  return (
    <OriginalShell back={{ href: "/creative", label: "Back To Universe" }}>
      <div className="landing-hero">
        <div className="hero-subtitle">About Kllezo</div>
        <h1 className="hero-title">Built To Grow Businesses.</h1>
        <p className="hero-desc">{site.description}</p>
      </div>
      <div className="orbs-grid-container">
        <div className="orbs-grid">
          {systems.map((s) => (
            <Link key={s.href} href={s.href} className="orb-card" style={{ textDecoration: "none" }}>
              <div className="orb-visual-wrapper">
                <div className="orb-light-glow" />
                <Image src={`/creative/assets/${s.img}.webp`} alt={s.title} className="orb-img" width={1024} height={1024} unoptimized />
              </div>
              <div className="orb-info">
                <h2 className="orb-title">{s.title}</h2>
                <p className="orb-sub">{s.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </OriginalShell>
  );
}
