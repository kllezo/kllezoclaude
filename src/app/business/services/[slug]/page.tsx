import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDemo from "@/components/shared/ServiceDemo";
import JsonLd from "@/components/shared/JsonLd";
import { divisionById, serviceBySlug, services, servicesIn } from "@/content/services";
import { breadcrumbLd, faqLd, pageMeta, serviceLd } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./detail.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata({ params }: PageProps<"/business/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) return {};
  return pageMeta({ exp: "business", path: `/services/${sv.slug}`, title: sv.name, description: `${sv.tagline} ${sv.summary}`.slice(0, 300) });
}

export default async function BusinessServiceDetail({ params }: PageProps<"/business/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) notFound();
  const div = divisionById(sv.division);
  const related = servicesIn(sv.division).filter((x) => x.slug !== sv.slug);

  return (
    <>
      {/* 1 · Hero & value proposition */}
      <section className={s.hero}>
        <div className={b.wrap}>
          <nav className={s.crumbs} aria-label="Breadcrumb" data-arrive-item>
            <Link href="/business/services">Services</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/business/services#${div.id}`}>{div.name}</Link>
          </nav>
          <div className={s.heroGrid}>
            <div>
              <span className={b.eyebrow} data-arrive-item>
                {sv.code} · {div.name}
              </span>
              <h1 className={`${b.h1} ${s.h1}`} data-arrive-item>
                {sv.name}
              </h1>
              <p className={b.lead} data-arrive-item>
                {sv.summary}
              </p>
              <div className={b.actions} data-arrive-item>
                <Link href={`/business/contact?service=${sv.slug}`} className={b.btn}>
                  Book a Strategy Call →
                </Link>
                <a href="#how" className={b.btnGhost}>
                  How it works
                </a>
              </div>
            </div>
            <div data-arrive-item>
              <ServiceDemo kind={sv.demo} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · The problem  →  why the usual approach falls short */}
      <section className={`${b.section} ${b.white}`}>
        <div className={`${b.wrap} ${s.ps}`}>
          <div data-reveal>
            <span className={b.eyebrow}>The problem</span>
            <h2 className={b.h2}>Sound familiar?</h2>
            <ul className={s.problems}>
              {sv.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <aside className={s.why} data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <span className={s.whyLabel}>Why it keeps happening</span>
            <p className={s.whyText}>{sv.whyItFails}</p>
          </aside>
        </div>
      </section>

      {/* 3 · The Kllezo solution */}
      <section className={b.section}>
        <div className={`${b.wrap} ${s.solution}`}>
          <div data-reveal>
            <span className={b.eyebrow}>The Kllezo solution</span>
            <h2 className={b.h2}>{sv.tagline}</h2>
          </div>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }}>
            <p className={b.lead}>{div.businessLine}</p>
            {sv.variants && (
              <div className={s.variants}>
                {sv.variants.map((v) => (
                  <div key={v.name}>
                    <b>{v.name}</b>
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
        </div>
      </section>

      {/* 4 · How the system works */}
      <section className={`${b.section} ${b.green}`} id="how">
        <div className={b.wrap}>
          <span className={b.eyebrow}>How it works</span>
          <h2 className={b.h2}>
            A clear process, <span className={b.serif}>no guesswork.</span>
          </h2>
          <ol className={s.steps}>
            {sv.workflow.map((w, i) => (
              <li key={w.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className={s.stepN}>0{i + 1}</span>
                <h3>{w.title}</h3>
                <p>{w.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · Deliverables */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Deliverables</span>
              <h2 className={b.h2}>What you receive.</h2>
            </div>
          </div>
          <ul className={s.deliv}>
            {sv.deliverables.map((d, i) => (
              <li key={d} data-reveal style={{ ["--d" as string]: `${i * 0.03}s` }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 · The outcome */}
      <section className={`${b.section} ${b.white}`}>
        <div className={`${b.wrap} ${s.out}`}>
          <div data-reveal>
            <span className={b.eyebrow}>The outcome</span>
            <h2 className={b.h2}>What changes.</h2>
            <p className={`${b.lead} ${s.outNote}`}>The results we measure are agreed with you before work starts and reported monthly.</p>
          </div>
          <ul className={s.outcomes} data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {sv.outcomes.map((o, i) => (
              <li key={o}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 · FAQs */}
      <section className={b.section}>
        <div className={`${b.wrap} ${s.faqWrap}`}>
          <div>
            <span className={b.eyebrow}>FAQs</span>
            <h2 className={b.h2}>Questions, answered.</h2>
          </div>
          <div className={s.faqs}>
            {sv.faqs.map((f) => (
              <details key={f.q} className={s.faq}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · Enquiry CTA */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={s.cta} data-reveal>
            <div>
              <h2 className={b.h2}>Ready to talk about {sv.name.toLowerCase()}?</h2>
              <p className={b.lead}>Tell us about your business and we&apos;ll come back with a clear recommendation.</p>
            </div>
            <Link href={`/business/contact?service=${sv.slug}`} className={b.btnGold}>
              Start an enquiry →
            </Link>
          </div>
          {related.length > 0 && (
            <div className={s.related}>
              <span className={b.eyebrow}>Also in {div.name}</span>
              <div className={s.relList}>
                {related.map((r) => (
                  <Link key={r.slug} href={`/business/services/${r.slug}`} className={`${b.card} ${b.cardLink}`}>
                    <span className={b.tag}>{r.code}</span>
                    <h3 className={b.h3}>{r.name}</h3>
                    <p className={b.muted}>{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <JsonLd
        data={[
          serviceLd(sv, "business"),
          faqLd(sv),
          breadcrumbLd([
            { name: "Business", path: "/business" },
            { name: "Services", path: "/business/services" },
            { name: sv.name, path: `/business/services/${sv.slug}` },
          ]),
        ]}
      />
    </>
  );
}
