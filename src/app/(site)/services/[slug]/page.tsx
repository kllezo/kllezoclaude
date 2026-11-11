import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDemo from "@/components/shared/ServiceDemo";
import ScrollStory from "@/components/services/ScrollStory";
import VariantTabs from "@/components/services/VariantTabs";
import JsonLd from "@/components/shared/JsonLd";
import { divisionById, serviceBySlug, services } from "@/content/services";
import { pairings } from "@/content/pairings";
import { motion } from "@/content/motion";
import { whatsappLink } from "@/content/site";
import { breadcrumbLd, faqLd, pageMeta, serviceLd } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import s from "./detail.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) return {};
  return pageMeta({ path: `/services/${sv.slug}`, title: sv.name, description: `${sv.tagline} ${sv.summary}`.slice(0, 300) });
}

export default async function BusinessServiceDetail({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) notFound();
  const div = divisionById(sv.division);
  // Upgrade path: the services that make this one work harder.
  const pairs = (pairings[sv.slug] ?? []).map((p) => ({ sv: serviceBySlug(p.slug)!, why: p.why }));
  const mo = motion[sv.slug];
  const wa = whatsappLink(`Hi Kllezo, I'd like to talk about ${sv.name}.`);

  return (
    <>
      {/* 1 · Hero & value proposition */}
      <section className={s.hero}>
        <div className={b.wrap}>
          <nav className={s.crumbs} aria-label="Breadcrumb" data-arrive-item>
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/services#${div.id}`}>{div.name}</Link>
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
                <Link href={`/contact?service=${sv.slug}`} className={b.btn}>
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

      {/* 2 · Their problem — scroll through it, one screen per problem */}
      <ScrollStory
        eyebrow="The problem"
        title="Sound familiar?"
        tone="bad"
        theme="white"
        beats={mo.problems.map(([label, v, alt], i) => ({ label, v, alt, body: sv.problems[i] }))}
      />

      {/* 3 · Our solution — the same business, with Kllezo */}
      <ScrollStory
        eyebrow="Our solution"
        title={
          <>
            Here&apos;s what <em>changes.</em>
          </>
        }
        tone="good"
        theme="light"
        beats={mo.outcomes.map(([label, v, alt], i) => ({ label, v, alt, body: sv.outcomes[i] }))}
      />

      {/* 4 · How exactly we fix it */}
      <ScrollStory
        id="how"
        eyebrow="How we fix it"
        title={
          <>
            Step by step, <em>no guesswork.</em>
          </>
        }
        tone="good"
        theme="dark"
        kind="steps"
        beats={sv.workflow.map((st, i) => {
          const m = mo.steps[i];
          const [v, alt] = Array.isArray(m) ? m : [m, undefined];
          return { label: st.title, body: st.detail, v, alt };
        })}
      />

      {/* 5 · What you get */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={s.getHead}>
            <span className={b.eyebrow}>What you get</span>
            <h2 className={b.h2}>
              Everything included. <span className={b.serif}>Nothing to manage.</span>
            </h2>
          </div>
          <ul className={s.get}>
            {sv.deliverables.map((x, i) => (
              <li key={x} data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.05}s` }}>
                <span className={s.getN}>{String(i + 1).padStart(2, "0")}</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          {sv.variants && (
            <div className={s.getVariants} data-reveal>
              <p className={s.getVarLabel}>Choose what fits</p>
              <VariantTabs variants={sv.variants} />
            </div>
          )}
        </div>
      </section>

      {/* 6 · FAQs */}
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

      {/* 7 · The call to action */}
      <section className={s.ctaSec}>
        <div className={b.wrap}>
          <div className={s.ctaBox}>
            <div className={s.ctaText}>
              <span className={s.ctaEyebrow}>Let&apos;s fix it</span>
              <h2 className={s.ctaH}>
                Stop losing customers. <em>Start this month.</em>
              </h2>
              <p className={s.ctaP}>Book a free strategy call. You&apos;ll leave with a clear plan for {sv.name} — whether you work with us or not.</p>
              <div className={s.ctaBtns}>
                <Link href={`/contact?service=${sv.slug}`} className={s.ctaPrimary}>
                  Book a free strategy call →
                </Link>
                {wa && (
                  <a href={wa} className={s.ctaSecondary} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </a>
                )}
              </div>
            </div>
            <ul className={s.ctaList}>
              {["A free 30-minute call", "A clear plan and price before you commit", "Start with one service, add more later"].map((x) => (
                <li key={x}>
                  <i aria-hidden="true">✓</i>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          {pairs.length > 0 && (
            <div className={s.related}>
              <span className={b.eyebrow}>Works even better with</span>
              <div className={s.relList}>
                {pairs.map(({ sv: r, why }) => (
                  <Link key={r.slug} href={`/services/${r.slug}`} className={`${b.card} ${b.cardLink}`}>
                    <span className={b.tag}>{r.code}</span>
                    <h3 className={b.h3}>{r.name}</h3>
                    <p className={b.muted}>{why}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <JsonLd
        data={[
          serviceLd(sv),
          faqLd(sv),
          breadcrumbLd([
            { name: "Kllezo", path: "/" },
            { name: "Services", path: "/services" },
            { name: sv.name, path: `/services/${sv.slug}` },
          ]),
        ]}
      />
    </>
  );
}
