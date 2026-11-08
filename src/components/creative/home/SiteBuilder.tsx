"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { websites, studioFrames } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { k: "Structure", d: "Every page planned around one job: turning a visitor into an enquiry." },
  { k: "Story", d: "Words that say what you do, for whom, and why now — in the first five seconds." },
  { k: "Imagery", d: "Cinematic visuals from the content team, not stock." },
  { k: "Proof", d: "Work, results and reasons to believe, exactly where doubt appears." },
  { k: "Conversion", d: "One obvious next step, on every screen size." },
  { k: "Live", d: "Launched with tracking — and the first enquiry arrives." },
];

/* 02 · WEBSITES — a site that builds itself as you scroll, from wireframe to the
   first enquiry. The browser frame stays pinned while the layers arrive. */
export default function SiteBuilder() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    let last = -1;
    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (c) => {
        if (c.conditions?.reduce) {
          setStep(STEPS.length - 1);
          el.dataset.done = "";
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: {
            trigger: el,
            pin: el.querySelector(".cx-sb-pin"),
            start: "top top",
            end: "+=260%",
            scrub: 0.7,
            onUpdate: (st) => {
              const i = Math.min(STEPS.length - 1, Math.floor(st.progress * STEPS.length * 0.999));
              if (i !== last) {
                last = i;
                setStep(i);
                if (st.isActive) sfx.tick();
                if (i === STEPS.length - 1) sfx.chime();
              }
            },
          },
        });
        // 1 · structure: wireframe boxes draw in
        tl.fromTo(q(".cx-sb-wire"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "0 50%", stagger: 0.06 })
          // 2 · story
          .fromTo(q(".cx-sb-h span"), { yPercent: 110 }, { yPercent: 0, stagger: 0.12 })
          .fromTo(q(".cx-sb-p"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0 }, "<0.3")
          // 3 · imagery
          .fromTo(q(".cx-sb-hero-img"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.inOut" })
          // 4 · proof
          .fromTo(q(".cx-sb-card"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12 })
          // 5 · conversion: the cursor travels to the button and clicks
          .to(q(".cx-sb-btn"), { backgroundColor: "#c8a25a", color: "#070a09", duration: 0.5 })
          .fromTo(q(".cx-sb-cursor"), { x: 260, y: 220, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.1, ease: "power2.inOut" })
          .to(q(".cx-sb-btn"), { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1 })
          // 6 · live
          .fromTo(q(".cx-sb-toast"), { yPercent: -140, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "back.out(1.6)" })
          .fromTo(q(".cx-sb-lock"), { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .to({}, { duration: 0.6 });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="cx-toy cx-builder" aria-labelledby="builder-h">
      <div className="cx-sb-pin">
        <div className="cx-wrap cx-toy-grid">
          <div className="cx-toy-copy">
            <p className="cx-kicker">
              <span className="cx-gold">02</span> / 04 — Website Experiences
            </p>
            <h2 id="builder-h" className="cx-toy-title">
              Rooms people
              <br />
              want to <em>stay</em> in.
            </h2>
            <ol className="cx-sb-steps">
              {STEPS.map((s, i) => (
                <li key={s.k} data-on={i === step ? "" : undefined} data-past={i < step ? "" : undefined}>
                  <span>0{i + 1}</span>
                  <b>{s.k}</b>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
            <Link href="/creative/services/business-website" className="cx-arrow-link">
              Website Experiences <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="cx-sb-stage" aria-hidden="true">
            <div className="cx-sb-browser">
              <div className="cx-sb-bar">
                <i />
                <i />
                <i />
                <span className="cx-sb-url">
                  <em className="cx-sb-lock">●</em> yourbrand.com
                </span>
              </div>
              <div className="cx-sb-page">
                <div className="cx-sb-nav">
                  <b className="cx-sb-wire" />
                  <span className="cx-sb-wire" />
                  <span className="cx-sb-wire" />
                  <span className="cx-sb-wire" />
                </div>
                <div className="cx-sb-hero">
                  <div>
                    <p className="cx-sb-h">
                      <span>Extraordinary</span>
                      <span>stays, designed.</span>
                    </p>
                    <p className="cx-sb-p">Private villas on the coast. Book direct, best rate guaranteed.</p>
                    <span className="cx-sb-btn">
                      Book your stay
                      <svg className="cx-sb-cursor" width="18" height="22" viewBox="0 0 18 22">
                        <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#070a09" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </div>
                  <div className="cx-sb-hero-img">
                    <Image src={studioFrames[4].src} alt="" width={studioFrames[4].w} height={studioFrames[4].h} sizes="30vw" unoptimized />
                  </div>
                  <i className="cx-sb-wire cx-sb-wire-hero" />
                </div>
                <div className="cx-sb-cards">
                  {[websites[0], websites[1], websites[3]].map((m, i) => (
                    <div key={i} className="cx-sb-card">
                      <Image src={m.src} alt="" width={m.w} height={m.h} sizes="12vw" unoptimized />
                    </div>
                  ))}
                </div>
              </div>
              <div className="cx-sb-toast">
                <i>✓</i>
                <div>
                  <b>New enquiry</b>
                  <span>Villa · 2 nights · just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
