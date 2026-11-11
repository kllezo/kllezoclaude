"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import Vignette, { type Tone } from "./Vignette";
import type { Beat } from "@/content/motion";
import s from "./StoryCycler.module.css";

/* A list of short lines with one animation per line. Lines highlight one after
   another and the matching animation plays; click a line to jump, hover to
   pause. The full sentence sits under the animation for anyone who wants it. */

const MS = 4200;

export default function StoryCycler({ beats, full, tone, flip = false, compact = false }: { beats: Beat[]; full: string[]; tone: Tone; flip?: boolean; compact?: boolean }) {
  const { ref, seen, reduce } = useInView<HTMLDivElement>(0.3);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = seen && !reduce && !paused;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % beats.length), MS);
    return () => clearTimeout(t);
  }, [running, i, beats.length]);

  const [label, v, alt] = beats[i];
  return (
    <div
      ref={ref}
      className={`${s.root} ${flip ? s.flip : ""} ${compact ? s.compact : ""} ${tone === "good" ? s.good : s.bad}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className={s.list} role="tablist">
        {beats.map(([l], k) => (
          <li key={l}>
            <button type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)} title={full[k]}>
              <span className={s.n}>{tone === "good" ? "✓" : "✕"}</span>
              <span className={s.l}>{l}</span>
              <i className={s.bar}>{k === i && <i key={`${i}-${running}`} className={running ? s.run : ""} style={{ animationDuration: `${MS}ms` }} />}</i>
            </button>
          </li>
        ))}
      </ol>
      <figure className={s.stage} role="tabpanel" aria-label={label}>
        {seen ? <Vignette key={i} v={v} alt={alt} tone={tone} /> : <Vignette key="idle" v={beats[0][1]} alt={beats[0][2]} tone={tone} className={s.idle} />}
        <figcaption key={`c${i}`} className={s.cap}>
          {full[i]}
        </figcaption>
      </figure>
    </div>
  );
}
