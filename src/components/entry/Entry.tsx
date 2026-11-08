"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Logo from "@/components/shared/Logo";
import GoldFlow from "@/components/shared/GoldFlow";
import BusinessPreview from "./BusinessPreview";
import Timecode from "./Timecode";
import { markArrival, rememberExperience } from "@/components/shared/experienceState";
import { EXPERIENCE_COOKIE, type Experience } from "@/content/site";
import { track } from "@/lib/analytics";
import s from "./Entry.module.css";

export default function Entry() {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLAnchorElement>(null);
  const businessRef = useRef<HTMLAnchorElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState<Experience | null>(null);
  const [last, setLast] = useState<Experience | null>(null);

  useEffect(() => {
    const m = document.cookie.match(new RegExp(`${EXPERIENCE_COOKIE}=(creative|business)`));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie is only readable after hydration
    if (m) setLast(m[1] as Experience);
    router.prefetch("/creative");
    router.prefetch("/business");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-intro]", { y: 24, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, delay: 0.1 });
      gsap.from(`.${s.panel}`, { y: 60, opacity: 0, duration: 1.3, ease: "power4.out", stagger: 0.12, delay: 0.35 });
    }, root);
    return () => ctx.revert();
  }, [router]);

  function enter(exp: Experience, e: React.MouseEvent) {
    // Allow new-tab / modified clicks to behave like normal links.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (leaving) return;
    setLeaving(exp);
    rememberExperience(exp);
    track("experience_selected", { choice: exp });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = () => {
      markArrival(exp);
      router.push(`/${exp}`);
    };
    if (reduce) return go();

    const chosen = (exp === "creative" ? creativeRef : businessRef).current!;
    const other = (exp === "creative" ? businessRef : creativeRef).current!;
    const rect = chosen.getBoundingClientRect();
    const c = cover.current!;
    const lg = logo.current!;
    const lgRect = lg.getBoundingClientRect();
    const gutter = Math.min(56, Math.max(16, window.innerWidth * 0.04));
    const mobile = window.innerWidth < 760;

    gsap.set(c, {
      display: "block",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius: mobile ? 18 : 24,
      opacity: 0,
    });
    c.dataset.exp = exp;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: go });
    tl.to("[data-intro]", { y: -20, opacity: 0, duration: 0.5, stagger: 0.04, ease: "power2.in" }, 0)
      .to(other, { opacity: 0, scale: 0.94, x: exp === "creative" ? 60 : -60, y: mobile ? (exp === "creative" ? 40 : -40) : 0, duration: 0.7 }, 0)
      .to(chosen.querySelectorAll("[data-panel-copy]"), { opacity: 0, y: -16, duration: 0.4, ease: "power2.in" }, 0.05)
      .to(chosen, { scale: 1.015, duration: 0.5 }, 0)
      .to(c, { opacity: 1, duration: 0.25, ease: "none" }, 0.35)
      .to(c, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0, duration: 0.95 }, 0.45)
      .to(
        lg,
        {
          x: gutter - lgRect.left,
          y: (mobile ? 32 : 36) - (lgRect.top + lgRect.height / 2),
          color: exp === "creative" ? "#FBF5E9" : "#09453E",
          duration: 1.0,
        },
        0.45,
      )
      .to(c.querySelector("[data-cover-line]"), { scaleX: 1, duration: 0.8, ease: "power4.inOut" }, 0.7)
      .to(c.querySelectorAll("[data-cover-cell]"), { opacity: 1, duration: 0.3, stagger: { each: 0.012, from: "start" } }, 0.7);
  }

  return (
    <main ref={root} id="main" className={`entry ${s.entry}`} data-leaving={leaving ?? undefined}>
      <div ref={logo} className={s.logo}>
        <Logo size={34} tone="beige" />
      </div>

      <div className={s.intro}>
        <p className={s.eyebrow} data-intro>
          AI-powered growth &amp; automation
        </p>
        <h1 className={s.h1} data-intro>
          Two ways to experience <em>growth.</em>
        </h1>
        <p className={s.lede} data-intro>
          Different approaches. One purpose. Building better businesses.
        </p>
      </div>

      <div className={s.panels}>
        <a
          ref={creativeRef}
          href="/creative"
          className={`${s.panel} ${s.creative}`}
          onClick={(e) => enter("creative", e)}
          aria-label="Enter the Creative experience — for brands that want to capture attention and create desire"
        >
          <div className={s.visual} aria-hidden="true">
            <GoldFlow ribbons={8} />
            <span className={s.letterTop} />
            <span className={s.letterBottom} />
            <span className={s.bigWord}>desire</span>
            <span className={s.rec}>
              <i /> REC <Timecode />
            </span>
          </div>
          <div className={s.copy} data-panel-copy>
            <span className={s.option}>
              Option 01 {last === "creative" && <b className={s.lastChip}>Last visited</b>}
            </span>
            <h2 className={s.h2}>
              The <em>Creative</em> World
            </h2>
            <p className={s.desc}>For brands that want to capture attention and create desire.</p>
            <span className={s.cta}>
              Enter creative experience <Arrow />
            </span>
          </div>
        </a>

        <a
          ref={businessRef}
          href="/business"
          className={`${s.panel} ${s.business}`}
          onClick={(e) => enter("business", e)}
          aria-label="Enter the Business experience — for businesses that want to build systems, automate operations and scale"
        >
          <div className={s.visual} aria-hidden="true">
            <BusinessPreview />
          </div>
          <div className={s.copy} data-panel-copy>
            <span className={s.option}>
              Option 02 {last === "business" && <b className={s.lastChip}>Last visited</b>}
            </span>
            <h2 className={s.h2}>
              The Business <span className={s.green}>World</span>
            </h2>
            <p className={s.desc}>For businesses that want to build systems, automate operations and scale.</p>
            <span className={s.cta}>
              Enter business experience <Arrow />
            </span>
          </div>
        </a>
      </div>

      <p className={s.foot} data-intro>
        Content that attracts. Websites that convert. AI that closes.
      </p>

      <div ref={cover} className={s.cover} aria-hidden="true">
        <span className={s.coverLine} data-cover-line />
        <span className={s.coverGrid}>
          {Array.from({ length: 48 }, (_, i) => (
            <i key={i} data-cover-cell />
          ))}
        </span>
      </div>
    </main>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h12M10 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
