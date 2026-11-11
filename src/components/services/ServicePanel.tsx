"use client";

import { useState } from "react";
import type { Service } from "@/content/services";
import TickList from "./TickList";
import StoryCycler from "./StoryCycler";
import StepJourney from "./StepJourney";
import { motion } from "@/content/motion";
import VariantTabs from "./VariantTabs";
import s from "./services.module.css";

/* One service on the index page, in slices: pick Problems, Outcomes, Deliverables
   or Workflow and read just that. Everything that used to be listed at once is
   still here — one tab at a time. */
export default function ServicePanel({ sv }: { sv: Service }) {
  const tabs = [
    { id: "problems", label: "Problems solved", n: sv.problems.length },
    { id: "outcomes", label: "Outcomes", n: sv.outcomes.length },
    ...(sv.variants ? [{ id: "variants", label: "Options", n: sv.variants.length }] : []),
    { id: "deliverables", label: "Deliverables", n: sv.deliverables.length },
    { id: "workflow", label: "Workflow", n: sv.workflow.length },
  ];
  const [tab, setTab] = useState("problems");
  const mo = motion[sv.slug];

  return (
    <div className={s.panel}>
      <div className={s.panelTabs} role="tablist" aria-label={`${sv.name} details`}>
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label} <small>{t.n}</small>
          </button>
        ))}
      </div>
      <div key={tab} className={s.panelBody} role="tabpanel">
        {tab === "problems" && <StoryCycler beats={mo.problems} full={sv.problems} tone="bad" compact />}
        {tab === "outcomes" && <StoryCycler beats={mo.outcomes} full={sv.outcomes} tone="good" compact />}
        {tab === "variants" && sv.variants && <VariantTabs variants={sv.variants} />}
        {tab === "deliverables" && <TickList items={sv.deliverables} />}
        {tab === "workflow" && <StepJourney steps={sv.workflow} motion={mo.steps} tone="light" />}
      </div>
    </div>
  );
}
