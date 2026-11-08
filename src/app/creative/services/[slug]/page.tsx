import Link from "next/link";
import { notFound } from "next/navigation";
import Still from "@/components/creative/Still";
import ServiceDemo from "@/components/shared/ServiceDemo";
import JsonLd from "@/components/shared/JsonLd";
import { Rise } from "@/components/creative/Scenes";
import { serviceMood } from "@/components/creative/moods";
import { divisionById, serviceBySlug, services } from "@/content/services";
import { breadcrumbLd, faqLd, pageMeta, serviceLd } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import s from "./detail.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) return {};
  return pageMeta({ exp: "creative", path: `/services/${sv.slug}`, title: sv.name, description: `${sv.tagline} ${sv.summary}`.slice(0, 300) });
}

export default async function CreativeServiceDetail({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) notFound();
  const div = divisionById(sv.division);
  const idx = services.findIndex((x) => x.slug === sv.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      {/* 1 · Hero */}
      <section className={s.hero}>
        <Still mood={serviceMood[sv.slug]} ratio="auto" className={s.heroStill} live caption={`${div.name} — ${sv.code}`} />
        <div className={s.heroCopy}>
          <span className={c.kicker} data-arrive-item>
            {div.name}
          </span>
          <h1 className={c.display} data-arrive-item>
            {sv.name}
          </h1>
          <p className={s.heroLine} data-arrive-item>
            {sv.tagline}
          </p>
        </div>
      </section>

      {/* 2 · Problem */}
      <section className={c.section}>
        <div className={`${c.wrap} ${s.two}`}>
          <Rise>
            <span className={c.kicker}>The problem</span>
          </Rise>
          <Rise className={s.problems}>
            {sv.problems.map((p) => (
              <p key={p}>{p}.</p>
            ))}
          </Rise>
        </div>
      </section>

      {/* 3 · Solution */}
      <section className={`${c.section} ${s.solution}`}>
        <div className={c.wrap}>
          <Rise>
            <span className={c.kicker}>Our solution</span>
            <p className={s.solutionText}>{sv.summary}</p>
          </Rise>
          {sv.variants && (
            <div className={s.variants}>
              {sv.variants.map((v, i) => (
                <div key={v.name} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                  <h3 className={c.h3}>{v.name}</h3>
                  <ul>
                    {v.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 · Deliverables — as closing credits */}
      <section className={c.section}>
        <div className={`${c.wrap} ${s.credits}`}>
          <span className={c.kicker}>Deliverables</span>
          <h2 className={c.h2}>
            The <span className={c.italic}>credits.</span>
          </h2>
          <ol>
            {sv.deliverables.map((d, i) => (
              <li key={d} data-reveal style={{ ["--d" as string]: `${i * 0.04}s` }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · How it works — as scenes */}
      <section className={`${c.section} ${s.scenesWrap}`}>
        <div className={c.wrap}>
          <span className={c.kicker}>How it works</span>
          <h2 className={c.h2}>
            In <span className={c.italic}>{sv.workflow.length} scenes.</span>
          </h2>
          <ol className={s.scenes}>
            {sv.workflow.map((w, i) => (
              <li key={w.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span>Scene {String(i + 1).padStart(2, "0")}</span>
                <h3>{w.title}</h3>
                <p>{w.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · Visual demonstration  ·  7 · Outcomes */}
      <section className={c.section}>
        <div className={`${c.wrap} ${s.demoGrid}`}>
          <div className={s.demo} data-reveal>
            <ServiceDemo kind={sv.demo} tone="dark" />
          </div>
          <Rise>
            <span className={c.kicker}>The ending</span>
            <h2 className={c.h2}>What changes.</h2>
            <ul className={s.outcomes}>
              {sv.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Rise>
        </div>
      </section>

      {/* 8 · FAQs */}
      <section className={c.section}>
        <div className={`${c.wrap} ${s.two}`}>
          <span className={c.kicker}>Questions</span>
          <div className={s.faqs}>
            {sv.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Enquiry CTA */}
      <section className={s.cta}>
        <div className={c.wrap}>
          <Rise>
            <h2 className={c.display}>
              Your brand, <span className={c.italic}>in frame.</span>
            </h2>
            <div className={c.actions}>
              <Link href={`/creative/contact?service=${sv.slug}`} className={c.btn}>
                Begin with {sv.name} →
              </Link>
              <Link href={`/business/services/${sv.slug}`} className={c.btnLine}>
                See the system view
              </Link>
            </div>
          </Rise>
          <Link href={`/creative/services/${next.slug}`} className={s.next}>
            <small>Next</small>
            {next.name} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <JsonLd
        data={[
          serviceLd(sv, "creative"),
          faqLd(sv),
          breadcrumbLd([
            { name: "Creative", path: "/creative" },
            { name: "Services", path: "/creative/services" },
            { name: sv.name, path: `/creative/services/${sv.slug}` },
          ]),
        ]}
      />
    </>
  );
}
