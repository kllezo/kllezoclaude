"use client";

import { useEffect } from "react";
import Link from "next/link";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { useSmoothScroll } from "./useSmoothScroll";
import "./original/services.css";

/** Page frame for Creative pages the original site did not have (contact, work, about):
    the original services header, ambient glow, cursor and type system — nothing new. */
export default function OriginalShell({ back = { href: "/creative/services", label: "Back To Services" }, children }: { back?: { href: string; label: string }; children: React.ReactNode }) {
  useSmoothScroll();
  useEffect(() => {
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("./original/services-runtime").then(({ mountServices }) => {
      if (!cancelled) destroy = mountServices();
    });
    return () => {
      cancelled = true;
      destroy?.();
      document.body.classList.remove("hov");
    };
  }, []);

  return (
    <div className="kz-s">
      <div id="cur-dot" />
      <div id="cur-ring" />
      <header>
        <Link href="/creative" className="brand">
          KLLEZO
        </Link>
        <div className="kz-head-actions">
          <Link href={back.href} className="back-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: "rotate(180deg)" }} aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{back.label}</span>
          </Link>
          <ExperienceSwitch current="creative" className="back-btn kz-switch">
            <span>Business view</span>
          </ExperienceSwitch>
        </div>
      </header>
      <div className="bg-glow-container">
        <div className="hero-glow" id="main-glow" />
      </div>
      <main id="explorer-root">{children}</main>
    </div>
  );
}
