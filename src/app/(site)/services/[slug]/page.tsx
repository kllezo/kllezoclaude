import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDemo from "@/components/shared/ServiceDemo";
import StoryCycler from "@/components/services/StoryCycler";
import StepJourney from "@/components/services/StepJourney";
import TickList from "@/components/services/TickList";
import VariantTabs from "@/components/services/VariantTabs";
import JsonLd from "@/components/shared/JsonLd";
import { divisionById, serviceBySlug, services } from "@/content/services";
import { pairings } from "@/content/pairings";
import { motion } from "@/content/motion";
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

      {/* 2 · The problem — one animation per problem, played in turn */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={s.secHead} data-reveal>
            <span className={b.eyebrow}>The problem</span>
            <h2 className={b.h2}>Sound familiar?</h2>
          </div>
          <StoryCycler beats={mo.problems} full={sv.problems} tone="bad" />
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
                <VariantTabs variants={sv.variants} />
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
          <StepJourney steps={sv.workflow} motion={mo.steps} />
        </div>
      </section>

      {/* 5 · Deliverables */}
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>Deliverables</span>
              <h2 className={b.h2}>What you receive.</h2>
              <p className={b.lead}>{sv.deliverables.length} deliverables, all included.</p>
            </div>
          </div>
          <TickList items={sv.deliverables} />
        </div>
      </section>

      {/* 6 · The outcome — the same, from the other side */}
      <section className={`${b.section} ${b.white}`}>
        <div className={b.wrap}>
          <div className={s.secHead} data-reveal>
            <span className={b.eyebrow}>The outcome</span>
            <h2 className={b.h2}>What changes.</h2>
          </div>
          <StoryCycler beats={mo.outcomes} full={sv.outcomes} tone="good" flip />
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
            <Link href={`/contact?service=${sv.slug}`} className={b.btnGold}>
              Start an enquiry →
            </Link>
          </div>
          {pairs.length > 0 && (
            <div className={s.related}>
              <span className={b.eyebrow}>Start here · add later</span>
              <div className={s.relList}>
                {pairs.map(({ sv: r, why }) => (
                  <Link key={r.slug} href={`/services/${r.slug}`} className={`${b.card} ${b.cardLink}`}>
                    <span className={b.tag}>Pairs well · {r.code}</span>
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
