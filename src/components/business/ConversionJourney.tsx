"use client";

import { useEffect, useRef, useState } from "react";
import s from "./ConversionJourney.module.css";

/* Signature interaction 08 — how a visitor becomes an enquiry,
   a qualified lead and then a customer, and which part of the
   Kllezo system does the work at each stage. */

const stages = [
  {
    name: "Visitor",
    system: "Content",
    what: "Short-form video, social content and ads earn attention from the right audience and bring them to you.",
    measure: ["Reach", "Engagement", "Profile & site visits"],
  },
  {
    name: "Enquiry",
    system: "Website",
    what: "A conversion-focused website or landing page explains the offer clearly and makes the next step obvious.",
    measure: ["Conversion rate", "Form completions", "WhatsApp clicks"],
  },
  {
    name: "Qualified lead",
    system: "AI Systems",
    what: "AI texting and calling agents respond instantly, ask the right questions and follow up automatically.",
    measure: ["Response time", "Qualification rate", "Follow-ups sent"],
  },
  {
    name: "Customer",
    system: "Your team + AI",
    what: "Appointments are booked, reminders go out, and your team steps in with full context to close.",
    measure: ["Booked appointments", "Show-up rate", "Enquiry-to-customer rate"],
  },
];

export default function ConversionJourney() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const r = ref.current?.getBoundingClientRect();
      if (r && r.bottom > 0 && r.top < window.innerHeight) setI((x) => (x + 1) % stages.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [auto]);

  const st = stages[i];
  return (
    <div ref={ref} className={s.journey} style={{ ["--n" as string]: i }}>
      <div className={s.track} role="tablist" aria-label="Conversion journey stages">
        <span className={s.rail} aria-hidden="true">
          <i />
        </span>
        {stages.map((x, k) => (
          <button
            key={x.name}
            role="tab"
            aria-selected={k === i}
            data-done={k < i || undefined}
            className={s.stage}
            onClick={() => {
              setAuto(false);
              setI(k);
            }}
          >
            <span className={s.dot} />
            <b>{x.name}</b>
            <small>{x.system}</small>
          </button>
        ))}
      </div>
      <div className={s.panel} key={i} role="tabpanel">
        <div>
          <span className={s.k}>What happens</span>
          <p className={s.what}>{st.what}</p>
        </div>
        <div>
          <span className={s.k}>What we measure</span>
          <ul className={s.measure}>
            {st.measure.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
