import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Lines from "@/components/creative/kit/Lines";
import JsonLd from "@/components/shared/JsonLd";
import { divisionById, serviceBySlug, services } from "@/content/services";
import { serviceMedia, serviceOrb } from "@/content/creativeMedia";
import { breadcrumbLd, faqLd, pageMeta, serviceLd } from "@/lib/seo";

export const dynamicParams = false;

/** Last word set in italic gold on its own line: "AI Calling" / "Agents". */
function titleLines(name: string) {
  const words = name.split(" ");
  if (words.length === 1) return [<em key="l">{name}</em>];
  return [words.slice(0, -1).join(" "), <em key="l">{words[words.length - 1]}</em>];
}

export function generateStaticParams() {
  return services.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) return {};
  return pageMeta({ exp: "creative", path: `/services/${sv.slug}`, title: sv.name, description: sv.summary });
}

export default async function CreativeServiceDetail({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) notFound();
  const div = divisionById(sv.division);
  const media = serviceMedia[sv.slug];
  const orb = serviceOrb(sv.slug, sv.division);
  const next = services[(services.indexOf(sv) + 1) % services.length];
  const enquire = `/creative/contact?service=${sv.slug}`;
  const portrait = media.h > media.w;

  return (
    <>
      {/* 1 · Title */}
      <section className="cx-sv-hero">
        <div className="cx-wrap cx-sv-hero-grid">
          <div>
            <p className="cx-kicker" data-cx-fade>
              <Link href={`/creative/services#${sv.division}`} className="cx-underline">
                {div.name}
              </Link>{" "}
              — <span className="cx-gold">{sv.code}</span>
            </p>
            <Lines as="h1" className="cx-display" lines={titleLines(sv.name)} />
            <p className="cx-sv-tagline" data-cx-fade="0.3">
              {sv.tagline}
            </p>
            <div className="cx-sv-actions" data-cx-fade="0.45">
              <Link href={enquire} className="cx-pill" data-cx-magnetic>
                Start this project
              </Link>
              <a href="#how" className="cx-underline">
                How it works
              </a>
            </div>
          </div>
          <div className="cx-sv-visual" aria-hidden="true">
            <Image className="cx-sv-orb" src={orb.src} alt="" width={orb.w} height={orb.h} sizes="40vw" priority unoptimized data-cx-parallax="-0.3" />
            <figure className={`cx-sv-media${portrait ? " is-tall" : ""}`} style={{ aspectRatio: media.h > media.w * 1.6 ? "0.62" : `${media.w} / ${media.h}` }} data-cx-clip>
              <Image src={media.src} alt={media.alt} width={media.w} height={media.h} sizes="(max-width: 900px) 90vw, 36vw" priority unoptimized />
            </figure>
          </div>
        </div>
      </section>

      {/* 2 · The problem */}
      <section className="cx-sv-block cx-wrap" aria-labelledby="problem">
        <p className="cx-kicker" id="problem">
          (01) The problem
        </p>
        <ol className="cx-problems">
          {sv.problems.map((p, i) => (
            <li key={p} data-cx-fade={i * 0.06}>
              <span className="cx-gold">0{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      </section>

      {/* 3 · Why it keeps happening */}
      <section className="cx-sv-why cx-wrap" aria-label="Why it keeps happening">
        <p className="cx-kicker">(02) Why it keeps happening</p>
        <p className="cx-statement cx-statement-sm" data-cx-words>
          {sv.whyItFails}
        </p>
      </section>

      {/* 4 · The answer */}
      <section className="cx-sv-block cx-wrap cx-sv-answer" aria-labelledby="answer">
        <p className="cx-kicker" id="answer">
          (03) The Kllezo answer
        </p>
        <div className="cx-sv-answer-grid">
          <p className="cx-sv-summary" data-cx-fade>
            {sv.summary}
          </p>
          {sv.variants && (
            <div className="cx-variants">
              {sv.variants.map((v, i) => (
                <div key={v.name} data-cx-fade={i * 0.08}>
                  <h3>{v.name}</h3>
                  <ul>
                    {v.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5 · How it works */}
      <section id="how" className="cx-sv-how" aria-labelledby="how-h">
        <div className="cx-wrap cx-sv-how-grid">
          <div className="cx-sv-how-head">
            <p className="cx-kicker">(04) How it runs</p>
            <h2 id="how-h" className="cx-display-md" data-cx-fade>
              From brief
              <br />
              to <em>rhythm.</em>
            </h2>
          </div>
          <ol className="cx-steps">
            {sv.workflow.map((w, i) => (
              <li key={w.title} data-cx-fade>
                <span className="cx-steps-n">0{i + 1}</span>
                <h3>{w.title}</h3>
                <p>{w.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · What you receive / what changes */}
      <section className="cx-sv-block cx-wrap" aria-label="Deliverables and outcomes">
        <div className="cx-two">
          <div>
            <p className="cx-kicker">(05) What you receive</p>
            <ul className="cx-deliv">
              {sv.deliverables.map((d, i) => (
                <li key={d} data-cx-fade={(i % 6) * 0.04}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="cx-kicker">(06) What changes</p>
            <ul className="cx-outcomes">
              {sv.outcomes.map((o, i) => (
                <li key={o} data-cx-fade={i * 0.06}>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7 · Questions */}
      <section className="cx-sv-block cx-wrap cx-faq-wrap" aria-labelledby="faq-h">
        <div>
          <p className="cx-kicker">(07) Questions</p>
          <h2 id="faq-h" className="cx-display-md" data-cx-fade>
            Asked <em>often.</em>
          </h2>
        </div>
        <div className="cx-faq">
          {sv.faqs.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 8 · Next */}
      <section className="cx-next">
        <Link href={`/creative/services/${next.slug}`} className="cx-wrap cx-next-link" data-cursor="Next">
          <span className="cx-kicker">Next service — {next.code}</span>
          <span className="cx-next-name">
            {next.name} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>

      <JsonLd data={serviceLd(sv, "creative")} />
      <JsonLd data={faqLd(sv)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Kllezo", path: "/creative" },
          { name: "Services", path: "/creative/services" },
          { name: sv.name, path: `/creative/services/${sv.slug}` },
        ])}
      />
    </>
  );
}
