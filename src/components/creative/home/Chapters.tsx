"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { orbs, studioFrames, websites, calling, texting, type Media } from "@/content/creativeMedia";

gsap.registerPlugin(ScrollTrigger);

type Chapter = {
  n: string;
  title: [string, string];
  line: string;
  body: string;
  orb: Media;
  media: Media[];
  kind: "frames" | "site" | "screens" | "chat";
  services: { name: string; href: string }[];
  href: string;
};

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    title: ["Content", "Engine"],
    line: "Stories people stop for.",
    body: "Strategy, production and publishing as one monthly system — cinematic enough to stop the scroll, planned enough to bring the right people to you.",
    orb: orbs.content,
    media: [studioFrames[0], studioFrames[3]],
    kind: "frames",
    services: [
      { name: "Content Growth System", href: "/creative/services/content-growth" },
      { name: "Personal Brand System", href: "/creative/services/personal-brand" },
      { name: "Premium Video Production", href: "/creative/services/video-production" },
      { name: "UGC & Ad Creatives", href: "/creative/services/ugc-ad-creatives" },
    ],
    href: "/creative/services/content-growth",
  },
  {
    n: "02",
    title: ["Website", "Experiences"],
    line: "Rooms people want to stay in.",
    body: "Flagship websites, stores and landing pages designed around one job: turning the attention your content earns into enquiries.",
    orb: orbs.websites,
    media: [websites[0], websites[3]],
    kind: "site",
    services: [
      { name: "Business Website", href: "/creative/services/business-website" },
      { name: "E-commerce Experience", href: "/creative/services/ecommerce" },
      { name: "Lead Generation Website", href: "/creative/services/lead-generation" },
    ],
    href: "/creative/services/business-website",
  },
  {
    n: "03",
    title: ["AI Calling", "Agents"],
    line: "A voice that never sleeps.",
    body: "Voice agents that pick up every call, qualify the caller and put the appointment in your calendar — then hand over to your team.",
    orb: orbs.calling,
    media: [calling[0], calling[2]],
    kind: "screens",
    services: [
      { name: "Inbound AI Voice Agent", href: "/creative/services/ai-calling" },
      { name: "Outbound AI Voice Agent", href: "/creative/services/ai-calling" },
    ],
    href: "/creative/services/ai-calling",
  },
  {
    n: "04",
    title: ["AI Texting", "Agents"],
    line: "Every message, answered.",
    body: "Agents on WhatsApp, Instagram and your website that reply in seconds, qualify, follow up and book — at 2 a.m. as well as 2 p.m.",
    orb: orbs.texting,
    media: [texting[1], texting[2]],
    kind: "chat",
    services: [
      { name: "Customer Support Agent", href: "/creative/services/ai-texting" },
      { name: "Sales Agent", href: "/creative/services/ai-texting" },
      { name: "Lead Qualification & Follow-up", href: "/creative/services/ai-texting" },
      { name: "Appointment Booking Agent", href: "/creative/services/ai-texting" },
    ],
    href: "/creative/services/ai-texting",
  },
];

type Msg = { from: "them" | "agent"; text: string };

// Illustrative conversations — what the agents do, not quotes from clients.
const WHATSAPP: Msg[] = [
  { from: "them", text: "Hi! Do you have a table for 4 this Saturday?" },
  { from: "agent", text: "Hi Aisha 👋 Yes — 8:00 or 9:30 pm?" },
  { from: "them", text: "8 works" },
  { from: "agent", text: "Booked for 4 at 8:00. Confirmation sent ✓" },
];
const INSTAGRAM: Msg[] = [
  { from: "them", text: "Is the gold edition still available?" },
  { from: "agent", text: "It is — want me to hold one for you?" },
  { from: "them", text: "Yes please 🙌" },
];

/** A real phone frame from the original site with the conversation played live inside it. */
function ChatPhone({ frame, script, depth, className }: { frame: Media; script: Msg[]; depth: number; className: string }) {
  return (
    <figure className={`cx-chatphone ${className}`} data-depth={depth}>
      <Image src={frame.src} alt="" width={frame.w} height={frame.h} sizes="20vw" unoptimized />
      <div className="cx-chat" style={{ ["--n" as string]: script.length }}>
        {script.map((m, i) => (
          <p key={i} className={`cx-bubble is-${m.from}`} style={{ ["--i" as string]: i }}>
            {m.text}
          </p>
        ))}
      </div>
    </figure>
  );
}

