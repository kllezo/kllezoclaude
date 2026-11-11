"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import s from "./services.module.css";

/* "Sound familiar?" — one problem at a time, large, auto-advancing once on screen.
   Pick any with the numbered pills; hovering pauses it. Every problem stays in the
   list for screen readers and as the pills' labels. */
export default function ProblemCycler({ items }: { items: string[] }) {
  const { ref, seen, reduce } = useInView<HTMLDivElement>();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!seen || reduce || paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % items.length), 2800);
    return () => clearInterval(t);
  }, [seen, reduce, paused, items.length]);

  return (
    <div ref={ref} className={s.cycler} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className={s.cyclerStage} aria-live="polite">
        <p key={i} className={s.cyclerText}>
          <span className={s.cyclerQ}>&ldquo;</span>
          {items[i]}
          <span className={s.cyclerQ}>&rdquo;</span>
        </p>
      </div>
      <ol className={s.cyclerPills}>
        {items.map((p, k) => (
          <li key={p}>
            <button type="button" aria-pressed={k === i} aria-label={p} onClick={() => setI(k)}>
              <span className={s.pillBar}>{k === i && seen && !reduce && !paused && <i />}</span>
              <span className={s.pillText}>{p}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
