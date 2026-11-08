"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { k: "Attract", t: "Content earns the attention", d: "Planned, produced and published so the right people find you — and remember you." },
  { k: "Convert", t: "The website turns it into intent", d: "One clear path from interest to enquiry, on every page and every screen size." },
  { k: "Respond", t: "AI answers in seconds", d: "Calls and messages are picked up, qualified and booked — day or night, then handed to your team." },
  { k: "Grow", t: "The numbers tell us what's next", d: "We agree the measures up front and refine the whole system every month." },
];

/** One gold thread drawn through four stages as you read — the system, literally connected. */
export default function Method() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const path = el.querySelector<SVGPathElement>(".cx-thread path")!;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el.querySelector(".cx-method-list"), start: "top 70%", end: "bottom 60%", scrub: 0.8 } });
      el.querySelectorAll<HTMLElement>(".cx-method-list li").forEach((li) => {
        ScrollTrigger.create({ trigger: li, start: "top 62%", end: "bottom 38%", toggleClass: { targets: li, className: "is-on" } });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      path.style.strokeDashoffset = "0";
      el.querySelectorAll(".cx-method-list li").forEach((li) => li.classList.add("is-on"));
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="cx-method cx-wrap" aria-labelledby="cx-method-h">
      <div className="cx-method-head">
        <p className="cx-kicker">(04) The system</p>
        <h2 id="cx-method-h" className="cx-display-md" data-cx-fade>
          Four instruments.
          <br />
          <em>One performance.</em>
        </h2>
      </div>
      <div className="cx-method-body">
        <svg className="cx-thread" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 0 C 36 120, 4 240, 20 360 S 36 600, 20 720 S 4 900, 20 1000" />
        </svg>
        <ol className="cx-method-list">
          {STEPS.map((s, i) => (
            <li key={s.k}>
              <span className="cx-method-k">
                0{i + 1} — {s.k}
              </span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
