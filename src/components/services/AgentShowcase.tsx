"use client";

import { useEffect, useRef, useState } from "react";
import Vignette from "./Vignette";
import type { Agent } from "@/content/motion";
import s from "./AgentShowcase.module.css";

type Variant = { name: string; points: string[] };

/* ─────────────────────────────────────────────────────────────────────────
   Each agent, shown doing its job. Plays through on its own once it's on
   screen (the tab's bar shows how long until the next one); tapping a tab
   picks it and stops the auto-play.
   ───────────────────────────────────────────────────────────────────────── */
const DUR = 7000;

export default function AgentShowcase({ agents, variants }: { agents: Agent[]; variants: Variant[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !auto) return;
    const t = setTimeout(() => setI((k) => (k + 1) % agents.length), DUR);
    return () => clearTimeout(t);
  }, [i, inView, auto, agents.length]);

  const a = agents[i];
  const points = variants.find((v) => v.name === a.variant)?.points ?? [];

  return (
    <div ref={root} className={s.wrap}>
      <div className={s.tabs} role="tablist" aria-label="Agents">
        {agents.map((g, k) => (
          <button
            key={g.tab}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => {
              setI(k);
              setAuto(false);
            }}
            className={s.tab}
          >
            <b>{g.tab}</b>
            <small>{g.kind}</small>
            <i data-run={k === i && inView && auto ? "" : undefined} data-full={k === i && !auto ? "" : undefined} style={{ ["--dur" as string]: `${DUR}ms` }} />
          </button>
        ))}
      </div>
      <div className={s.body}>
        <div className={s.stage}>{inView || i > 0 ? <Vignette key={a.v} v={a.v} tone="good" /> : <Vignette v={a.v} tone="good" className={s.idle} />}</div>
        <div key={a.tab} className={s.copy}>
          <span className={s.kind}>{a.kind}</span>
          <h3>{a.tab} agent</h3>
          <p>{a.line}</p>
          <ul>
            {points.map((p, k) => (
              <li key={p} style={{ ["--i" as string]: k }}>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
