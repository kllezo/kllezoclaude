"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Vignette, { type Tone } from "./Vignette";
import type { Alt, Vkind } from "@/content/motion";
import s from "./ScrollStory.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   A rolling headline. No pinning, no extra scrolling: the section is one
   screen tall. While it's on screen the headline rolls to the next beat
   every few seconds and the screen beside it follows; the bars show how
   long until the next one. Hovering pauses it, tapping a bar jumps to it.
   ───────────────────────────────────────────────────────────────────────── */

const DUR = 5200;

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
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const n = beats.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The clock: runs only while the section is on screen and not hovered.
  const elapsed = useRef(0);
  useEffect(() => {
    if (!inView || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= DUR) {
        elapsed.current = 0;
        setI((k) => (k + 1) % n);
      }
      bar.current?.style.setProperty("--local", (elapsed.current / DUR).toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, paused, n]);

  const go = (k: number) => {
    elapsed.current = 0;
    bar.current?.style.setProperty("--local", "0");
    setI(k);
  };

  const cur = beats[i];
  return (
    <section
      ref={root}
      id={id}
      className={`${s.story} ${s[theme]}`}
      aria-label={typeof title === "string" ? title : eyebrow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={s.pin}>
        <div className={s.grid}>
          <div className={s.text}>
            <span className={s.eyebrow}>{eyebrow}</span>
            <h2 className={s.title}>{title}</h2>
            <div className={s.beats} aria-live="polite">
              {beats.map((b, k) => (
                <div key={b.label} className={s.beat} data-state={k === i ? "on" : k < i ? "prev" : "next"} aria-hidden={k !== i}>
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
            <span className={s.hint}>
              {kind === "steps" ? "Next step" : "Next"}: <b>{beats[(i + 1) % n].label}</b>
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
