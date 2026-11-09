import Link from "next/link";
import Image from "next/image";
import { calling, studioFrames, websites } from "@/content/creativeMedia";
import s from "./ServiceBento.module.css";

/* The solution, sold one service at a time. Each card answers one of the
   problems from the story above and can be hired on its own. */

const CARDS = [
  {
    id: "content",
    problem: "Posts nobody stops for",
    name: "Content",
    line: "Strategy, shoots and publishing that bring the right people to you.",
    links: [
      { t: "Content Growth System", h: "/services/content-growth" },
      { t: "Personal Brand System", h: "/services/personal-brand" },
      { t: "Premium Video Production", h: "/services/video-production" },
      { t: "UGC & Ad Creatives", h: "/services/ugc-ad-creatives" },
    ],
    cta: { t: "Start with content", h: "/contact?service=content-growth" },
    media: studioFrames[0],
    span: "wide",
  },
  {
    id: "websites",
    problem: "Visitors who leave in seconds",
    name: "Websites",
    line: "Sites, stores and landing pages built to turn visits into enquiries.",
    links: [
      { t: "Business Website", h: "/services/business-website" },
      { t: "E-commerce Experience", h: "/services/ecommerce" },
      { t: "Lead Generation Website", h: "/services/lead-generation" },
    ],
    cta: { t: "Start with a website", h: "/contact?service=business-website" },
    media: websites[0],
    span: "tall",
  },
  {
    id: "texting",
    problem: "Messages that wait hours",
    name: "AI Texting Agents",
    line: "WhatsApp, Instagram and website chat answered in seconds — and booked.",
    links: [
      { t: "Customer Support Agent", h: "/services/ai-texting" },
      { t: "Sales & Follow-up Agent", h: "/services/ai-texting" },
      { t: "Appointment Booking Agent", h: "/services/ai-texting" },
    ],
    cta: { t: "Start with texting", h: "/contact?service=ai-texting" },
    media: null,
    span: "tall",
  },
  {
    id: "calling",
    problem: "Calls that ring out",
    name: "AI Calling Agents",
    line: "Voice agents that pick up, qualify and book — day and night.",
    links: [
      { t: "Inbound AI Voice Agent", h: "/services/ai-calling" },
      { t: "Outbound AI Voice Agent", h: "/services/ai-calling" },
    ],
    cta: { t: "Start with calling", h: "/contact?service=ai-calling" },
    media: calling[0],
    span: "wide",
  },
] as const;

export default function ServiceBento() {
  return (
    <div className={s.grid}>
      {CARDS.map((c, i) => (
        <article key={c.id} className={`${s.card} ${s[c.span]}`} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
          <div className={s.media} aria-hidden="true">
            {c.media ? (
              <Image src={c.media.src} alt="" width={c.media.w} height={c.media.h} sizes="(max-width: 900px) 92vw, 50vw" unoptimized />
            ) : (
              <div className={s.chat}>
                <p className={s.them}>Hi! Can I book for Saturday?</p>
                <p className={s.us}>Yes — 7 pm or 8:30 pm?</p>
                <p className={s.them}>7 please 🙌</p>
                <p className={s.us}>Booked ✓ See you Saturday.</p>
              </div>
            )}
          </div>
          <div className={s.body}>
            <p className={s.problem}>
              <span>Problem</span> {c.problem}
            </p>
            <h3 className={s.name}>{c.name}</h3>
            <p className={s.line}>{c.line}</p>
            <ul className={s.links}>
              {c.links.map((l) => (
                <li key={l.t}>
                  <Link href={l.h}>{l.t}</Link>
                </li>
              ))}
            </ul>
            <Link href={c.cta.h} className={s.cta}>
              {c.cta.t} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