/** The four systems as one continuous horizontal journey, pinned while you scroll.
    Each panel's orb turns and its media drifts at its own depth. On small screens
    (and under reduced motion) the chapters simply stack. */
export default function Chapters() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current!;
    const track = el.querySelector<HTMLElement>(".cx-ch-track")!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (st) => setActive(Math.min(CHAPTERS.length - 1, Math.round(st.progress * (CHAPTERS.length - 1)))),
        },
      });
      el.querySelectorAll<HTMLElement>(".cx-ch").forEach((panel) => {
        const st = { containerAnimation: tween, trigger: panel, start: "left right", end: "right left", scrub: true };
        gsap.fromTo(panel.querySelector(".cx-ch-orb"), { rotate: -35, xPercent: 25 }, { rotate: 35, xPercent: -25, ease: "none", scrollTrigger: st });
        panel.querySelectorAll<HTMLElement>("[data-depth]").forEach((m) => {
          const d = Number(m.dataset.depth);
          gsap.fromTo(m, { xPercent: 18 * d }, { xPercent: -18 * d, ease: "none", scrollTrigger: st });
        });
        const site = panel.querySelector<HTMLElement>(".cx-site-scroll");
        if (site) gsap.fromTo(site, { yPercent: 0 }, { yPercent: -62, ease: "none", scrollTrigger: st });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="cx-chapters" aria-label="The four systems">
      <div className="cx-ch-track">
        {CHAPTERS.map((c, i) => (
          <article key={c.n} className="cx-ch" data-kind={c.kind}>
            <div className="cx-ch-copy">
              <p className="cx-kicker">
                <span className="cx-gold">{c.n}</span> / 04 — System
              </p>
              <h3 className="cx-ch-title">
                {c.title[0]}
                <br />
                <em>{c.title[1]}</em>
              </h3>
              <p className="cx-ch-line">{c.line}</p>
              <p className="cx-ch-body">{c.body}</p>
              <ul className="cx-ch-services">
                {c.services.map((s) => (
                  <li key={s.name}>
                    <Link href={s.href}>{s.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href={c.href} className="cx-arrow-link" data-cursor="Explore">
                Explore the system <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="cx-ch-stage" aria-hidden="true">
              <Image className="cx-ch-orb" src={c.orb.src} alt="" width={c.orb.w} height={c.orb.h} sizes="40vw" unoptimized loading={i === 0 ? "eager" : "lazy"} />
              {c.kind === "site" ? (
                <>
                  <div className="cx-browser" data-depth="1">
                    <div className="cx-browser-bar">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="cx-browser-view">
                      <Image className="cx-site-scroll" src={c.media[0].src} alt="" width={c.media[0].w} height={c.media[0].h} sizes="34vw" unoptimized />
                    </div>
                  </div>
                  <div className="cx-phone" data-depth="2">
                    <Image src={c.media[1].src} alt="" width={c.media[1].w} height={c.media[1].h} sizes="14vw" unoptimized />
                  </div>
                </>
              ) : c.kind === "chat" ? (
                <>
                  <ChatPhone className="cx-chat-a" frame={c.media[0]} depth={1} script={WHATSAPP} />
                  <ChatPhone className="cx-chat-b" frame={c.media[1]} depth={2.2} script={INSTAGRAM} />
                </>
              ) : c.kind === "frames" ? (
                <>
                  <figure className="cx-frame cx-frame-a" data-depth="1">
                    <Image src={c.media[0].src} alt="" width={c.media[0].w} height={c.media[0].h} sizes="38vw" unoptimized />
                  </figure>
                  <figure className="cx-frame cx-frame-b" data-depth="2.2">
                    <Image src={c.media[1].src} alt="" width={c.media[1].w} height={c.media[1].h} sizes="24vw" unoptimized />
                  </figure>
                </>
              ) : (
                <>
                  <figure className="cx-screen cx-screen-a" data-depth="1">
                    <Image src={c.media[0].src} alt="" width={c.media[0].w} height={c.media[0].h} sizes="22vw" unoptimized />
                  </figure>
                  <figure className="cx-screen cx-screen-b" data-depth="2.2">
                    <Image src={c.media[1].src} alt="" width={c.media[1].w} height={c.media[1].h} sizes="18vw" unoptimized />
                  </figure>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="cx-ch-progress" aria-hidden="true">
        {CHAPTERS.map((c, i) => (
          <span key={c.n} data-on={i === active ? "" : undefined}>
            {c.n} <b>{c.title.join(" ")}</b>
          </span>
        ))}
      </div>
    </section>
  );
}
