"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import Vignette from "./Vignette";
import type { Step as MotionStep } from "@/content/motion";
import { IconBolt, IconBrowser, IconCalendar, IconChart, IconLayers, IconMegaphone, IconRocket, IconSearch } from "@/components/business/icons";
import s from "./StepJourney.module.css";

type Step = { title: string; detail: string };

/* How it works, as a journey: one icon per step on a line, a glowing dot
   travels along it, and the step it reaches plays its own animation
   (brainstorming, writing hooks, filming, launching…) beside one line of
   detail. Click any step; hover pauses. */

const ICONS: [RegExp, (p: { size?: number }) => React.ReactElement][] = [
  [/research|discovery|review|monitor|^map/i, IconSearch],
  [/calendar/i, IconCalendar],
  [/design|build|page|experience/i, IconBrowser],
  [/produc|record|script|post|publish/i, IconMegaphone],
  [/connect|integrat|train|account|qualify/i, IconBolt],
  [/launch|deliver/i, IconRocket],
  [/optimi|iterate|test/i, IconChart],
];
const iconFor = (t: string) => ICONS.find(([re]) => re.test(t))?.[1] ?? IconLayers;

const MS = 4200;

export default function StepJourney({ steps, motion, tone = "dark" }: { steps: Step[]; motion?: MotionStep[]; tone?: "dark" | "light" }) {
  const { ref, seen, reduce } = useInView<HTMLDivElement>(0.3);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!seen || reduce || paused) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % steps.length), MS);
    return () => clearTimeout(t);
  }, [seen, reduce, paused, i, steps.length]);

  const m = motion?.[i];
  const [v, alt] = Array.isArray(m) ? m : [m, undefined];

  const n = steps.length;
  return (
    <div
      ref={ref}
      className={`${s.root} ${tone === "light" ? s.light : ""}`}
      style={{ ["--n" as string]: n, ["--i" as string]: i }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className={s.line} role="tablist" aria-label="Steps">
        <i className={s.rail} aria-hidden="true">
          <i className={s.fill} />
          <i className={s.spark} />
        </i>
        {steps.map((st, k) => {
          const Icon = iconFor(st.title);
          return (
            <li key={st.title}>
              <button
                type="button"
                role="tab"
                aria-selected={k === i}
                data-done={k < i ? "" : undefined}
                className={s.node}
                onClick={() => setI(k)}
              >
                <span className={s.icon}>
                  <Icon size={24} />
                </span>
                <span className={s.label}>{st.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className={`${s.stage} ${v ? "" : s.noArt}`} role="tabpanel" aria-live="polite">
        {v && (
          <div className={s.art}>
            <Vignette key={seen ? i : "idle"} v={v} alt={alt} tone="good" className={seen ? "" : s.idle} />
          </div>
        )}
        <div key={i} className={s.text}>
          <span className={s.count}>
            Step {i + 1} of {steps.length}
          </span>
          <h3>{steps[i].title}</h3>
          <p>{steps[i].detail}</p>
        </div>
      </div>
    </div>
  );
}
