"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import "./original/universe.css";

const SERVICE_ROUTE: Record<string, string> = {
  content: "/creative/services/content-growth",
  websites: "/creative/services/business-website",
  calling: "/creative/services/ai-calling",
  texting: "/creative/services/ai-texting",
};

/** The original Kllezo Creative homepage (kllezo-v3 index.html): one WebGL
    universe the camera travels through, with the original overlay UI. */
export default function Universe() {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // A fresh canvas per mount, so a released WebGL context is never reused
    // (React StrictMode mounts twice in development; client navigation remounts).
    const canvas = document.createElement("canvas");
    canvas.id = "universe";
    host.current!.prepend(canvas);
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("./original/universe").then(({ mountUniverse }) => {
      if (cancelled) return;
      destroy = mountUniverse({
        service: (key: string) => SERVICE_ROUTE[key],
        go: (url: string) => router.push(url),
      });
    });
    Object.values(SERVICE_ROUTE).forEach((r) => router.prefetch(r));
    return () => {
      cancelled = true;
      destroy?.();
      canvas.remove();
    };
  }, [router]);

  return (
    <div className="kz-u" ref={host}>
      {/* Scroll driver — gives native scroll height for progress mapping */}
      <div id="scroll-driver" />

      {/* HTML Gallery Overlay for Content Engine */}
      <div id="content-gallery-overlay">
        <div className="gallery-row" id="gallery-row-top">
          <div className="gallery-row-inner" id="gallery-inner-top" />
        </div>
        <div className="gallery-row" id="gallery-row-middle">
          <div className="gallery-row-inner" id="gallery-inner-middle" />
        </div>
        <div className="gallery-row" id="gallery-row-bottom">
          <div className="gallery-row-inner" id="gallery-inner-bottom" />
        </div>
      </div>

      {/* Apple Vision Pro inspired Inspection Mode Overlay */}
      <div id="gallery-inspection-overlay">
        <div id="inspection-backdrop" />
        <div id="inspection-card-container" />
      </div>

      {/* Overlay text — fades in/out based on the camera journey */}
      <div id="overlay">
        <div className="zone-text" id="zt-hero">
          <Image src="/creative/assets/logo.webp" alt="KLLEZO" className="img-logo-hero" width={1536} height={1024} priority unoptimized />
          <div className="zt-sub">Scroll to enter the universe</div>
        </div>

        <div className="zone-text" id="zt-content">
          <div className="zt-num">01</div>
          <div className="zt-title">Content Engine</div>
          <div className="zt-body">
            Attention is earned
            <br />
            before it is converted.
          </div>
        </div>

        <div className="zone-text" id="zt-websites">
          <div className="zt-num">02</div>
          <div className="zt-title">Website Experiences</div>
          <div className="zt-body">
            Designed to turn
            <br />
            attention into action.
          </div>
        </div>

        <div className="zone-text" id="zt-calling">
          <div className="zt-num">03</div>
          <div className="zt-title">AI Calling Agents</div>
          <div className="zt-body">
            Voice agents that speak
            <br />
            and schedule like humans.
          </div>
        </div>

        <div className="zone-text" id="zt-texting">
          <div className="zt-num">04</div>
          <div className="zt-title">AI Texting Agents</div>
          <div className="zt-body">
            Conversations that
            <br />
            never stop working.
          </div>
        </div>

        <div className="zone-text" id="zt-ecosystem" />
      </div>

      {/* Progress bar */}
      <div id="progress-track">
        <div id="progress-fill" />
      </div>

      {/* Scroll instruction overlay */}
      <div id="scroll-instruction" className="scroll-instruction">
        Continue Scrolling
      </div>

      {/* Cursor */}
      <div id="cur-dot" />
      <div id="cur-ring" />

      {/* Nav (appears after hero) */}
      <nav id="nav">
        <Link href="/creative" className="nav-brand">
          KLLEZO
        </Link>
        <span className="nav-context" id="nav-context" />
        <div className="nav-actions">
          <ExperienceSwitch current="creative" className="nav-cta nav-switch">
            <span className="nav-switch-label">Business view</span>
            <span className="nav-switch-icon" aria-hidden="true">
              ⇄
            </span>
          </ExperienceSwitch>
          <Link href="/creative/services" className="nav-cta nav-cta-gold">
            Services
          </Link>
          <Link href="/creative/contact" className="nav-cta">
            Strategy Call
          </Link>
        </div>
      </nav>
    </div>
  );
}
