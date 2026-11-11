"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
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

/** One Kllezo wing, cut from the brand mark (a mask, so it takes the text colour). */
const Wing = () => <span className={s.wing} aria-hidden="true" />;

export type StoryBeat = { label: string; body: string; v?: Vkind; alt?: Alt };

export default function ScrollStory({
  id,
  eyebrow,
  title,
  beats,
  tone,
  theme = "light",
  kind = "list",
  layout = "roll",
  footer,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  beats: StoryBeat[];
  tone: Tone;
  theme?: "light" | "white" | "dark";
  kind?: "list" | "steps";
  /** "roll": one big line at a time. "list": every line visible, the playing one lit. */
  layout?: "roll" | "list";
  footer?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
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
      const f = (elapsed.current / DUR).toFixed(3);
      bar.current?.style.setProperty("--local", f);
      list.current?.style.setProperty("--local", f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, paused, n]);

  // Pause only while the pointer is exactly on the line's text or on the
  // screen. Tracked from the pointer itself, so leaving the window (or the
  // pointer jumping off the page) always lets it run again.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const hit = e.target instanceof Element && el.contains(e.target) && !!e.target.closest("[data-hold]");
      setPaused(hit);
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setPaused(false);
    };
    const off = () => setPaused(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", off);
    window.addEventListener("blur", off);
    window.addEventListener("scroll", off, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", off);
      window.removeEventListener("blur", off);
      window.removeEventListener("scroll", off);
    };
  }, []);

  const go = (k: number) => {
    elapsed.current = 0;
    bar.current?.style.setProperty("--local", "0");
    list.current?.style.setProperty("--local", "0");
    setI(k);
  };

  const cur = beats[i];
  return (
    <section
      ref={root}
      id={id}
      className={`${s.story} ${s[theme]}`}
      aria-label={typeof title === "string" ? title : eyebrow}
    >
      <div className={s.pin}>
        <div className={s.grid}>
          <div className={s.text}>
            <span className={s.eyebrow}>{eyebrow}</span>
            <h2 className={s.title}>{title}</h2>
            {layout === "list" ? (
              /* Everything at once: every line visible, the playing one darkens and fills its bar. */
              <ol ref={list} className={s.list} aria-label="Jump to">
                {beats.map((b, k) => (
                  <li key={b.label} data-state={k < i ? "done" : k === i ? "on" : "todo"}>
                    <button type="button" aria-current={k === i} onClick={() => go(k)}>
                      <span className={s.listHead}>
                        <Wing />
                        <b data-hold="">{b.label}</b>
                      </span>
                      <span className={s.listBody}>
                        <span>
                          <span data-hold="">{b.body}</span>
                        </span>
                      </span>
                      <i className={s.listBar} />
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <div className={s.beats} aria-live="polite">
                  {beats.map((b, k) => (
                    <div key={b.label} className={s.beat} data-state={k === i ? "on" : k < i ? "prev" : "next"} aria-hidden={k !== i}>
                      <span className={`${s.num} ${tone === "bad" ? s.numBad : s.numGood}`}>
                        {kind === "steps" ? `Step ${k + 1}` : tone === "bad" ? "✕" : "✓"}
                        <small>
                          {String(k + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                        </small>
                      </span>
                      <h3>
                        <span data-hold="">{b.label}</span>
                      </h3>
                      <p>
                        <span data-hold="">{b.body}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div ref={bar} className={s.bar} role="tablist" aria-label="Jump to">
                  {beats.map((b, k) => (
                    <Fragment key={b.label}>
                      {k > 0 && (
                        <button type="button" className={s.wingBtn} aria-label={`Skip to ${b.label}`} onClick={() => go(k)} data-state={k <= i ? "done" : "todo"}>
                          <Wing />
                        </button>
                      )}
                      <button type="button" role="tab" aria-selected={k === i} aria-label={b.label} onClick={() => go(k)} data-state={k < i ? "done" : k === i ? "on" : "todo"}>
                        <i />
                        {kind === "steps" && <span>{b.label}</span>}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <span className={s.next}>
                  {kind === "steps" ? "Next step" : "Next"}: <b>{beats[(i + 1) % n].label}</b>
                </span>
              </>
            )}
            <span className={s.hint} data-paused={paused ? "" : undefined}>
              {paused ? "Paused" : "Hover the text or screen to pause"}
            </span>
            {footer}
          </div>
          <div className={s.stage}>
            {cur.v &&
              (seen ? (
                <div key={i} className={s.screen} data-hold="">
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
