"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import { IconBolt, IconBrowser, IconCalendar, IconChart, IconLayers, IconMegaphone, IconRocket, IconSearch } from "@/components/business/icons";
import s from "./StepJourney.module.css";

type Step = { title: string; detail: string };

/* How it works, as a journey: one icon per step on a line, a glowing dot
   travels along it, and only the step it reaches gets one line of detail.
   Click any step; hover pauses. */

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

export default function StepJourney({ steps }: { steps: Step[] }) {
  const { ref, seen, reduce } = useInView<HTMLDivElement>(0.35);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!seen || reduce || paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [seen, reduce, paused, steps.length]);

  const n = steps.length;
  return (
    <div
      ref={ref}
      className={s.root}
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
      <p key={i} className={s.detail} role="tabpanel" aria-live="polite">
        <b>{String(i + 1).padStart(2, "0")}</b> {steps[i].detail}
      </p>
    </div>
  );
}
