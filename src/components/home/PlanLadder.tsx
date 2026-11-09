"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCheck } from "@/components/business/icons";
import s from "./PlanLadder.module.css";

/* The upgrade path, as a ladder: start with one service, connect a second,
   or hand us the whole thing as the managed Kllezo Growth System. Pick a rung
   to see what's included; the call to action follows your choice. */

const PLANS = [
  { id: "single", step: "01", name: "One service", tag: "Start here", d: "Fix the leak that hurts most. Delivered, launched, done." },
  { id: "connected", step: "02", name: "Connected services", tag: "Add when ready", d: "Two or more services built to hand off to each other." },
  { id: "growth", step: "03", name: "Kllezo Growth System", tag: "We run it", d: "Your whole growth engine, managed by us every month." },
] as const;

const ROWS: { k: string; on: [boolean, boolean, boolean] }[] = [
  { k: "Done-for-you delivery", on: [true, true, true] },
  { k: "Built to connect to the rest", on: [true, true, true] },
  { k: "Shared tracking across services", on: [false, true, true] },
  { k: "Content, website & AI run together", on: [false, false, true] },
  { k: "Dedicated growth manager", on: [false, false, true] },
  { k: "Monthly strategy & reporting", on: [false, false, true] },
  { k: "Quarterly growth roadmap", on: [false, false, true] },
];

export default function PlanLadder({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [pick, setPick] = useState(2);
  const plan = PLANS[pick];

  return (
    <div className={`${s.root} ${tone === "light" ? s.light : ""}`}>
      <div className={s.rungs} role="tablist" aria-label="Ways to work with Kllezo">
        {PLANS.map((p, i) => (
          <button key={p.id} type="button" role="tab" aria-selected={i === pick} className={s.rung} data-best={i === 2 ? "" : undefined} onClick={() => setPick(i)}>
            <span className={s.step}>{p.step}</span>
            <span className={s.tag}>{p.tag}</span>
            <b className={s.name}>{p.name}</b>
            <span className={s.d}>{p.d}</span>
          </button>
        ))}
        <i className={s.rail} aria-hidden="true" style={{ ["--p" as string]: pick / 2 }} />
      </div>

      <div className={s.table} role="tabpanel" aria-label={`${plan.name} — what's included`}>
        {ROWS.map((r) => (
          <div key={r.k} className={s.row} data-on={r.on[pick] ? "" : undefined}>
            <span className={s.mark}>{r.on[pick] ? <IconCheck size={14} /> : "–"}</span>
            <span>{r.k}</span>
          </div>
        ))}
      </div>

      <div className={s.foot}>
        <Link href={pick === 2 ? "/growth" : "/services"} className={s.primary}>
          {pick === 0 ? "Pick your first service →" : pick === 1 ? "See what pairs well →" : "Explore the Growth System →"}
        </Link>
        <Link href="/contact" className={s.secondary}>
          Talk it through on a call
        </Link>
      </div>
    </div>
  );
}
