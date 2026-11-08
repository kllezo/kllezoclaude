"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldFlow from "@/components/shared/GoldFlow";
import ServiceDemo from "@/components/shared/ServiceDemo";
import Timecode from "@/components/entry/Timecode";
import Still, { type Mood } from "./Still";
import { divisions, services, servicesIn } from "@/content/services";
import s from "./Scenes.module.css";

gsap.registerPlugin(ScrollTrigger);

const motionOK = "(prefers-reduced-motion: no-preference)";

/* ---------------- Hero ---------------- */
export function CreativeHero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      gsap.from(`.${s.line} > span`, { yPercent: 110, duration: 1.5, ease: "power4.out", stagger: 0.12, delay: 0.25 });
      gsap.from(`.${s.heroFoot} > *`, { opacity: 0, y: 20, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.9 });
      gsap.to(`.${s.heroCanvas}`, { scale: 1.15, opacity: 0.4, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(`.${s.heroTitle}`, { yPercent: -30, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    }, ref);
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={s.hero}>
      <div className={s.heroCanvas}>
        <GoldFlow ribbons={9} intensity={1.9} focus={0.7} />
      </div>
      <span className={s.bar} data-pos="top" aria-hidden="true" />
      <span className={s.bar} data-pos="bottom" aria-hidden="true" />
      <div className={s.heroHud} aria-hidden="true">
        <span>
          <i className={s.rec} /> Kllezo — Creative
        </span>
        <Timecode />
      </div>
      <h1 className={s.heroTitle}>
        <span className={s.line}>
          <span>
            Content that <em>attracts.</em>
          </span>
        </span>
        <span className={s.line}>
          <span>
            Websites that <em>convert.</em>
          </span>
        </span>
        <span className={s.line}>
          <span>
            AI that <em>closes.</em>
          </span>
        </span>
      </h1>
      <div className={s.heroFoot}>
        <p>For brands that want to capture attention and create desire.</p>
        <span className={s.scroll} aria-hidden="true">
          Scroll <i />
        </span>
      </div>
    </section>
  );
}

/* ---------------- Manifesto: words light up as you scroll ---------------- */
export function Manifesto({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      gsap.fromTo(
        ref.current!.querySelectorAll("span"),
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <p ref={ref} className={s.manifesto}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-hi={highlight.some((h) => w.toLowerCase().includes(h)) || undefined}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/* ---------------- Act I · Content: pinned horizontal film strip ---------------- */
const contentMoods: Mood[] = ["dusk", "velvet", "gold", "ember"];

export function FilmStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const list = servicesIn("content");

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`${motionOK} and (min-width: 900px)`, () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className={s.strip} id="content">
      <div ref={track} className={s.track}>
        <div className={s.stripIntro}>
          <span className={s.act}>Act I</span>
          <h2 className={s.actTitle}>
            Content<em>.</em>
          </h2>
          <p className={s.actLine}>{divisions[0].creativeLine}</p>
          <p className={s.actBody}>{divisions[0].positioning}</p>
        </div>
        {list.map((sv, i) => (
          <Link key={sv.slug} href={`/creative/services/${sv.slug}`} className={s.frame}>
            <Still mood={contentMoods[i]} ratio="4 / 5" caption={`Frame ${String(i + 1).padStart(2, "0")}`} live={i === 0} />
            <div className={s.frameMeta}>
              <span>{sv.code}</span>
              <h3>{sv.name}</h3>
              <p>{sv.tagline}</p>
            </div>
          </Link>
        ))}
        <div className={s.stripEnd}>
          <Link href="/creative/services#content" className={s.endLink}>
            Explore content <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Act II · Websites: floating 3D browsers ---------------- */
export function FloatingBrowsers() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      const items = root.current!.querySelectorAll<HTMLElement>(`.${s.float}`);
      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotateX: 24, rotateY: i === 1 ? 0 : i === 0 ? 28 : -28, y: 160, opacity: 0.2 },
          {
            rotateX: 6,
            rotateY: i === 1 ? 0 : i === 0 ? 12 : -12,
            y: (i - 1) * -40,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 45%", scrub: 0.8 },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  const list = servicesIn("websites");
  const kinds = ["browser", "store", "funnel"] as const;

  return (
    <section ref={root} className={s.browsers} id="websites">
      <div className={s.actHead}>
        <span className={s.act}>Act II</span>
        <h2 className={s.actTitle}>
          Websites<em>.</em>
        </h2>
        <p className={s.actLine}>{divisions[1].creativeLine}</p>
      </div>
      <div className={s.stage3d}>
        {list.map((sv, i) => (
          <Link key={sv.slug} href={`/creative/services/${sv.slug}`} className={s.float} data-i={i}>
            <ServiceDemo kind={kinds[i]} tone="dark" />
            <span className={s.floatLabel}>
              <b>{sv.name}</b> — {sv.tagline}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Act III · AI: voice + conversation ---------------- */
export function VoiceScene() {
  const [speaking, setSpeaking] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSpeaking((v) => !v), 2400);
    return () => window.clearInterval(id);
  }, []);
  const list = servicesIn("ai");

  return (
    <section className={s.voice} id="ai">
      <div className={s.voiceGlow} aria-hidden="true" />
      <div className={s.voiceGrid}>
        <div>
          <span className={s.act}>Act III</span>
          <h2 className={s.actTitle}>
            AI<em>.</em>
          </h2>
          <p className={s.actLine}>{divisions[2].creativeLine}</p>
          <p className={s.actBody}>{divisions[2].positioning} Every message answered, every call picked up — at 3 a.m. as gracefully as at noon.</p>
          <div className={s.voiceLinks}>
            {list.map((sv) => (
              <Link key={sv.slug} href={`/creative/services/${sv.slug}`}>
                <span>{sv.code}</span> {sv.name} <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </div>
        <div className={s.orbWrap} aria-hidden="true">
          <div className={s.orb} data-speaking={speaking || undefined}>
            {Array.from({ length: 48 }, (_, i) => (
              <i key={i} style={{ ["--a" as string]: `${(i / 48) * 360}deg`, ["--h" as string]: `${30 + ((i * 53) % 60)}%` }} />
            ))}
            <span>{speaking ? "Speaking" : "Listening"}</span>
          </div>
        </div>
        <div className={s.voiceDemos}>
          <ServiceDemo kind="chat" tone="dark" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- The index: every service, hover to reveal ---------------- */
const moods: Mood[] = ["dusk", "velvet", "gold", "ember", "noir", "tide", "noir", "tide", "velvet"];

export function ServiceIndex() {
  const [hover, setHover] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const p = preview.current!;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const xTo = gsap.quickTo(p, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(p, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={root} className={s.index} onPointerLeave={() => setHover(null)}>
      <ul>
        {services.map((sv, i) => (
          <li key={sv.slug}>
            <Link href={`/creative/services/${sv.slug}`} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} data-dim={(hover !== null && hover !== i) || undefined}>
              <span className={s.idxCode}>{sv.code}</span>
              <span className={s.idxName}>{sv.name}</span>
              <span className={s.idxTag}>{sv.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} className={s.preview} data-on={hover !== null || undefined} aria-hidden="true">
        {services.map((sv, i) => (
          <div key={sv.slug} className={s.previewItem} data-on={hover === i || undefined}>
            <Still mood={moods[i]} ratio="4 / 3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Simple scroll-in for editorial blocks ---------------- */
export function Rise({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      gsap.from(ref.current!.children, {
        y: 60,
        opacity: 0,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
