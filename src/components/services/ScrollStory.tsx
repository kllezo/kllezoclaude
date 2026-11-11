"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Vignette, { type Tone } from "./Vignette";
import type { Alt, Vkind } from "@/content/motion";
import s from "./ScrollStory.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   A pinned, scroll-driven story. The section holds still while you scroll;
   each stretch of scroll is one beat — its headline, its sentence and its
   screen change together, and the bar under the text fills as you go.
   Nothing needs clicking (the bar's segments jump to a beat if you want).
   ───────────────────────────────────────────────────────────────────────── */

export type StoryBeat = { label: string; body: string; v?: Vkind; alt?: Alt };

export default function ScrollStory({
  id,
  eyebrow,
  title,
  beats,
  tone,
  theme = "light",
  kind = "list",
  footer,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  beats: StoryBeat[];
  tone: Tone;
  theme?: "light" | "white" | "dark";
  kind?: "list" | "steps";
  footer?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(false);
  const [moved, setMoved] = useState(false);
  const n = beats.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, el.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const f = Math.min(n - 1e-4, p * n);
      const idx = Math.floor(f);
      setI(idx);
      if (r.top < vh * 0.55) setSeen(true);
      setMoved(p > 0.015);
      bar.current?.style.setProperty("--local", (f - idx).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((k + 0.08) / n) * total;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const cur = beats[i];
  return (
    <section ref={root} id={id} className={`${s.story} ${s[theme]}`} style={{ ["--n" as string]: n }} aria-label={typeof title === "string" ? title : eyebrow}>
      <div className={s.pin}>
        <div className={s.grid}>
          <div className={s.text}>
            <span className={s.eyebrow}>{eyebrow}</span>
            <h2 className={s.title}>{title}</h2>
            <div className={s.beats} aria-live="polite">
              {beats.map((b, k) => (
                <div key={b.label} className={s.beat} data-on={k === i ? "" : undefined} aria-hidden={k !== i}>
                  <span className={`${s.num} ${tone === "bad" ? s.numBad : s.numGood}`}>
                    {kind === "steps" ? `Step ${k + 1}` : tone === "bad" ? "✕" : "✓"}
                    <small>
                      {String(k + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </small>
                  </span>
                  <h3>{b.label}</h3>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
            <div ref={bar} className={s.bar} role="tablist" aria-label="Jump to">
              {beats.map((b, k) => (
                <button key={b.label} type="button" role="tab" aria-selected={k === i} aria-label={b.label} onClick={() => go(k)} data-state={k < i ? "done" : k === i ? "on" : "todo"}>
                  <i />
                  {kind === "steps" && <span>{b.label}</span>}
                </button>
              ))}
            </div>
            <span className={s.hint} data-hide={moved ? "" : undefined}>
              <i /> Scroll to see {kind === "steps" ? "each step" : "each one"}
            </span>
            {footer}
          </div>
          <div className={s.stage}>
            {cur.v &&
              (seen ? (
                <div key={i} className={s.screen}>
                  <Vignette v={cur.v} alt={cur.alt} tone={tone} />
                </div>
              ) : (
                <div className={`${s.screen} ${s.idle}`}>
                  <Vignette v={beats[0].v!} alt={beats[0].alt} tone={tone} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
