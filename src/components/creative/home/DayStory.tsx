"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioFrames, websites } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   The day, told twice. Scroll runs the clock from 06:00 to midnight.
   Act I ("lost"): one ordinary business without a system — each moment a
   customer slips away, the screen glitches and the counter climbs.
   Act II ("won"): the same moments, the same times — each one caught by the
   Kllezo system that fixes it. Scenes are illustrative.
   ───────────────────────────────────────────────────────────────────────── */

export type Kind = "ignored" | "bounce" | "unread" | "missed" | "elsewhere" | "stopped" | "enquire" | "replied" | "answered" | "booked";
export type Moment = { m: number; kind: Kind; tag: string; t: string; s: string; href?: string };

const START = 6 * 60;
const END = 24 * 60;

const fmt = (m: number) => {
  const mm = Math.min(m, 24 * 60 - 1);
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}${String(Math.floor(mm % 60)).padStart(2, "0")}`;
};

/** Rolling digits — each one a strip of 0–9 that slides to its value. */
function Roll({ value }: { value: string }) {
  return (
    <span className="cx-roll" aria-hidden="true">
      {value.split("").map((ch, i) => (
        <span key={i} className="cx-roll-d">
          <span style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
            {"0123456789".split("").map((d) => (
              <i key={d}>{d}</i>
            ))}
          </span>
          {i === 1 && <b className="cx-roll-colon">:</b>}
        </span>
      ))}
    </span>
  );
}

export default function DayStory({
  id,
  mode,
  act,
  title,
  moments,
  counterLabel,
  sky,
}: {
  id: string;
  mode: "lost" | "won";
  act: string;
  title: React.ReactNode;
  moments: Moment[];
  counterLabel: string;
  sky: string[];
}) {
  const root = useRef<HTMLElement>(null);
  const trig = useRef<ScrollTrigger | null>(null);
  const [min, setMin] = useState(START);

  // Jump to a moment from the timeline.
  const jump = (m: number) => {
    const st = trig.current;
    if (!st) return;
    const p = Math.min(0.999, (m - START) / (END - START) + 0.015);
    const y = st.start + (st.end - st.start) * p;
    const lenis = (window as unknown as { __cxLenis?: { scrollTo(y: number, o?: object): void } }).__cxLenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const el = root.current!;
    const paint = gsap.utils.interpolate(sky);
    let last = -1;
    let glitchT = 0;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      trig.current = ScrollTrigger.create({
        trigger: el,
        pin: el.querySelector(".cx-story-pin"),
        start: "top top",
        end: `+=${moments.length * 85 + 60}%`,
        scrub: 0.4,
        onUpdate: (st) => {
          const m = START + (END - START) * st.progress;
          setMin(m);
          el.style.setProperty("--sky", paint(st.progress));
          el.style.setProperty("--p", st.progress.toFixed(4));
          const idx = moments.filter((x) => x.m <= m).length - 1;
          if (idx !== last) {
            if (idx > last && idx >= 0 && st.isActive) {
              el.classList.remove("is-hit");
              void el.offsetWidth;
              el.classList.add("is-hit");
              window.clearTimeout(glitchT);
              glitchT = window.setTimeout(() => el.classList.remove("is-hit"), 520);
              if (mode === "lost") sfx.tick();
              else sfx.sent();
            }
            last = idx;
          }
        },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => setMin(END));
    return () => {
      window.clearTimeout(glitchT);
      mm.revert();
    };
  }, [moments, mode, sky]);

  const active = moments.filter((x) => x.m <= min).length - 1;
  const cur = active >= 0 ? moments[active] : null;
  const ended = min >= 23 * 60 + 20;
  const night = min >= 19 * 60;

  return (
    <section ref={root} id={id} className="cx-story" data-mode={mode} aria-labelledby={`${id}-h`}>
      <div className="cx-story-pin">
        <div className="cx-story-noise" aria-hidden="true" />
        <div className="cx-story-orb" data-night={night ? "" : undefined} aria-hidden="true" />

        <div className="cx-wrap cx-story-grid">
          <div className="cx-story-left">
            <p className="cx-kicker">
              <span className="cx-gold">{act}</span> — <span id={`${id}-h`}>{title}</span>
            </p>
            <div className="cx-story-clock">
              <Roll value={fmt(min)} />
            </div>
            <div className="cx-story-caption" aria-live="polite">
              {ended ? (
                <div key="end" className="cx-cap cx-cap-end">
                  <span className="cx-cap-tag">{mode === "lost" ? "End of day" : "End of day"}</span>
                  <p className="cx-cap-t">
                    {mode === "lost" ? (
                      <>
                        {moments.length} customers lost.
                        <br />
                        <em>You never saw one of them.</em>
                      </>
                    ) : (
                      <>
                        {moments.length} customers won.
                        <br />
                        <em>Nobody worked late.</em>
                      </>
                    )}
                  </p>
                </div>
              ) : cur ? (
                <div key={cur.m} className="cx-cap">
                  <span className="cx-cap-tag">{cur.tag}</span>
                  <p className="cx-cap-t">{cur.t}</p>
                  <p className="cx-cap-s">{cur.s}</p>
                  {cur.href && (
                    <Link href={cur.href} className="cx-cap-link">
                      How this system works <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="cx-cap">
                  <span className="cx-cap-tag">06:00</span>
                  <p className="cx-cap-t">{mode === "lost" ? "The day begins. The doors open." : "The same day. The same customers."}</p>
                  <p className="cx-cap-s">{mode === "lost" ? "Scroll to live through it." : "This time, with a system."}</p>
                </div>
              )}
            </div>
            <div className="cx-story-count">
              <b>{Math.max(0, active + 1)}</b>
              <span>{counterLabel}</span>
            </div>
          </div>

          <div className="cx-stage" aria-hidden="true">
            {moments.map((x, i) => (
              <div key={x.m} className="cx-art" data-state={i < active ? "past" : i === active ? "now" : "next"}>
                <Artifact kind={x.kind} />
                <span className="cx-stamp">{mode === "lost" ? "Lost" : "Won"}</span>
              </div>
            ))}
          </div>
        </div>

        <nav className="cx-wrap cx-tl" aria-label={`${title}: jump to a moment`}>
          <div className="cx-tl-line">
            <i className="cx-tl-fill" />
            {moments.map((x, i) => (
              <button
                key={x.m}
                type="button"
                className="cx-tl-tick"
                style={{ left: `${((x.m - START) / (END - START)) * 100}%` }}
                data-on={i <= active ? "" : undefined}
                data-now={i === active ? "" : undefined}
                onClick={() => jump(x.m)}
                aria-label={`${x.tag}: ${x.t}`}
              >
                <em>{`${fmt(x.m).slice(0, 2)}:${fmt(x.m).slice(2)}`}</em>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}

/* ── The scenes ───────────────────────────────────────────────────────── */

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`cx-dev-phone ${className}`}>
      <i className="cx-dev-notch" />
      {children}
    </div>
  );
}

function Artifact({ kind }: { kind: Kind }) {
  switch (kind) {
    case "ignored":
      return (
        <Phone className="is-cold">
          <div className="cx-a-feed cx-a-feed-fast">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`cx-a-post${i === 3 ? " is-yours" : ""}`}>
                <div className="cx-a-post-h">
                  <i />
                  {i === 3 ? <b>your.business</b> : <span />}
                </div>
                <div className="cx-a-post-m" />
                {i === 3 && <p className="cx-a-post-c">New offer this week! Visit us.</p>}
              </div>
            ))}
          </div>
          <span className="cx-a-tag">Scrolled past</span>
        </Phone>
      );
    case "stopped":
      return (
        <Phone>
          <div className="cx-a-feed cx-a-feed-stop">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`cx-a-post${i === 2 ? " is-kz" : ""}`}>
                <div className="cx-a-post-h">
                  <i />
                  {i === 2 ? <b>your.business</b> : <span />}
                </div>
                <div className="cx-a-post-m">{i === 2 && <Image src={studioFrames[0].src} alt="" width={studioFrames[0].w} height={studioFrames[0].h} sizes="280px" unoptimized />}</div>
                {i === 2 && <p className="cx-a-post-c">We don&apos;t build content. We build desire.</p>}
              </div>
            ))}
          </div>
          <span className="cx-a-heart">♥</span>
          <span className="cx-a-tag is-gold">Stopped · saved · shared</span>
        </Phone>
      );
    case "bounce":
      return (
        <div className="cx-dev-browser is-cold">
          <div className="cx-dev-bar">
            <i />
            <i />
            <i />
            <span>your-business.com</span>
          </div>
          <div className="cx-a-site-plain">
            <p className="cx-a-plain-h">Welcome to our website</p>
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} style={{ width: `${92 - ((i * 13) % 40)}%` }} />
            ))}
            <p className="cx-a-plain-link">Contact us</p>
          </div>
          <svg className="cx-a-cursor cx-a-cursor-leave" width="20" height="24" viewBox="0 0 18 22">
            <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#070a09" strokeWidth="1.2" />
          </svg>
          <span className="cx-a-tag">Left after 6 seconds</span>
        </div>
      );
    case "enquire":
      return (
        <div className="cx-dev-browser">
          <div className="cx-dev-bar">
            <i />
            <i />
            <i />
            <span>your-business.com</span>
          </div>
          <div className="cx-a-site-rich">
            <Image src={websites[0].src} alt="" width={websites[0].w} height={websites[0].h} sizes="560px" unoptimized />
            <span className="cx-a-cta">Book your stay</span>
          </div>
          <svg className="cx-a-cursor cx-a-cursor-click" width="20" height="24" viewBox="0 0 18 22">
            <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#070a09" strokeWidth="1.2" />
          </svg>
          <div className="cx-a-toast">
            <i>✓</i>
            <div>
              <b>New enquiry</b>
              <span>2 nights · just now</span>
            </div>
          </div>
        </div>
      );
    case "unread":
      return (
        <Phone className="is-cold">
          <div className="cx-a-chat">
            <p className="cx-a-chat-who">Instagram · Aisha</p>
            <p className="cx-a-bub is-them">Hi! Is this available this weekend? 🙏</p>
            <p className="cx-a-delivered">Delivered</p>
            <div className="cx-a-wait">
              <span>Unread · 12 min</span>
              <span>Unread · 1 hr</span>
              <span>Unread · 4 hrs</span>
              <span>Unread · tomorrow</span>
            </div>
          </div>
          <span className="cx-a-tag">Nobody saw it</span>
        </Phone>
      );
    case "replied":
      return (
        <Phone>
          <div className="cx-a-chat">
            <p className="cx-a-chat-who">WhatsApp · Aisha</p>
            <p className="cx-a-bub is-them">Hi! Is this available this weekend? 🙏</p>
            <p className="cx-a-typing">
              <i />
              <i />
              <i />
            </p>
            <p className="cx-a-bub is-us">Yes! Saturday 7 pm is free — shall I book it for you?</p>
            <p className="cx-a-bub is-them cx-a-late">Yes please!</p>
            <p className="cx-a-bub is-us cx-a-later">Booked ✓ See you Saturday.</p>
          </div>
          <span className="cx-a-tag is-gold">Replied in seconds</span>
        </Phone>
      );
    case "missed":
      return (
        <Phone className="is-cold">
          <div className="cx-a-call">
            <div className="cx-a-call-av">?</div>
            <p className="cx-a-call-n">+91 98•• ••4410</p>
            <p className="cx-a-call-st">
              <span>Ringing…</span>
              <span className="is-red">Missed call</span>
            </p>
            <p className="cx-a-call-vm">No voicemail left</p>
          </div>
          <span className="cx-a-tag">After hours</span>
        </Phone>
      );
    case "answered":
      return (
        <Phone>
          <div className="cx-a-call">
            <div className="cx-a-call-av is-gold">K</div>
            <p className="cx-a-call-n">Kllezo voice agent</p>
            <p className="cx-a-call-st">
              <span>Ringing…</span>
              <span className="is-gold">Answered · 00:01</span>
            </p>
            <div className="cx-a-wave">
              {Array.from({ length: 24 }, (_, i) => (
                <i key={i} style={{ animationDelay: `${(i % 7) * -0.13}s` }} />
              ))}
            </div>
            <p className="cx-a-call-booked">✓ Appointment booked · Thu 11:00</p>
          </div>
          <span className="cx-a-tag is-gold">Picked up on the first ring</span>
        </Phone>
      );
    case "elsewhere":
      return (
        <Phone className="is-cold">
          <div className="cx-a-lock">
            <p className="cx-a-lock-t">22:30</p>
            <div className="cx-a-lock-n">
              <b>Booking confirmed</b>
              <span>Thanks for choosing another business. See you Saturday!</span>
            </div>
          </div>
          <span className="cx-a-tag">Booked elsewhere</span>
        </Phone>
      );
    case "booked":
      return (
        <div className="cx-dev-cal">
          <p className="cx-a-cal-h">
            Tomorrow <span>· your calendar</span>
          </p>
          {["09:00", "10:30", "11:00", "13:00", "15:30", "17:00", "19:00"].map((t, i) => (
            <div key={t} className="cx-a-slot" style={{ animationDelay: `${0.25 + i * 0.16}s` }}>
              <span>{t}</span>
              <b>Booked</b>
            </div>
          ))}
        </div>
      );
  }
}
