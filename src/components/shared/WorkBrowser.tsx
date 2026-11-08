"use client";

import Link from "next/link";
import { useState } from "react";
import { publishedCaseStudies, workCategories, type WorkCategoryId } from "@/content/work";
import type { Experience } from "@/content/site";
import s from "./WorkBrowser.module.css";

/* Case study browser shared by both experiences. Renders verified
   case studies only; otherwise an honest "being documented" state. */

const serviceFor: Record<WorkCategoryId, string> = {
  content: "content-growth",
  "personal-brand": "personal-brand",
  video: "video-production",
  "business-website": "business-website",
  ecommerce: "ecommerce",
  "lead-generation": "lead-generation",
  "ai-automation": "ai-texting",
};

export default function WorkBrowser({ exp }: { exp: Experience }) {
  const [cat, setCat] = useState<WorkCategoryId | "all">("all");
  const all = publishedCaseStudies();
  const list = cat === "all" ? all : all.filter((c) => c.categories.includes(cat));
  const label = cat === "all" ? "all categories" : workCategories.find((c) => c.id === cat)!.label.toLowerCase();

  return (
    <div className={`${s.wb} ${s[exp]}`}>
      <div className={s.filters} role="toolbar" aria-label="Filter case studies by category">
        <button aria-pressed={cat === "all"} onClick={() => setCat("all")}>
          All
        </button>
        {workCategories.map((c) => (
          <button key={c.id} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <div className={s.grid}>
          {list.map((c) => (
            <article key={c.slug} id={c.slug} className={s.case}>
              {c.media[0]?.type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.media[0].src} alt={c.media[0].alt} loading="lazy" className={s.media} />
              )}
              <h3>{c.client}</h3>
              <p>{c.intro}</p>
              <dl>
                <dt>Problem</dt>
                <dd>{c.problem}</dd>
                <dt>Strategy</dt>
                <dd>{c.strategy}</dd>
                <dt>Execution</dt>
                <dd>{c.execution}</dd>
              </dl>
              {c.results && c.results.length > 0 && (
                <ul className={s.results}>
                  {c.results.map((r) => (
                    <li key={r.label}>
                      <b>{r.value}</b> {r.label}
                      <small>Source: {r.source}</small>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className={s.empty} key={cat}>
          <span className={s.badge}>In documentation</span>
          <h3>Case studies for {label} are being prepared.</h3>
          <p>
            We publish case studies only once the client has approved them and the results have been verified — no invented numbers. Each one will cover
            the client, the initial problem, our strategy, execution, deliverables, verified results, and screenshots or video.
          </p>
          <div className={s.emptyActions}>
            {cat !== "all" && (
              <Link href={`/${exp}/services/${serviceFor[cat]}`} className={s.primary}>
                See how we approach {label} →
              </Link>
            )}
            <Link href={`/${exp}/contact`} className={s.secondary}>
              Ask us for relevant examples
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
