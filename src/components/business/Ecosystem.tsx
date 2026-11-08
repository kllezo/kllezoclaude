"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ServiceDemo from "@/components/shared/ServiceDemo";
import { divisions, servicesIn, type DivisionId } from "@/content/services";
import { track } from "@/lib/analytics";
import s from "./Ecosystem.module.css";

/* Signature interaction 01 — the interactive growth ecosystem.
   Three modules connected through one core. Selecting a module
   expands it into a live preview of that division. Auto-tours
   until the visitor interacts. */

const pos: Record<DivisionId, { x: number; y: number }> = {
  content: { x: 18, y: 22 },
  websites: { x: 82, y: 22 },
  ai: { x: 50, y: 84 },
};
const demoFor: Record<DivisionId, "calendar" | "browser" | "chat"> = { content: "calendar", websites: "browser", ai: "chat" };
const verbs: Record<DivisionId, string> = { content: "Attracts", websites: "Converts", ai: "Closes" };

export default function Ecosystem() {
  const [active, setActive] = useState<DivisionId>("content");
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const order: DivisionId[] = ["content", "websites", "ai"];
    const id = window.setInterval(() => {
      // Only tour while the module is on screen.
      const r = root.current?.getBoundingClientRect();
      if (r && r.bottom > 0 && r.top < window.innerHeight) setActive((a) => order[(order.indexOf(a) + 1) % 3]);
    }, 5200);
    return () => window.clearInterval(id);
  }, [touched]);

  const pick = (id: DivisionId) => {
    setTouched(true);
    setActive(id);
    track("ecosystem_module", { module: id });
  };

  const div = divisions.find((d) => d.id === active)!;

  return (
    <div ref={root} className={s.eco} data-active={active}>
      <div className={s.map}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={s.lines} aria-hidden="true">
          {divisions.map((d) => (
            <line key={d.id} x1={pos[d.id].x} y1={pos[d.id].y} x2="50" y2="48" className={s.spoke} data-on={d.id === active || undefined} />
          ))}
          <polygon points={`${pos.content.x},${pos.content.y} ${pos.websites.x},${pos.websites.y} ${pos.ai.x},${pos.ai.y}`} className={s.ring} />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={s.lines} aria-hidden="true">
          {divisions.map((d, i) => (
            <circle key={d.id} r="0.9" className={s.pulse}>
              <animateMotion dur="2.6s" begin={`${i * 0.8}s`} repeatCount="indefinite" path={`M${pos[d.id].x} ${pos[d.id].y} L50 48`} />
            </circle>
          ))}
        </svg>

        <div className={s.core} aria-hidden="true">
          <span className={s.coreRing} />
          <b>Growth</b>
          <small>system</small>
        </div>

        <div role="tablist" aria-label="Kllezo growth system modules" className={s.modules}>
          {divisions.map((d) => (
            <button
              key={d.id}
              role="tab"
              id={`eco-tab-${d.id}`}
              aria-selected={d.id === active}
              aria-controls="eco-panel"
              className={s.module}
              style={{ left: `${pos[d.id].x}%`, top: `${pos[d.id].y}%` }}
              onClick={() => pick(d.id)}
              onMouseEnter={() => touched && setActive(d.id)}
            >
              <span className={s.mIndex}>{d.index}</span>
              <span className={s.mName}>{d.shortName}</span>
              <span className={s.mVerb}>{verbs[d.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="eco-panel" role="tabpanel" aria-labelledby={`eco-tab-${active}`} className={s.panel} key={active}>
        <div className={s.panelHead}>
          <span className={s.pIndex}>
            {div.index} / {div.name}
          </span>
          <p className={s.pLine}>{div.positioning}</p>
        </div>
        <ServiceDemo kind={demoFor[active]} className={s.demo} />
        <div className={s.chips}>
          {servicesIn(active).map((sv) => (
            <Link key={sv.slug} href={`/business/services/${sv.slug}`} className={s.chip}>
              {sv.name} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
