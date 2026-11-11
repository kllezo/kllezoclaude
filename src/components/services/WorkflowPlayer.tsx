"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import s from "./services.module.css";

type Step = { title: string; detail: string };

/* How it works — the steps as a player. A track fills step by step and only the
   current step's detail is shown, large. Click any step; hover pauses. */
export default function WorkflowPlayer({ steps, tone = "dark" }: { steps: Step[]; tone?: "dark" | "light" }) {
  const { ref, seen, reduce } = useInView<HTMLDivElement>();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!seen || reduce || paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % steps.length), 3200);
    return () => clearInterval(t);
  }, [seen, reduce, paused, steps.length]);

  const cur = steps[i];
  return (
    <div
      ref={ref}
      className={`${s.player} ${tone === "light" ? s.playerLight : ""}`}
      style={{ ["--n" as string]: steps.length, ["--i" as string]: i }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className={s.track} role="tablist" aria-label="Steps">
        <i className={s.trackFill} aria-hidden="true" />
        {steps.map((st, k) => (
          <li key={st.title}>
            <button type="button" role="tab" aria-selected={k === i} data-done={k < i ? "" : undefined} onClick={() => setI(k)}>
              <span className={s.dot}>{k < i ? "✓" : k + 1}</span>
              <span className={s.dotLabel}>{st.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className={s.stepCard} role="tabpanel" aria-live="polite">
        <div key={i} className={s.stepInner}>
          <span className={s.stepCount}>
            Step {i + 1} of {steps.length}
          </span>
          <h3>{cur.title}</h3>
          <p>{cur.detail}</p>
        </div>
      </div>
    </div>
  );
}
