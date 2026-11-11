"use client";

import { useState } from "react";
import s from "./services.module.css";

type Variant = { name: string; points: string[] };

/* Service variants (e.g. Support / Sales / Booking agents) as tabs — one at a time. */
export default function VariantTabs({ variants }: { variants: Variant[] }) {
  const [i, setI] = useState(0);
  return (
    <div className={s.vtabs}>
      <div className={s.vtabList} role="tablist">
        {variants.map((v, k) => (
          <button key={v.name} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>
            {v.name}
          </button>
        ))}
      </div>
      <ul key={i} className={s.vtabPanel} role="tabpanel">
        {variants[i].points.map((p, k) => (
          <li key={p} style={{ ["--i" as string]: k }}>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
