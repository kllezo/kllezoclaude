"use client";

import { useInView } from "./useInView";
import s from "./services.module.css";

/* A checklist that ticks itself off in order when it comes into view —
   deliverables being packed, outcomes being reached. */
export default function TickList({ items, variant = "deliv" }: { items: string[]; variant?: "deliv" | "outcome" }) {
  const { ref, seen } = useInView<HTMLUListElement>(0.2);
  return (
    <ul ref={ref} className={`${s.ticks} ${variant === "outcome" ? s.ticksOutcome : ""}`} data-on={seen ? "" : undefined}>
      {items.map((x, i) => (
        <li key={x} style={{ ["--i" as string]: i }}>
          <span className={s.tick} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </span>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
