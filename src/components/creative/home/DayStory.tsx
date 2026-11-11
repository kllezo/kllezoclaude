"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { websites } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";
import Sky from "@/components/creative/kit/Sky";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   The day, told twice. Scroll runs the clock from 06:00 to midnight.
   First ("lost"): one ordinary business without a system — each moment a
   customer slips away, the screen glitches and the counter climbs.
   Then ("won"): the same moments, the same times — each one caught by the
   Kllezo system that fixes it. Scenes are illustrative.
   ───────────────────────────────────────────────────────────────────────── */

export type Kind = "ignored" | "bounce" | "unread" | "missed" | "elsewhere" | "stopped" | "enquire" | "replied" | "answered" | "booked";
export type Moment = { m: number; kind: Kind; tag: string; t: string; s: string; href?: string };

const START = 6 * 60;
const END = 24 * 60;

/* Speed bumps: scroll doesn't map to time linearly. Around each moment
   (roughly ±15 minutes) the clock slows right down so the scene holds on
   screen, and it moves quickly through the quiet stretches between. */
const BUMP = 26; // how much slower time runs at a moment
const SPREAD = 10; // minutes; the bump fades out by about ±15
function timeMap(moments: Moment[]) {
  const n = END - START;
  const cum = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) {
    const m = START + i - 0.5;
    const near = moments.reduce((a, x) => Math.min(a, Math.abs(x.m + 6 - m)), Infinity);
    cum[i] = cum[i - 1] + 1 + BUMP * Math.exp(-((near / SPREAD) ** 2));
  }
  const total = cum[n];
  return {
    /** scroll progress (0–1) → minute of the day */
    toMin(p: number) {
      const target = Math.min(1, Math.max(0, p)) * total;
      let lo = 0;
      let hi = n;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < target) lo = mid;
        else hi = mid;
      }
      const f = (target - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
      return START + lo + Math.min(1, Math.max(0, f));
    },
    /** minute of the day → scroll progress */
    toP(m: number) {
      const i = Math.min(n, Math.max(0, Math.round(m - START)));
      return cum[i] / total;
    },
  };
}

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
  title,
  moments,
  counterLabel,
}: {
  id: string;
  mode: "lost" | "won";
  title: React.ReactNode;
  moments: Moment[];
  counterLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const trig = useRef<ScrollTrigger | null>(null);
  const [min, setMin] = useState(START);
  const map = useMemo(() => timeMap(moments), [moments]);

  // Jump to a moment from the timeline.
  const jump = (m: number) => {
    const st = trig.current;
    if (!st) return;
    const p = Math.min(0.999, map.toP(m + 6));
    const y = st.start + (st.end - st.start) * p;
    const lenis = (window as unknown as { __cxLenis?: { scrollTo(y: number, o?: object): void } }).__cxLenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const el = root.current!;
    let last = -1;
    let glitchT = 0;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      trig.current = ScrollTrigger.create({
        trigger: el,
        pin: el.querySelector(".cx-story-pin"),
        start: "top top",
        end: `+=${moments.length * 150 + 80}%`,
        scrub: 0.4,
        onUpdate: (st) => {
          const m = map.toMin(st.progress);
          setMin(m);
          el.style.setProperty("--p", ((m - START) / (END - START)).toFixed(4));
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
  }, [moments, mode, map]);

  const active = moments.filter((x) => x.m <= min).length - 1;
  const cur = active >= 0 ? moments[active] : null;
  const ended = min >= 23 * 60 + 20;

  return (
    <section ref={root} id={id} className="cx-story" data-mode={mode} aria-labelledby={`${id}-h`}>
      <div className="cx-story-pin">
        <Sky minute={min} className={mode === "lost" ? "is-muted" : ""} />
        <div className="cx-story-scrim" aria-hidden="true" />

        <div className="cx-wrap cx-story-grid">
          <div className="cx-story-left">
            <h2 id={`${id}-h`} className="sr-only">
              {title}
            </h2>
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
                  {mode === "lost" ? (
                    <a href="#act-2" className="cx-cap-cta">
                      See the same day, fixed ↓
                    </a>
                  ) : (
                    <Link href="/contact" className="cx-cap-cta is-gold">
                      Start a project →
                    </Link>
                  )}
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
            <div className="cx-art" data-state={active < 0 ? "now" : "past"}>
              <Phone>
                <div className="cx-a-open">
                  <p className="cx-a-open-t">06:00</p>
                  <p className="cx-a-open-d">Monday · your business</p>
                  <p className="cx-a-open-sign">OPEN</p>
                  <p className="cx-a-open-n">{mode === "lost" ? "Ready for customers. Ready for anything?" : "Ready for customers — and a system that never sleeps."}</p>
                </div>
              </Phone>
            </div>
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

/* Small pieces of real app chrome, so each screen reads as the app it is. */
const A = "/creative/assets";
const bg = (f: string, pos = "center", size = "cover") => ({ backgroundImage: `url(${A}/${f})`, backgroundPosition: pos, backgroundSize: size });
const Q = (q: number) => bg("content/1a-1d.webp", ["0% 0%", "100% 0%", "0% 100%", "100% 100%"][q], "200% 200%");

const Ico = {
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  chat: <path d="M20 12a8 8 0 1 1-3.2-6.4L20 4l-.8 3.6A8 8 0 0 1 20 12z" />,
  send: <path d="M21 4 3 11l7 2 2 7 9-16zM10 13l11-9" />,
  save: <path d="M6 3h12v18l-6-4-6 4z" />,
  dm: <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l.8-3.6A8 8 0 0 1 4 12zM8 13l3-3 2 2 3-3" />,
  back: <path d="M15 5l-7 7 7 7" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  video: <path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />,
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" />,
};
const Svg = ({ i, z = 22, fill }: { i: keyof typeof Ico; z?: number; fill?: string }) => (
  <svg width={z} height={z} viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Ico[i]}
  </svg>
);

type Post = { who: string; img: React.CSSProperties; likes: string; cap: string; yours?: boolean; plain?: string };
function IgPost({ p }: { p: Post }) {
  return (
    <div className={`cx-ig-post${p.yours ? " is-yours" : ""}`}>
      <div className="cx-ig-ph">
        <i className={p.yours ? "is-plain" : ""} />
        <b>{p.who}</b>
        <span>•••</span>
      </div>
      {p.plain ? (
        <div className="cx-ig-img cx-ig-plain">
          <span>{p.plain}</span>
        </div>
      ) : (
        <div className="cx-ig-img" style={p.img} />
      )}
      <div className="cx-ig-act">
        <Svg i="heart" fill={p.yours && !p.plain ? "#ff3040" : undefined} />
        <Svg i="chat" />
        <Svg i="send" />
        <span />
        <Svg i="save" />
      </div>
      <p className="cx-ig-likes">{p.likes} likes</p>
      <p className="cx-ig-cap">
        <b>{p.who}</b> {p.cap}
      </p>
    </div>
  );
}
function IgTop() {
  return (
    <div className="cx-ig-top">
      <b>Instagram</b>
      <span>
        <Svg i="heart" />
        <Svg i="dm" />
      </span>
    </div>
  );
}
const OTHERS: Post[] = [
  { who: "thevilla.goa", img: bg("content/5.webp", "38% 55%", "230%"), likes: "8,412", cap: "Golden hour, every evening 🌅" },
  { who: "studio.noir", img: Q(1), likes: "12.9K", cap: "New drop. Link in bio." },
  { who: "chef.arjun", img: bg("niche-2.webp", "50% 3%", "160%"), likes: "3,207", cap: "Tonight's tasting menu." },
  { who: "fit.with.meera", img: bg("niche-3.webp", "50% 2%", "150%"), likes: "21.4K", cap: "Day 41. No excuses." },
];

function Artifact({ kind }: { kind: Kind }) {
  switch (kind) {
    case "ignored": {
      const feed: Post[] = [
        OTHERS[0],
        OTHERS[1],
        OTHERS[2],
        { who: "your.business", img: {}, likes: "4", cap: "New offer this week! Visit us.", yours: true, plain: "NEW OFFER THIS WEEK!! Visit us today" },
        OTHERS[3],
        { who: "kllezo.wear", img: Q(3), likes: "6,021", cap: "Made to be noticed." },
        OTHERS[0],
        OTHERS[1],
      ];
      return (
        <Phone className="is-cold">
          <div className="cx-ig">
            <IgTop />
            <div className="cx-ig-feed cx-a-feed-fast">
              {feed.map((p, i) => (
                <IgPost key={i} p={p} />
              ))}
            </div>
          </div>
          <span className="cx-a-tag">Scrolled past</span>
        </Phone>
      );
    }
    case "stopped":
      return (
        <Phone>
          <div className="cx-ig">
            <IgTop />
            <div className="cx-ig-feed cx-ig-feed3 cx-a-feed-stop">
              <IgPost p={OTHERS[1]} />
              <IgPost p={OTHERS[3]} />
              <IgPost p={{ who: "your.business", img: Q(0), likes: "2,184", cap: "We don't build content. We build desire.", yours: true }} />
            </div>
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
            <span>google.com/search?q=best+restaurant+near+me</span>
          </div>
          <div className="cx-g">
            <div className="cx-g-head">
              <b className="cx-g-logo">
                <i>G</i>
                <i>o</i>
                <i>o</i>
                <i>g</i>
                <i>l</i>
                <i>e</i>
              </b>
              <span className="cx-g-q">
                best restaurant near me
                <Svg i="search" z={16} />
              </span>
            </div>
            <div className="cx-g-tabs">
              <b>All</b>
              <span>Maps</span>
              <span>Images</span>
              <span>Reviews</span>
              <span>News</span>
            </div>
            {[
              ["The Grand Table", "thegrandtable.in", "The Grand Table — Book a table tonight", "4.8", "1,240"],
              ["Saffron House", "saffronhouse.co", "Saffron House | Fine dining & private events", "4.6", "860"],
              ["Bistro 21", "bistro21.com", "Bistro 21 — Menu, reviews and reservations", "4.5", "512"],
            ].map(([n, u, h, r, c]) => (
              <div key={n} className="cx-g-r">
                <span className="cx-g-site">
                  <i>{n[0]}</i>
                  <span>
                    <b>{n}</b>
                    <small>https://{u}</small>
                  </span>
                </span>
                <p className="cx-g-t">{h}</p>
                <p className="cx-g-s">
                  <em>★★★★★</em> {r} ({c}) · Open now · Reserve online
                </p>
              </div>
            ))}
            <div className="cx-g-pg">
              <span className="cx-g-pgw">
                <b className="cx-g-c1">G</b>
                {Array.from({ length: 4 }, (_, i) => (
                  <b key={i} className={i === 3 ? "cx-g-c3" : "cx-g-c2"}>
                    o
                  </b>
                ))}
                <b className="cx-g-c1">gle</b>
              </span>
              <span className="cx-g-pgn">
                <b>1</b>
                <span>2</span>
                <span>3</span>
                <span className="is-you">4</span>
                <span>Next</span>
              </span>
              <small className="cx-g-you">your-business.com is here, on page 4</small>
            </div>
          </div>
          <svg className="cx-a-cursor cx-a-cursor-leave" width="20" height="24" viewBox="0 0 18 22">
            <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#070a09" strokeWidth="1.2" />
          </svg>
          <span className="cx-a-tag">Not found · 0 customers</span>
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
          <div className="cx-dm">
            <div className="cx-dm-top">
              <Svg i="back" z={20} />
              <b>your.business</b>
              <Svg i="video" z={20} />
            </div>
            <div className="cx-dm-tabs">
              <b>Primary</b>
              <span>General</span>
              <span>Requests (3)</span>
            </div>
            {[
              ["aisha.k", "Hi! Is this available this weekend? 🙏", "now", true, 0],
              ["rohan_m", "What are your prices?", "2h", true, 1],
              ["the.priya", "Do you deliver to Bandra?", "5h", true, 2],
              ["karan.s", "Thanks!", "1d", false, 3],
              ["meera.fit", "Sent a reel by fit.with.meera", "2d", false, 0],
            ].map(([n, m, tm, un, q]) => (
              <div key={n as string} className={`cx-dm-row${un ? " is-unread" : ""}`}>
                <i style={Q(q as number)} />
                <span>
                  <b>{n}</b>
                  <small>
                    {m} · {tm}
                  </small>
                </span>
                {un && <em />}
              </div>
            ))}
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
          <div className="cx-wa">
            <div className="cx-wa-top">
              <Svg i="back" z={18} />
              <i style={Q(2)} />
              <span>
                <b>Aisha</b>
                <small>online</small>
              </span>
              <Svg i="video" z={18} />
              <Svg i="phone" z={16} />
            </div>
            <div className="cx-a-chat cx-wa-body">
              <p className="cx-wa-day">Today</p>
              <p className="cx-a-bub is-them">
                Hi! Is this available this weekend? 🙏<small>14:45</small>
              </p>
              <p className="cx-a-typing">
                <i />
                <i />
                <i />
              </p>
              <p className="cx-a-bub is-us">
                Yes! Saturday 7 pm is free. Shall I book it for you?<small>14:45 ✓✓</small>
              </p>
              <p className="cx-a-bub is-them cx-a-late">
                Yes please!<small>14:46</small>
              </p>
              <p className="cx-a-bub is-us cx-a-later">
                Booked ✓ See you Saturday.<small>14:46 ✓✓</small>
              </p>
            </div>
            <div className="cx-wa-input">
              <span>Message</span>
              <i />
            </div>
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
            <p className="cx-a-call-vm">Rang out · they tried the next number</p>
          </div>
          <div className="cx-a-call-btns">
            <span className="is-dec">
              <Svg i="phone" z={24} fill="#fff" />
              <small>Decline</small>
            </span>
            <span className="is-acc">
              <Svg i="phone" z={24} fill="#fff" />
              <small>Accept</small>
            </span>
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
            <p className="cx-a-lock-d">Monday 14 November</p>
            <p className="cx-a-lock-t">22:30</p>
            <div className="cx-a-lock-n">
              <i className="cx-a-lock-app">
                <Svg i="chat" z={16} fill="#fff" />
              </i>
              <span>
                <b>
                  The Grand Table <small>now</small>
                </b>
                <span>Booking confirmed for Saturday, 7 pm. Thanks for choosing us!</span>
              </span>
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
