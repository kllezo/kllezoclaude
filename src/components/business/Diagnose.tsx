"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { divisionById, serviceBySlug } from "@/content/services";
import { track } from "@/lib/analytics";
import s from "./Diagnose.module.css";

/* "Which of these sound familiar?" — the visitor names their own problems, and a
   plan assembles beside them: the services that fix exactly those problems, in
   the order we'd tackle them. The plan carries straight into the enquiry form. */

const SYMPTOMS = [
  { id: "posts", t: "We post regularly, but it rarely brings enquiries.", fix: ["content-growth"] },
  { id: "face", t: "Nobody knows the people behind the business.", fix: ["personal-brand"] },
  { id: "look", t: "Our videos and ads don't look as good as we are.", fix: ["video-production", "ugc-ad-creatives"] },
  { id: "bounce", t: "People visit the website, then leave.", fix: ["business-website", "lead-generation"] },
  { id: "store", t: "Our online store gets visitors but few orders.", fix: ["ecommerce"] },
  { id: "dms", t: "Messages and DMs wait hours for a reply.", fix: ["ai-texting"] },
  { id: "calls", t: "We miss calls — especially after hours.", fix: ["ai-calling"] },
  { id: "cold", t: "Leads go cold because nobody follows up.", fix: ["ai-texting", "ai-calling"] },
];

const ORDER = ["content", "websites", "ai"] as const;

export default function Diagnose() {
  const [picked, setPicked] = useState<string[]>([]);

  const plan = useMemo(() => {
    const slugs = Array.from(new Set(SYMPTOMS.filter((x) => picked.includes(x.id)).flatMap((x) => x.fix)));
    return slugs
      .map((slug) => serviceBySlug(slug)!)
      .sort((a, b) => ORDER.indexOf(a.division) - ORDER.indexOf(b.division));
  }, [picked]);

  const divisionsHit = new Set(plan.map((p) => p.division)).size;
  const verdict =
    picked.length === 0
      ? { t: "Tick what sounds familiar.", d: "Your plan builds itself here as you go." }
      : divisionsHit >= 2
        ? { t: "Start with step 1.", d: "Fix the biggest leak first. The rest are ready when you are — and they're built to connect, so each one makes the last work harder." }
        : { t: "A focused fix.", d: "Your leak sits in one place. Start here, measure it, then decide what's next." };

  const toggle = (id: string) => {
    const on = !picked.includes(id);
    track("diagnose_symptom", { symptom: id, on, total: picked.length + (on ? 1 : -1) });
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  return (
    <div className={s.root}>
      <ul className={s.symptoms}>
        {SYMPTOMS.map((x, i) => {
          const on = picked.includes(x.id);
          return (
            <li key={x.id}>
              <button type="button" className={s.sym} aria-pressed={on} onClick={() => toggle(x.id)}>
                <span className={s.box} aria-hidden="true">
                  <svg viewBox="0 0 12 10" width="12" height="10">
                    <path d="M1 5l3.2 3.2L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <span className={s.symN}>{String(i + 1).padStart(2, "0")}</span>
                <span>{x.t}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={s.plan} aria-live="polite">
        <div className={s.planHead}>
          <span>Your diagnosis</span>
          <b>
            {picked.length} {picked.length === 1 ? "problem" : "problems"}
          </b>
        </div>
        <p className={s.verdict}>{verdict.t}</p>
        <p className={s.verdictD}>{verdict.d}</p>

        <ol className={s.steps}>
          {plan.map((sv, i) => (
            <li key={sv.slug} className={s.step} style={{ ["--i" as string]: i }}>
              <span className={s.stepN}>Step {i + 1}</span>
              <div>
                <Link href={`/services/${sv.slug}`} className={s.stepName}>
                  {sv.name}
                </Link>
                <span className={s.stepDiv}>{divisionById(sv.division).name}</span>
                <p>{sv.tagline}</p>
              </div>
            </li>
          ))}
          {!plan.length && (
            <li className={s.empty}>
              <span />
              <span />
              <span />
            </li>
          )}
        </ol>

        <div className={s.planFoot}>
          <Link
            href={plan.length ? `/contact?service=${plan.map((p) => p.slug).join(",")}` : "/contact"}
            className={s.cta}
            aria-disabled={!plan.length}
            onClick={() => track("diagnose_cta", { services: plan.map((p) => p.slug).join(",") })}
          >
            {plan.length ? "Get this plan →" : "Book a strategy call →"}
          </Link>
          <span>{plan.length ? "Your selections carry into the form." : "Or tell us on a call."}</span>
        </div>
      </aside>
    </div>
  );
}
