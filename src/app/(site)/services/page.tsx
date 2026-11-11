import Link from "next/link";
import ServiceDemo from "@/components/shared/ServiceDemo";
import ServicePanel from "@/components/services/ServicePanel";
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
          <nav className={s.jump} aria-label="Divisions" data-arrive-item>
            {divisions.map((d) => (
              <a key={d.id} href={`#${d.id}`}>
                <span>{d.index}</span> {d.name}
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
                        <ServiceDemo kind={sv.demo} />
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
