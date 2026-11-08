"use client";

import Link from "next/link";
import { useState } from "react";
import { divisions, services, type DivisionId } from "@/content/services";
import s from "./ServiceArchitecture.module.css";

/* Signature interaction 03 — interactive service architecture.
   Choose a division, then hover/select a service to reveal its
   workflow and deliverables in place. */
export default function ServiceArchitecture({ initial = "content" as DivisionId }) {
  const [div, setDiv] = useState<DivisionId>(initial);
  const list = services.filter((sv) => sv.division === div);
  const [slug, setSlug] = useState(list[0].slug);
  const sv = services.find((x) => x.slug === slug && x.division === div) ?? list[0];

  return (
    <div className={s.arch}>
      <div className={s.tabs} role="tablist" aria-label="Service divisions">
        {divisions.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === div}
            className={s.tab}
            onClick={() => {
              setDiv(d.id);
              setSlug(services.find((x) => x.division === d.id)!.slug);
            }}
          >
            <span>{d.index}</span>
            {d.name}
          </button>
        ))}
      </div>

      <div className={s.body}>
        <ul className={s.list} role="listbox" aria-label="Services">
          {list.map((x) => (
            <li key={x.slug}>
              <button
                role="option"
                aria-selected={x.slug === sv.slug}
                className={s.item}
                onMouseEnter={() => setSlug(x.slug)}
                onFocus={() => setSlug(x.slug)}
                onClick={() => setSlug(x.slug)}
              >
                <span className={s.code}>{x.code}</span>
                <span className={s.name}>{x.name}</span>
                <span className={s.tagline}>{x.tagline}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={s.detail} key={sv.slug} aria-live="polite">
          <p className={s.summary}>{sv.summary}</p>
          <span className={s.label}>Workflow</span>
          <ol className={s.flow}>
            {sv.workflow.map((w, i) => (
              <li key={w.title} style={{ ["--i" as string]: i }}>
                <b>{w.title}</b>
                <span>{w.detail}</span>
              </li>
            ))}
          </ol>
          <span className={s.label}>Deliverables</span>
          <ul className={s.deliv}>
            {sv.deliverables.map((d, i) => (
              <li key={d} style={{ ["--i" as string]: i }}>
                {d}
              </li>
            ))}
          </ul>
          <div className={s.links}>
            <Link href={`/business/services/${sv.slug}`} className={s.more}>
              Explore {sv.name} →
            </Link>
            <Link href={`/business/contact?service=${sv.slug}`} className={s.enq}>
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
