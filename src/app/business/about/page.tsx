import Link from "next/link";
import { divisions } from "@/content/services";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "business",
  path: "/about",
  title: "About Kllezo",
  description:
    "Kllezo is an AI-powered digital growth and automation agency. Who we are, what we believe, our methodology, our vision and our technology.",
});

const beliefs = [
  { t: "Systems beat effort", d: "Doing more rarely fixes growth. Building the right connected system does." },
  { t: "Creative and technical belong together", d: "The best results come when the people making it beautiful and the people making it work sit in the same room." },
  { t: "AI should serve people", d: "Automation handles the repetitive work so your team can focus on the conversations that need a human." },
  { t: "Honesty is a feature", d: "Clear scopes, plain reporting and no inflated numbers." },
];

const method = [
  { t: "Diagnose", d: "Audit attention, conversion and follow-up to find where growth is leaking." },
  { t: "Design", d: "Define the system: which content, which website journeys, which AI agents — and how they connect." },
  { t: "Build", d: "Produce, develop and integrate with your tools: WhatsApp, calendars, CRM, analytics." },
  { t: "Launch", d: "Go live with tracking from day one and a clear handover." },
  { t: "Refine", d: "Monthly reviews and continuous improvement driven by data." },
];

const tech = [
  ["Websites", "Next.js, TypeScript, headless CMS, Vercel"],
  ["Data & backend", "Supabase, PostgreSQL, secure APIs"],
  ["Motion & 3D", "GSAP, WebGL / Three.js where it earns its place"],
  ["AI agents", "Large language models, voice AI, WhatsApp & web chat integrations"],
  ["Automation", "Workflow automation, CRM & calendar integrations, email"],
  ["Measurement", "Analytics, conversion tracking, reporting dashboards"],
];

export default function BusinessAbout() {
  return (
    <>
      <section className={p.hero}>
        <div className={b.wrap}>
          <span className={b.eyebrow} data-arrive-item>
            About Kllezo
          </span>
          <h1 className={b.h1} data-arrive-item>
            Where creative thinking meets <span className={b.serif}>intelligent execution.</span>
          </h1>
          <p className={b.lead} data-arrive-item>
            {site.description}
          </p>
        </div>
      </section>

      <section className={`${b.section} ${b.white}`}>
        <div className={`${b.wrap} ${p.split}`}>
          <div>
            <span className={b.eyebrow}>Who we are</span>
            <h2 className={b.h2}>One team across content, web and AI.</h2>
          </div>
          <div className={p.prose} data-reveal>
            <p>
              Kllezo brings together content creators, filmmakers, designers, developers and AI engineers in one agency. We work with luxury brands, creators,
              hospitality and restaurants, startups, SMEs, e-commerce and service businesses.
            </p>
            <p>
              Instead of selling isolated services, we build growth systems: content that earns attention, websites that turn it into enquiries, and AI that
              responds, qualifies and follows up — so nothing falls between the cracks.
            </p>
            <div className={p.divs}>
              {divisions.map((d) => (
                <Link key={d.id} href={`/business/services#${d.id}`}>
                  <span>{d.index}</span>
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={b.section}>
        <div className={b.wrap}>
          <span className={b.eyebrow}>What we believe</span>
          <h2 className={b.h2}>Four principles.</h2>
          <div className={p.beliefs}>
            {beliefs.map((x, i) => (
              <div key={x.t} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <h3 className={b.h3}>{x.t}</h3>
                <p className={b.muted}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${b.section} ${b.green}`}>
        <div className={b.wrap}>
          <span className={b.eyebrow}>Our approach &amp; methodology</span>
          <h2 className={b.h2}>
            Diagnose. Design. Build. Launch. <span className={b.serif}>Refine.</span>
          </h2>
          <ol className={p.method}>
            {method.map((m, i) => (
              <li key={m.t} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span>0{i + 1}</span>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={b.section}>
        <div className={`${b.wrap} ${p.split}`}>
          <div>
            <span className={b.eyebrow}>Our vision</span>
            <h2 className={b.h2}>Every business deserves a growth system that works while they sleep.</h2>
          </div>
          <div className={p.prose} data-reveal>
            <p>
              We believe the advantages that used to belong to large companies — cinematic content, conversion-engineered websites and always-on customer
              communication — should be within reach of every ambitious business.
            </p>
            <p>{site.positioning}</p>
          </div>
        </div>
      </section>

      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <span className={b.eyebrow}>Technology &amp; capabilities</span>
          <h2 className={b.h2}>Modern tools, chosen for the job.</h2>
          <dl className={p.tech}>
            {tech.map(([k, v]) => (
              <div key={k} data-reveal>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className={b.actions}>
            <Link href="/business/contact" className={b.btn}>
              Book a Strategy Call →
            </Link>
            <Link href="/business/services" className={b.btnGhost}>
              Explore Our Systems
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
