import Link from "next/link";
import ServicePanel, { ServicePreview } from "@/components/services/ServicePanel";
import JsonLd from "@/components/shared/JsonLd";
import { divisions, servicesIn } from "@/content/services";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./services.module.css";

export const metadata = pageMeta({
  path: "/services",
  title: "Services — Content, Websites & AI Systems",
  description:
    "Explore Kllezo's three service divisions: content creation, website experiences and AI communication systems. Deliverables, workflows and outcomes for every service.",
});

const PICKS = [
  { need: "Get seen", title: "Content", list: "Strategy, personal brand, video, UGC ads", href: "#content", img: "content/5.webp", pos: "40% 50%" },
  { need: "Get enquiries", title: "Websites", list: "Business sites, online stores, lead pages", href: "#websites", img: "niche-1.webp", pos: "50% 0%" },
  { need: "Never miss a lead", title: "AI automations", list: "AI texting and calling agents", href: "#ai", img: "calling-agent-1.webp", pos: "50% 40%" },
  { need: "All of it, connected", title: "Full system", list: "Everything working together, managed for you", href: "/growth", img: "content/7.webp", pos: "30% 30%", system: true },
];

export default function BusinessServices() {
  return (
    <>
      <section className={s.hero}>
        <div className={b.wrap}>
          <span className={b.eyebrow} data-arrive-item>
            Services
          </span>
          <h1 className={b.h1} data-arrive-item>
            Hire any one. <span className={b.serif}>Or connect them all.</span>
          </h1>
          <p className={b.lead} data-arrive-item>
            Every service works on its own — open one to see the problem it solves, what you get and how it runs. When you&apos;re ready, the <a href="/growth" style={{ color: "var(--k-green)", textDecoration: "underline", textUnderlineOffset: 3 }}>Growth System</a> runs them together.
          </p>
          <p className={s.pickQ} data-arrive-item>
            What do you need help with?
          </p>
          <nav className={s.pick} aria-label="Choose what you need" data-arrive-item>
            {PICKS.map((p) => (
              <a key={p.title} href={p.href} className={p.system ? s.pickSystem : undefined}>
                <span className={s.pickImg} style={{ backgroundImage: `url(/creative/assets/${p.img})`, backgroundPosition: p.pos }} />
                <span className={s.pickText}>
                  <small>{p.need}</small>
                  <b>{p.title}</b>
                  <span>{p.list}</span>
                </span>
                <span className={s.pickGo} aria-hidden="true">
                  {p.system ? "→" : "↓"}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {divisions.map((d, di) => (
        <section key={d.id} id={d.id} className={`${b.section} ${di % 2 === 0 ? b.white : ""} ${s.div}`}>
          <div className={b.wrap}>
            <div className={b.head}>
              <div>
                <span className={b.eyebrow}>
                  Division {d.index}
                </span>
                <h2 className={b.h2}>{d.name}</h2>
              </div>
              <p className={b.lead}>
                <strong>{d.positioning}</strong> {d.businessLine}
              </p>
            </div>

            <div className={s.list}>
              {servicesIn(d.id).map((sv, i) => (
                <details key={sv.slug} className={s.item} open={i === 0} id={sv.slug}>
                  <summary className={s.sum}>
                    <span className={s.code}>{sv.code}</span>
                    <span className={s.title}>
                      <b>{sv.name}</b>
                      <small>{sv.tagline}</small>
                    </span>
                    <span className={s.toggle} aria-hidden="true" />
                  </summary>
                  <div className={s.body}>
                    <div className={s.cols}>
                      <div className={s.left}>
                        <p className={s.summary}>{sv.summary}</p>
                        <ServicePanel sv={sv} />
                      </div>
                      <div className={s.right}>
                        <ServicePreview sv={sv} />
                      </div>
                    </div>
                    <div className={b.actions}>
                      <Link href={`/contact?service=${sv.slug}`} className={b.btn}>
                        Enquire about {sv.name} →
                      </Link>
                      <Link href={`/services/${sv.slug}`} className={b.btnGhost}>
                        Full details &amp; FAQs
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <JsonLd data={breadcrumbLd([{ name: "Kllezo", path: "/" }, { name: "Services", path: "/services" }])} />
    </>
  );
}
