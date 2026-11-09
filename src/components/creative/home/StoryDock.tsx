"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/* A small dock that rides along through the story so the way out is always
   one tap away — even for visitors who scroll past every scene. Its line
   changes with the act; it steps aside on the hero and at the finale. */

type Phase = "hidden" | "lost" | "won" | "after";

const COPY: Record<Exclude<Phase, "hidden">, { t: string; cta: string; skip?: string }> = {
  lost: { t: "Sound familiar?", cta: "Fix my day", skip: "Skip to the fix" },
  won: { t: "This could be your day.", cta: "Start a project" },
  after: { t: "Ready when you are.", cta: "Start a project" },
};

export default function StoryDock() {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    const vis = new Map<string, boolean>();
    const pick = () => {
      if (vis.get("live") || vis.get("finale")) return setPhase("hidden");
      if (vis.get("act-1")) return setPhase("lost");
      if (vis.get("rewind") || vis.get("act-2")) return setPhase("won");
      if (vis.get("after")) return setPhase("after");
      setPhase("hidden");
    };
    const targets: [string, string][] = [
      ["live", ".cx-live"],
      ["act-1", "#act-1"],
      ["rewind", ".cx-rewind"],
      ["act-2", "#act-2"],
      ["after", ".cx-compare, .cx-systems"],
      ["finale", ".cx-finale, .cx-footer"],
    ];
    const ios = targets.map(([key, sel]) => {
      const io = new IntersectionObserver(
        (entries) => {
          vis.set(key, entries.some((e) => e.isIntersecting) || [...document.querySelectorAll(sel)].some((el) => {
            const r = el.getBoundingClientRect();
            return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
          }));
          pick();
        },
        { rootMargin: "-40% 0px -40% 0px" },
      );
      document.querySelectorAll(sel).forEach((el) => io.observe(el));
      return io;
    });
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  const c = phase === "hidden" ? COPY.after : COPY[phase];

  return (
    <div className="cx-dock" data-on={phase !== "hidden" ? "" : undefined} data-phase={phase} role="complementary" aria-label="Start a project">
      <span className="cx-dock-dot" aria-hidden="true" />
      <p>{c.t}</p>
      {c.skip && (
        <a href="#act-2" className="cx-dock-skip">
          {c.skip} ↓
        </a>
      )}
      <Link href="/creative/contact" className="cx-dock-cta" onClick={() => track("dock_cta", { phase })}>
        {c.cta} →
      </Link>
    </div>
  );
}
