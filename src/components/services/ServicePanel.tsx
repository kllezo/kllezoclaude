"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/content/services";
import { motion } from "@/content/motion";
import Vignette from "./Vignette";
import { useInView } from "./useInView";
import s from "./ServicePanel.module.css";

/* One service on the index, with nothing to click: the preview plays each
   problem and then the fix for it, on the real interfaces, on its own. */

const MS = 3600;

export function ServicePreview({ sv }: { sv: Service }) {
  const mo = motion[sv.slug];
  const beats = mo.problems.flatMap((p, i) => [
    { label: p[0], v: p[1], alt: p[2], tone: "bad" as const },
    { label: mo.outcomes[i][0], v: mo.outcomes[i][1], alt: mo.outcomes[i][2], tone: "good" as const },
  ]);
  const { ref, seen, reduce } = useInView<HTMLDivElement>(0.3);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!seen || reduce) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % beats.length), MS);
    return () => clearTimeout(t);
  }, [seen, reduce, i, beats.length]);
  const b = beats[i];
  return (
    <div ref={ref} className={s.preview}>
      <div key={seen ? i : "idle"} className={`${s.screen} ${seen ? "" : s.idle}`}>
        <Vignette v={b.v} alt={b.alt} tone={b.tone} />
      </div>
      <p key={`c${i}`} className={`${s.cap} ${b.tone === "bad" ? s.capBad : s.capGood}`}>
        <i>{b.tone === "bad" ? "Without a system" : "With Kllezo"}</i>
        {b.label}
      </p>
      <div className={s.dots} aria-hidden="true">
        {beats.map((x, k) => (
          <span key={k} data-on={k === i ? "" : undefined} data-tone={x.tone} />
        ))}
      </div>
    </div>
  );
}

export default function ServicePanel({ sv }: { sv: Service }) {
  const mo = motion[sv.slug];
  return (
    <div className={s.panel}>
      <p className={s.label}>Fixes</p>
      <ul className={s.fixes}>
        {mo.problems.map(([l]) => (
          <li key={l}>
            <i aria-hidden="true">✕</i>
            {l}
          </li>
        ))}
      </ul>
      <p className={s.meta}>
        {sv.deliverables.length} deliverables included · {sv.workflow.length}-step process
      </p>
    </div>
  );
}
