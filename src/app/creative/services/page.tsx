import Link from "next/link";
import Still from "@/components/creative/Still";
import ServiceDemo from "@/components/shared/ServiceDemo";
import JsonLd from "@/components/shared/JsonLd";
import { Rise } from "@/components/creative/Scenes";
import { serviceMood } from "@/components/creative/moods";
import { divisions, servicesIn } from "@/content/services";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import s from "./services.module.css";

export const metadata = pageMeta({
  exp: "creative",
  path: "/services",
  title: "Services — Content, Websites & AI",
  description:
    "Cinematic content, immersive websites and AI that speaks for your brand. Explore every Kllezo service in the Creative experience.",
});

export default function CreativeServices() {
  return (
    <>
      <section className={s.hero}>
        <div className={c.wrap}>
          <span className={c.kicker} data-arrive-item>
            Services
          </span>
          <h1 className={c.display} data-arrive-item>
            Three acts.
            <br />
            <span className={c.italic}>One story.</span>
          </h1>
          <nav className={s.acts} aria-label="Divisions" data-arrive-item>
            {divisions.map((d, i) => (
              <a key={d.id} href={`#${d.id}`}>
                <small>Act {["I", "II", "III"][i]}</small>
                {d.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {divisions.map((d, di) => (
        <section key={d.id} id={d.id} className={s.chapter}>
          <div className={c.wrap}>
            <Rise className={s.chapterHead}>
              <span className={c.kicker}>Act {["I", "II", "III"][di]}</span>
              <h2 className={c.h2}>{d.name}</h2>
              <p className={s.line}>{d.creativeLine}</p>
              <p className={c.body}>{d.positioning}</p>
            </Rise>

            {servicesIn(d.id).map((sv, i) => (
              <article key={sv.slug} id={sv.slug} className={s.spread} data-flip={i % 2 === 1 || undefined}>
                <div className={s.visual} data-reveal>
                  {d.id === "ai" ? (
                    <div className={s.demoStage}>
                      <ServiceDemo kind={sv.demo} tone="dark" />
                    </div>
                  ) : (
                    <Still mood={serviceMood[sv.slug]} ratio="16 / 11" caption={sv.name} />
                  )}
                </div>
                <div className={s.copy} data-reveal style={{ ["--d" as string]: "0.1s" }}>
                  <span className={s.code}>{sv.code}</span>
                  <h3 className={c.h3}>{sv.name}</h3>
                  <p className={s.summary}>{sv.summary}</p>
                  {sv.variants && (
                    <p className={s.variants}>
                      {sv.variants.map((v) => v.name).join(" · ")}
                    </p>
                  )}
                  <ul className={s.deliv}>
                    {sv.deliverables.slice(0, 8).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                    {sv.deliverables.length > 8 && <li className={s.more}>+ {sv.deliverables.length - 8} more</li>}
                  </ul>
                  <div className={s.links}>
                    <Link href={`/creative/services/${sv.slug}`} className={c.btnLine}>
                      Enter {sv.name} →
                    </Link>
                    <Link href={`/creative/contact?service=${sv.slug}`} className={s.enquire}>
                      Enquire
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <JsonLd data={breadcrumbLd([{ name: "Creative", path: "/creative" }, { name: "Services", path: "/creative/services" }])} />
    </>
  );
}
