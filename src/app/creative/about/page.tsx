import Link from "next/link";
import Still from "@/components/creative/Still";
import { Manifesto, Rise } from "@/components/creative/Scenes";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "creative",
  path: "/about",
  title: "About",
  description: "Kllezo is a studio where filmmakers, designers, developers and AI engineers make brands people desire — and the systems that make them grow.",
});

const beliefs = [
  ["Attention is earned.", "Not bought, not begged for. Earned — with craft, taste and an idea worth stopping for."],
  ["Beauty must work.", "Every frame and every page has a job. If it's beautiful and doesn't convert, it isn't finished."],
  ["Technology should disappear.", "The best AI feels like great service. The best website feels like the brand, not the software."],
  ["Truth is the strongest story.", "We never invent results. The work, and what our clients say about it, speaks."],
];

const method = ["Listen", "Imagine", "Make", "Release", "Refine"];

export default function CreativeAbout() {
  return (
    <>
      <section className={p.hero}>
        <div className={c.wrap}>
          <span className={c.kicker} data-arrive-item>
            About Kllezo
          </span>
          <h1 className={c.display} data-arrive-item>
            Creative thinking,
            <br />
            <span className={c.italic}>intelligent execution.</span>
          </h1>
        </div>
      </section>

      <section className={p.aboutStill}>
        <Still mood="velvet" ratio="2.39 / 1" live caption="Who we are" />
      </section>

      <section className={c.section}>
        <div className={`${c.wrap} ${p.split}`}>
          <span className={c.kicker}>Who we are</span>
          <Rise className={p.prose}>
            <p>
              Kllezo is a studio of filmmakers, content creators, designers, developers and AI engineers. We make brands that people stop for — and build the
              systems underneath that turn that attention into growth.
            </p>
            <p>
              We work with luxury and lifestyle brands, hospitality and restaurants, founders and creators — anyone for whom being remembered is the whole
              game.
            </p>
          </Rise>
        </div>
      </section>

      <section className={c.section}>
        <div className={c.wrap}>
          <span className={c.kicker}>What we believe</span>
          <div className={p.beliefs}>
            {beliefs.map(([t, d], i) => (
              <div key={t} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span>0{i + 1}</span>
                <h3 className={c.h3}>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${c.section} ${p.methodSec}`}>
        <div className={c.wrap}>
          <span className={c.kicker}>Our approach</span>
          <ol className={p.method}>
            {method.map((m, i) => (
              <li key={m} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <small>0{i + 1}</small>
                {m}
                <span>.</span>
              </li>
            ))}
          </ol>
          <p className={`${c.body} ${p.methodNote}`}>
            Behind the craft is a rigorous methodology — diagnose, design, build, launch, refine — with measurement agreed up front.{" "}
            <Link href="/business/about">See it in the Business view →</Link>
          </p>
        </div>
      </section>

      <section className={c.section}>
        <div className={c.wrap}>
          <span className={c.kicker}>Our vision</span>
          <div className={p.vision}>
            <Manifesto
              text="A world where every ambitious brand can look like the best in its category — and has a system working for it while it sleeps."
              highlight={["best", "sleeps"]}
            />
          </div>
          <p className={`${c.body} ${p.capabilities}`}>
            Capabilities: cinematic production · creative direction · motion &amp; sound · Next.js websites · WebGL &amp; motion design · e-commerce · voice
            &amp; chat AI · automation &amp; integrations. {site.tagline}
          </p>
          <div className={c.actions}>
            <Link href="/creative/contact" className={c.btn}>
              Begin a project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
