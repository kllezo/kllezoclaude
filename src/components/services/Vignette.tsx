"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Alt, Vkind } from "@/content/motion";
import s from "./Vignette.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   Vignettes: one small animation per idea (a problem, an outcome, a step).
   Each is drawn on a fixed 320×220 canvas and scaled to fit its frame, so
   they look identical everywhere. Pure CSS animation, replayed whenever the
   vignette is remounted (the parent changes its key). Scenes are illustrative.
   ───────────────────────────────────────────────────────────────────────── */

export type Tone = "bad" | "good";

const W = 320;
const H = 220;

/** Animation delay (and any extra custom properties) as inline style. */
const d = (sec: number, more: Record<string, string | number> = {}): CSSProperties =>
  ({ "--d": `${sec}s`, ...more }) as CSSProperties;

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export default function Vignette({ v, tone, alt, className }: { v: Vkind; tone: Tone; alt?: Alt; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(Math.min(e.contentRect.width / W, 1.7)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={cx(s.frame, tone === "bad" ? s.bad : s.good, className)} style={{ height: H * k }} aria-hidden="true">
      <div className={s.v} style={{ transform: `scale(${k})` }}>
        <Body v={v} alt={alt} />
      </div>
    </div>
  );
}

/* ── tiny icon set (24px grid, currentColor) ───────────────────────────── */
const PATHS: Record<string, ReactNode> = {
  phone: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  bell: <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 21h4" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />,
  play: <path d="M8 5v14l11-7L8 5Z" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />,
  rocket: <path d="M12 15l-3-3c1-4 4-8 9-9-1 5-5 8-9 9M9 12l-4 1 2-4h3M12 15l-1 4 4-2v-3M6 18l-2 2" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" />,
  cart: <path d="M3 4h2l2.5 11h10L20 7H6.5M9 20h.01M17 20h.01" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  doc: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  chip: <path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2" />,
  eye: <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  box: <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9" />,
};
const I = ({ n, z = 16, className, style }: { n: string; z?: number; className?: string; style?: CSSProperties }) => (
  <svg width={z} height={z} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {PATHS[n]}
  </svg>
);

/* ── shared pieces ─────────────────────────────────────────────────────── */
const Chip = ({ children, at, kind = "a", className }: { children: ReactNode; at: number; kind?: "a" | "soft" | "plain"; className?: string }) => (
  <em className={cx(s.chip, kind === "a" ? s.chipA : kind === "soft" ? s.chipSoft : s.chipPlain, s.pop, className)} style={d(at)}>
    {children}
  </em>
);
const Browser = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx(s.browser, className)}>
    <div className={s.bbar}>
      <i />
      <i />
      <i />
    </div>
    <div className={s.bpage}>{children}</div>
  </div>
);
const Cursor = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg className={cx(s.cursor, className)} style={style} width="16" height="20" viewBox="0 0 18 22">
    <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#111" strokeWidth="1.3" />
  </svg>
);
const Bubble = ({ me, children, at, className }: { me?: boolean; children: ReactNode; at: number; className?: string }) => (
  <p className={cx(s.bub, me && s.bubMe, s.in, className)} style={d(at)}>
    {children}
  </p>
);
const Rows = ({ items, at = 0.2, step = 0.4, mark }: { items: [string, string][]; at?: number; step?: number; mark: (i: number) => ReactNode }) => (
  <div className={s.rows}>
    {items.map(([a, b], i) => (
      <div key={a} className={cx(s.row, s.in)} style={d(at + i * step)}>
        <span>
          <b>{a}</b>
          {b && <small>{b}</small>}
        </span>
        {mark(i)}
      </div>
    ))}
  </div>
);
const Grid = ({ n, cols, on, cls, at = 0.1, step = 0.06, label }: { n: number; cols: number; on: (i: number) => boolean; cls?: string; at?: number; step?: number; label?: (i: number) => string }) => (
  <div className={s.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {Array.from({ length: n }, (_, i) => (
      <span key={i} className={cx(on(i) && cx(s.cellOn, s.pop), on(i) && cls)} style={d(at + i * step)}>
        {on(i) && label ? label(i) : null}
      </span>
    ))}
  </div>
);
const Chart = ({ up, at = 0.3, dashed }: { up: boolean; at?: number; dashed?: boolean }) => (
  <svg className={s.chart} viewBox="0 0 200 70" preserveAspectRatio="none">
    <path className={s.chartBase} d="M0 69H200" />
    <path className={cx(s.draw, dashed && s.dash)} style={d(at)} pathLength={1} d={up ? "M0 64 C40 60 70 50 100 38 S160 14 200 6" : "M0 52 C40 54 80 50 120 53 S170 51 200 52"} />
  </svg>
);
const Foot = ({ children, at }: { children: ReactNode; at: number }) => (
  <p className={cx(s.foot, s.pop)} style={d(at)}>
    {children}
  </p>
);

/* ── the vignettes ─────────────────────────────────────────────────────── */
function Body({ v, alt }: { v: Vkind; alt?: Alt }) {
  const calls = alt === "calls";
  switch (v) {
    /* ───────── problems ───────── */
    case "unread":
      return (
        <div className={s.col}>
          <Rows
            items={[
              ["Aisha", "Is Saturday free?"],
              ["Rohan", "Price for 4?"],
              ["Meera", "Do you deliver?"],
              ["Imran", "Can I book today?"],
            ]}
            step={0.3}
            mark={(i) => <Chip kind="soft" at={0.6 + i * 0.3}>Unread · {["2h", "5h", "9h", "1d"][i]}</Chip>}
          />
          <Foot at={1.9}>0 of 4 answered</Foot>
        </div>
      );
    case "cold":
      return (
        <div className={s.col}>
          <div className={cx(s.card, s.person, s.in)} style={d(0)}>
            <i className={s.av}>P</i>
            <span>
              <b>Priya</b>
              <small>{calls ? "Asked for a call back · Mon" : "Enquired · Mon"}</small>
            </span>
          </div>
          <div className={s.thermo}>
            <i className={s.thermoFill} />
          </div>
          <div className={s.days}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x, i) => (
              <span key={x} className={s.in} style={d(0.3 + i * 0.3)}>
                {x}
                <small>{calls ? "no call" : "no reply"}</small>
              </span>
            ))}
          </div>
          <Foot at={2.3}>Gone cold · booked elsewhere</Foot>
        </div>
      );
    case "repeat":
      return (
        <div className={s.split}>
          <div className={s.stackQ}>
            {Array.from({ length: 5 }, (_, i) => (
              <p key={i} className={cx(s.bub, s.in)} style={d(i * 0.3, { "--o": i })}>
                What are your timings?
              </p>
            ))}
          </div>
          <div className={s.counter}>
            <b className={s.pop} style={d(1.6)}>
              ×47
            </b>
            <small className={s.in} style={d(1.8)}>
              same question today
            </small>
          </div>
        </div>
      );
    case "pingpong":
      return (
        <div className={s.chatCol}>
          <Bubble at={0}>Tuesday 4pm?</Bubble>
          <Bubble me at={0.45}>
            Sorry, full. Wednesday?
          </Bubble>
          <Bubble at={0.9}>Can&apos;t do Wed. Thursday?</Bubble>
          <Bubble me at={1.35}>
            Thursday morning only…
          </Bubble>
          <Foot at={1.9}>3 days in · still not booked</Foot>
        </div>
      );
    case "missed":
      return (
        <div className={s.col}>
          <div className={s.callTop}>
            <span className={s.ring}>
              <I n="phone" z={22} className={s.shake} />
              <i />
              <i />
            </span>
            <span className={s.night}>
              <I n="moon" z={14} /> After hours
            </span>
          </div>
          <Rows
            items={[
              ["22:41", "New caller"],
              ["23:05", "New caller"],
              ["07:12", "Customer"],
            ]}
            at={0.4}
            step={0.5}
            mark={(i) => <Chip kind="soft" at={0.7 + i * 0.5}>Missed</Chip>}
          />
        </div>
      );
    case "noShow":
      return (
        <div className={s.col}>
          <div className={cx(s.card, s.slot, s.in)} style={d(0)}>
            <small>Tue · 10:00</small>
            <b>Ravi — Consultation</b>
          </div>
          <div className={s.chair}>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 3h10v9H7zM5 12h14v3H5zM7 15v6M17 15v6" />
            </svg>
            <em className={cx(s.stamp, s.pop)} style={d(1)}>
              No-show
            </em>
          </div>
          <Foot at={1.7}>No reminder was sent</Foot>
        </div>
      );
    case "busy":
      return (
        <div className={s.col}>
          <div className={s.busyTop}>
            <svg className={s.clock} width="46" height="46" viewBox="0 0 46 46">
              <circle cx="23" cy="23" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <line className={s.spin} x1="23" y1="23" x2="23" y2="9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line className={s.spinSlow} x1="23" y1="23" x2="33" y2="23" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            {(calls ? ["On a call", "On a call", "On a call"] : ["In a meeting", "On site", "Busy"]).map((t, i) => (
              <div key={i} className={cx(s.mini, s.in)} style={d(0.2 + i * 0.3)}>
                <i className={s.av}>{["A", "S", "K"][i]}</i>
                <Chip kind="soft" at={0.5 + i * 0.3}>
                  {t}
                </Chip>
              </div>
            ))}
          </div>
          <div className={cx(s.card, s.skipped, s.in)} style={d(1.4)}>
            <span>{calls ? "Routine calls waiting" : "This week's post"}</span>
            <Chip at={1.8}>{calls ? "6 in queue" : "Skipped"}</Chip>
          </div>
        </div>
      );
    case "flatViews":
      return (
        <div className={s.split}>
          <div className={cx(s.post, s.in)} style={d(0)}>
            <span className={s.postImg} />
            <small>
              <I n="eye" z={12} /> 12 views
            </small>
            <small>
              <I n="heart" z={12} /> 1
            </small>
          </div>
          <div className={s.col}>
            <Chart up={false} at={0.4} />
            <Foot at={1.8}>Week 6 · still 12 views</Foot>
          </div>
        </div>
      );
    case "scatter":
      return (
        <div className={s.col}>
          <Grid n={21} cols={7} on={(i) => [2, 4, 9, 11, 17, 20].includes(i)} cls={s.cellRand} at={0.1} step={0.09} />
          <Foot at={2}>Posted at random · no plan</Foot>
        </div>
      );
    case "blind":
      return (
        <div className={s.col}>
          <div className={s.kpis}>
            {["Visits", "Leads", "Sales"].map((x, i) => (
              <div key={x} className={cx(s.card, s.kpi, s.in)} style={d(i * 0.2)}>
                <small>{x}</small>
                <b>—</b>
                <i className={cx(s.qm, s.bob)} style={d(0, { animationDelay: `${i * -0.4}s` })}>
                  ?
                </i>
              </div>
            ))}
          </div>
          <Chart up={false} dashed at={0.6} />
          <Foot at={1.8}>No tracking · just guesses</Foot>
        </div>
      );
    case "drain":
      return (
        <div className={s.split}>
          <div className={cx(s.adMini, s.in)} style={d(0)}>
            <span />
            <b>Ad #1</b>
          </div>
          <div className={s.col}>
            <div className={s.bars}>
              {[92, 70, 44, 22, 9].map((h, i) => (
                <span key={i} className={s.growY} style={d(0.2 + i * 0.25, { height: `${h}%` })}>
                  <small>W{i + 1}</small>
                </span>
              ))}
            </div>
            <Foot at={1.8}>Results fade by week 3</Foot>
          </div>
        </div>
      );
    case "fewVariants":
      return (
        <div className={s.split}>
          <div className={cx(s.adMini, s.in)} style={d(0)}>
            <span />
            <b>Ad v1</b>
          </div>
          <div className={s.col}>
            <div className={s.slots}>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={s.in} style={d(0.3 + i * 0.1)}>
                  ?
                </span>
              ))}
            </div>
            <Foot at={1.5}>Nothing to test it against</Foot>
          </div>
        </div>
      );
    case "scrollPast":
      return (
        <div className={s.split}>
          <div className={s.phone}>
            <div className={s.feedFast}>
              {["", "", "Polished ad", "", "", ""].map((x, i) => (
                <span key={i} className={x ? s.feedAd : ""}>
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className={s.col}>
            <Chip kind="soft" at={1.7}>
              Scrolled past · 0.8s
            </Chip>
          </div>
        </div>
      );
    case "confused":
      return (
        <div className={s.center}>
          <div className={cx(s.product, s.in)} style={d(0)}>
            <I n="box" z={44} />
          </div>
          {["What does it do?", "Why this one?", "Worth it?"].map((q, i) => (
            <p key={q} className={cx(s.bub, s.qb, s.pop)} style={d(0.5 + i * 0.4, { "--x": ["-96px", "92px", "-60px"][i], "--y": ["-58px", "-34px", "62px"][i] })}>
              {q}
            </p>
          ))}
          <Chip kind="soft" at={1.9} className={s.cornerChip}>
            Scrolled on
          </Chip>
        </div>
      );
    case "dated":
      return (
        <Browser className={s.datedSite}>
          <b className={s.serifOld}>Welcome to our Website!!</b>
          <div className={s.marquee}>
            <span>★ Under construction ★ Best quality ★ Call now ★</span>
          </div>
          <u>Home</u> <u>About us</u> <u>Contact (page 4)</u>
          <small className={s.counterOld}>Visitors: 000213</small>
        </Browser>
      );
    case "bounce":
      return (
        <div className={s.rel}>
          <Browser>
            <b className={s.hPlain}>Our Services</b>
            <span className={s.lineFull} />
            <span className={s.lineShort} />
            <span className={s.lineFull} />
          </Browser>
          <Cursor className={s.curLeave} />
          <em className={cx(s.toast, s.toastBad, s.pop)} style={d(1.9)}>
            Visitor left · 6s
          </em>
        </div>
      );
    case "slow":
      return (
        <div className={s.split}>
          <div className={s.phone}>
            <div className={s.skel}>
              <span />
              <span />
              <span />
            </div>
            <i className={s.spinner} />
            <div className={s.slowBar}>
              <i />
            </div>
          </div>
          <div className={s.col}>
            <b className={s.bigNum}>4.8s</b>
            <small className={s.mute}>…still loading</small>
            <Chip kind="soft" at={2.1}>
              Visitor gave up
            </Chip>
          </div>
        </div>
      );
    case "ghost":
      return (
        <div className={s.col}>
          <div className={cx(s.search, s.in)} style={d(0)}>
            <I n="search" z={14} /> best expert near me
          </div>
          <Rows items={[["Competitor A", "★★★★★"], ["Competitor B", "★★★★☆"], ["Competitor C", "★★★★☆"]]} at={0.3} step={0.25} mark={() => null} />
          <div className={cx(s.row, s.ghostRow, s.in)} style={d(1.3)}>
            <span>
              <b>You?</b>
              <small>page 3</small>
            </span>
          </div>
        </div>
      );
    case "writerBlock":
      return (
        <div className={cx(s.card, s.doc)}>
          <small className={s.mute}>Post idea #1</small>
          <p className={s.typeLine}>
            <span className={s.typeDel}>So today I want to talk about…</span>
            <i className={s.caret} />
          </p>
          <span className={s.lineFaint} />
          <span className={s.lineFaint} />
          <Foot at={1.2}>Draft 12 · still blank</Foot>
        </div>
      );
    case "mismatch":
    case "match": {
      const good = v === "match";
      return (
        <div className={s.col}>
          <div className={s.profiles}>
            {["Instagram", "LinkedIn", "YouTube"].map((p, i) => (
              <div key={p} className={cx(s.card, s.prof, good ? s.align : s.jitter)} style={d(i * 0.15, { "--r": `${[-7, 5, -3][i]}deg`, "--y": `${[8, -6, 4][i]}px` })}>
                <i className={cx(s.avBig, good ? s.avGold : "")} style={good ? d(0.6 + i * 0.15) : { background: ["#c9705a", "#5a7fc9", "#9a9a9a"][i] }} />
                <b style={good ? undefined : { fontFamily: ["Georgia, serif", "monospace", "Impact, sans-serif"][i] }}>{good ? "Your Name" : ["your.name_", "Y. Name", "YN Official"][i]}</b>
                <small>{p}</small>
              </div>
            ))}
          </div>
          <Foot at={1.4}>{good ? "Recognised everywhere ✓" : "Three profiles, three people"}</Foot>
        </div>
      );
    }
    case "clones":
      return (
        <div className={s.col}>
          <div className={s.thumbs}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={s.in} style={d(i * 0.12)}>
                <I n="play" z={14} />
                {i === 4 && <small>you</small>}
              </span>
            ))}
          </div>
          <Foot at={1.2}>Spot yours?</Foot>
        </div>
      );
    case "countdown":
      return (
        <div className={s.split}>
          <div className={cx(s.card, s.count)}>
            <small>Launch in</small>
            <div className={s.flip}>
              <div>
                {[5, 4, 3, 2, 1].map((n) => (
                  <b key={n}>{n}</b>
                ))}
              </div>
            </div>
            <small>days</small>
          </div>
          <div className={s.col}>
            <div className={cx(s.emptyFilm, s.pulse)}>
              <I n="play" z={18} /> No film yet
            </div>
            <Foot at={2.4}>Campaign with nothing to show</Foot>
          </div>
        </div>
      );
    case "pile":
      return (
        <div className={s.pile}>
          {["clip_014.mp4", "IMG_2231.mov", "final_v7.mp4", "drone_02.mp4", "broll.mov", "interview.mp4"].map((c, i) => (
            <span key={c} className={s.fall} style={d(i * 0.22, { "--r": `${[-12, 8, -4, 14, -9, 5][i]}deg`, left: `${[24, 112, 196, 48, 140, 92][i]}px`, bottom: `${[22, 18, 26, 62, 58, 100][i]}px` })}>
              <I n="play" z={10} /> {c}
            </span>
          ))}
          <Chip kind="soft" at={1.8} className={s.topChip}>
            Never shaped into a story
          </Chip>
        </div>
      );
    case "shaky":
      return (
        <div className={s.col}>
          <div className={cx(s.frameV, s.jitterCam)}>
            <span className={s.subject} style={{ left: "62%" }} />
          </div>
          <Foot at={0.8}>Shot, but never directed</Foot>
        </div>
      );
    case "cartDrop":
    case "checkoutGo": {
      const good = v === "checkoutGo";
      return (
        <div className={s.col}>
          <div className={cx(s.card, s.cartRow, s.in)} style={d(0)}>
            <I n="cart" z={20} /> <b>3 items</b>
          </div>
          <ol className={s.steps4}>
            {["Cart", "Details", "Payment", "Done"].map((c, i) => (
              <li key={c} className={!good && i >= 2 ? s.stop : s.lit} style={d(0.4 + i * 0.45)}>
                {c}
              </li>
            ))}
          </ol>
          <Foot at={2.2}>{good ? "✓ Order placed" : "Cart abandoned at payment"}</Foot>
        </div>
      );
    }
    case "silos":
      return (
        <div className={s.col}>
          <div className={s.silos}>
            {[
              ["Orders", "12"],
              ["Stock", "9"],
              ["Shipping", "?"],
            ].map(([a, b], i) => (
              <div key={a} className={cx(s.card, s.silo, s.in)} style={d(i * 0.3)}>
                <small>{a}</small>
                <b>{b}</b>
              </div>
            ))}
            <i className={cx(s.brk, s.pop)} style={d(1, { left: "33.3%" })}>
              <I n="x" z={12} />
            </i>
            <i className={cx(s.brk, s.pop)} style={d(1.2, { left: "66.6%" })}>
              <I n="x" z={12} />
            </i>
          </div>
          <Foot at={1.6}>Three tools, three different answers</Foot>
        </div>
      );
    case "leak":
      return (
        <div className={s.funnel}>
          {["Ad clicks", "Landing page", "Form", "Enquiry"].map((x, i) => (
            <div key={x} className={cx(s.fstage, s.in)} style={d(i * 0.15, { width: `${100 - i * 20}%` })}>
              {x}
            </div>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} className={s.leakDrop} style={d(i * 0.35, { "--i": i, left: `${34 + (i % 4) * 9}%` })} />
          ))}
        </div>
      );
    case "junkLeads":
      return (
        <div className={s.col}>
          <Rows
            items={[
              ["New lead", "“Just browsing”"],
              ["New lead", "Wrong city"],
              ["New lead", "No budget"],
              ["New lead", "Ready to buy"],
            ].map(([a, b], i) => [`${a} ${i + 1}`, b] as [string, string])}
            step={0.35}
            mark={(i) => (i === 3 ? <Chip at={1.6}>Worth a call</Chip> : <Chip kind="soft" at={0.6 + i * 0.35}>Not ready</Chip>)}
          />
        </div>
      );
    case "lostLead":
      return (
        <div className={s.split}>
          <div className={cx(s.card, s.form, s.in)} style={d(0)}>
            <span />
            <span />
            <span />
            <b className={s.pop} style={d(0.6)}>
              Submitted ✓
            </b>
            <I n="mail" z={22} className={s.flyAway} style={d(1)} />
          </div>
          <div className={s.col}>
            <span className={cx(s.mute, s.in)} style={d(1.6)}>
              <I n="clock" z={14} /> 3 days later…
            </span>
            <Chip kind="soft" at={2}>
              No one followed up
            </Chip>
          </div>
        </div>
      );
    case "tangle":
      return (
        <div className={s.tangle}>
          <div className={s.tcol}>
            {["Google", "Meta", "Instagram"].map((x, i) => (
              <span key={x} className={cx(s.node, s.in)} style={d(i * 0.15)}>
                {x}
              </span>
            ))}
          </div>
          <svg className={s.tlines} viewBox="0 0 100 120" preserveAspectRatio="none">
            {["M0 20 C50 20 50 100 100 100", "M0 60 C50 60 50 20 100 20", "M0 100 C50 100 50 60 100 60", "M0 20 C50 20 50 60 100 60"].map((p, i) => (
              <path key={i} className={cx(s.draw, s.dash)} pathLength={1} style={d(0.5 + i * 0.2)} d={p} />
            ))}
          </svg>
          <div className={s.tcol}>
            {["Lead 1", "Lead 2", "Lead 3"].map((x, i) => (
              <span key={x} className={cx(s.node, s.in)} style={d(0.3 + i * 0.15)}>
                {x}
              </span>
            ))}
          </div>
          <b className={cx(s.bigQ, s.pop)} style={d(1.5)}>
            ?
          </b>
        </div>
      );

    /* ───────── outcomes ───────── */
    case "instantReply":
      return (
        <div className={s.chatCol}>
          <span className={cx(s.night, s.in)} style={d(0)}>
            <I n="moon" z={13} /> 2:14 am
          </span>
          <Bubble at={0.2}>Hi! Table for 4 on Saturday?</Bubble>
          <div className={s.stack}>
            <p className={cx(s.bub, s.bubMe, s.typing, s.flash)} style={d(0.7)}>
              <i />
              <i />
              <i />
            </p>
            <p className={cx(s.bub, s.bubMe, s.pop)} style={d(1.6)}>
              Yes — 7:30 is free. Shall I book it?
            </p>
          </div>
          <Foot at={2.1}>Replied in 4 seconds</Foot>
        </div>
      );
    case "followUp":
      return (
        <div className={s.col}>
          <div className={s.timeline}>
            <i className={cx(s.tlLine, s.grow)} style={d(0.1)} />
            {["Day 1", "Day 3", "Day 7"].map((x, i) => (
              <div key={x} className={s.tlNode}>
                <span className={cx(s.tlDot, s.pop)} style={d(0.3 + i * 0.5)}>
                  <I n={calls ? "phone" : "chat"} z={14} />
                </span>
                <b>{x}</b>
                <Chip at={0.5 + i * 0.5}>{calls ? "Called ✓" : "Sent ✓"}</Chip>
              </div>
            ))}
          </div>
          <Foot at={2.1}>Replied — booked ✓</Foot>
        </div>
      );
    case "booked":
      return (
        <div className={s.col}>
          <div className={s.week}>
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((x) => (
              <small key={x}>{x}</small>
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={i === 7 ? cx(s.bookedSlot, s.pop) : ""} style={i === 7 ? d(0.5) : undefined}>
                {i === 7 ? "Booked ✓" : ""}
              </span>
            ))}
          </div>
          <div className={cx(s.card, s.remind, s.in)} style={d(1.2)}>
            <I n="bell" z={16} className={s.ringOnce} /> Reminder sent · day before
          </div>
          <Foot at={1.9}>Confirmed — and they showed up</Foot>
        </div>
      );
    case "answered":
      return (
        <div className={s.col}>
          <div className={s.callTop}>
            <span className={cx(s.ring, s.ringGood)}>
              <I n="phone" z={22} />
            </span>
            <span className={s.wave}>
              {Array.from({ length: 16 }, (_, i) => (
                <i key={i} style={{ animationDelay: `${(i % 6) * -0.12}s` }} />
              ))}
            </span>
          </div>
          <Rows
            items={[
              ["22:41", "New caller"],
              ["23:05", "New caller"],
              ["07:12", "Customer"],
            ]}
            at={0.4}
            step={0.4}
            mark={(i) => <Chip at={0.7 + i * 0.4}>{i === 0 ? "Booked ✓" : "Answered"}</Chip>}
          />
        </div>
      );
    case "plan":
      return (
        <div className={cx(s.card, s.doc)}>
          <b className={s.docH}>Content strategy</b>
          <div className={s.chipsRow}>
            {["Educate", "Prove", "Sell"].map((x, i) => (
              <Chip key={x} at={0.4 + i * 0.25}>
                {x}
              </Chip>
            ))}
          </div>
          <span className={cx(s.lineFull, s.grow)} style={d(1.1)} />
          <span className={cx(s.lineShort, s.grow)} style={d(1.3)} />
          <Foot at={1.8}>Approved ✓ — the team knows what to post</Foot>
        </div>
      );
    case "statement":
      return (
        <div className={cx(s.card, s.doc)}>
          <small className={s.mute}>Your positioning</small>
          <p className={s.quoteType}>
            <span className={s.type} style={d(0.2, { "--n": 34 })}>
              &ldquo;I help founders grow with video.&rdquo;
            </span>
          </p>
          <div className={s.chipsRow}>
            {["Story", "Proof", "Voice"].map((x, i) => (
              <Chip key={x} at={1.5 + i * 0.2}>
                {x}
              </Chip>
            ))}
          </div>
        </div>
      );
    case "calFill":
      return (
        <div className={s.col}>
          <Grid n={21} cols={7} on={(i) => i % 3 !== 2} at={0.1} step={0.07} label={(i) => ["Reel", "Post", "Story"][i % 3]} cls={s.cellGold} />
          <Foot at={1.8}>Planned 30 days ahead</Foot>
        </div>
      );
    case "cadence":
      return (
        <div className={s.col}>
          <div className={s.weeks}>
            {Array.from({ length: 4 }, (_, w) => (
              <div key={w}>
                <small>Week {w + 1}</small>
                <div>
                  {[0, 1, 2].map((k) => (
                    <span key={k} className={s.pop} style={d(0.2 + (w * 3 + k) * 0.13)}>
                      <I n="play" z={10} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <i className={s.playhead} />
          </div>
          <Foot at={1.9}>Three a week, every week</Foot>
        </div>
      );
    case "report":
      return (
        <div className={s.col}>
          <div className={s.reportTop}>
            <div className={s.barsSm}>
              {[30, 45, 40, 62, 78, 96].map((h, i) => (
                <span key={i} className={s.growY} style={d(0.2 + i * 0.15, { height: `${h}%` })} />
              ))}
            </div>
            <Chart up at={0.4} />
          </div>
          <Foot at={1.8}>What works ↑ · what changes next →</Foot>
        </div>
      );
    case "library":
      return (
        <div className={s.col}>
          <div className={s.thumbs4}>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={s.pop} style={d(0.1 + i * 0.1)}>
                <I n="play" z={12} />
              </span>
            ))}
          </div>
          <Foot at={1.6}>48 pieces, ready to post</Foot>
        </div>
      );
    case "batch":
      return (
        <div className={s.split}>
          <div className={s.recBtn}>
            <i className={s.pulse} />
            <small>1 session</small>
          </div>
          <div className={s.fan}>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={s.pop} style={d(0.5 + i * 0.12)}>
                <I n="play" z={10} />
              </span>
            ))}
            <Foot at={1.7}>→ a month of posts</Foot>
          </div>
        </div>
      );
    case "idea":
      return (
        <div className={s.center}>
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className={s.spark} style={d(i * 0.1, { "--ang": `${i * 60}deg` })} />
          ))}
          <span className={cx(s.bulb, s.glow)} style={d(0.9)}>
            <I n="bulb" z={46} />
          </span>
          <Chip at={1.5} className={s.belowChip}>
            One idea, told well
          </Chip>
        </div>
      );
    case "formats":
      return (
        <div className={s.col}>
          <div className={s.morphBox}>
            <span className={s.morph}>
              <I n="play" z={16} />
            </span>
          </div>
          <div className={s.chipsRow}>
            {["16:9", "9:16", "1:1", "4:5"].map((x, i) => (
              <Chip key={x} at={0.3 + i * 0.5} kind="plain">
                {x}
              </Chip>
            ))}
          </div>
        </div>
      );
    case "grade":
      return (
        <div className={s.col}>
          <div className={cx(s.frameV, s.graded)}>
            <span className={s.subject} />
          </div>
          <div className={s.tracks}>
            <span className={s.trV}>
              <i />
              <i />
              <i />
            </span>
            <span className={s.trA}>
              {Array.from({ length: 24 }, (_, i) => (
                <i key={i} style={{ height: `${30 + ((i * 37) % 70)}%` }} />
              ))}
            </span>
            <i className={s.playhead} />
          </div>
        </div>
      );
    case "everywhere":
      return (
        <div className={s.center}>
          <span className={cx(s.hubCard, s.pop)} style={d(0)}>
            <I n="play" z={18} />
          </span>
          {[
            ["Ads", "-110px", "-50px"],
            ["Website", "110px", "-50px"],
            ["Social", "0px", "70px"],
          ].map(([x, dx, dy], i) => (
            <span key={x} style={{ ["--x" as string]: dx, ["--y" as string]: dy }}>
              <i className={s.flyDot} style={d(0.4 + i * 0.3, { "--x": dx, "--y": dy })} />
              <em className={cx(s.chip, s.chipA, s.target, s.pop)} style={d(1 + i * 0.3, { "--x": dx, "--y": dy })}>
                {x} ✓
              </em>
            </span>
          ))}
        </div>
      );
    case "pipeline":
      return (
        <div className={s.col}>
          <div className={s.belt}>
            <div className={s.beltTrack}>
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i}>Ad {String((i % 5) + 1).padStart(2, "0")}</span>
              ))}
            </div>
          </div>
          <div className={s.rollers}>
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <Foot at={0.8}>A fresh batch, every cycle</Foot>
        </div>
      );
    case "variants":
      return (
        <div className={s.center}>
          {["A", "B", "C", "D", "E", "F"].map((x, i) => (
            <span key={x} className={s.splitCard} style={d(0.3 + i * 0.1, { "--x": `${((i % 3) - 1) * 92}px`, "--y": `${(Math.floor(i / 3) - 0.5) * 84}px`, "--h": `${[20, 60, 120, 200, 260, 320][i]}` })}>
              <i />
              Hook {x}
            </span>
          ))}
        </div>
      );
    case "native":
      return (
        <div className={s.split}>
          <div className={s.phone}>
            <div className={s.feedStop}>
              {["", "", "ugc", "", ""].map((x, i) => (
                <span key={i} className={x ? s.feedUgc : ""}>
                  {x && (
                    <>
                      <i className={s.face} />
                      <small>honestly obsessed</small>
                      <I n="heart" z={16} className={cx(s.heartPop, s.pop)} style={d(2)} />
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className={s.col}>
            <Chip at={2.2}>Stopped the scroll</Chip>
          </div>
        </div>
      );
    case "demo":
      return (
        <div className={s.center}>
          <div className={cx(s.product, s.productGood, s.pop)} style={d(0)}>
            <I n="box" z={44} />
          </div>
          {[
            ["Waterproof", "-104px", "-50px"],
            ["2-min setup", "104px", "-20px"],
            ["Free returns", "-80px", "60px"],
          ].map(([x, dx, dy], i) => (
            <em key={x} className={cx(s.chip, s.chipA, s.target, s.pop)} style={d(0.6 + i * 0.4, { "--x": dx, "--y": dy })}>
              {x}
            </em>
          ))}
        </div>
      );
    case "premium":
      return (
        <div className={s.rel}>
          <Browser className={s.premium}>
            <div className={s.wireLayer}>
              <span />
              <span />
              <span />
            </div>
            <div className={s.polish}>
              <b className={s.serifNew}>Crafted for you.</b>
              <small>Your work, shown properly.</small>
              <em className={s.goldBtn}>Book now</em>
              <span className={s.heroImg} />
            </div>
          </Browser>
        </div>
      );
    case "journey":
    case "oneAction": {
      const one = v === "oneAction";
      return (
        <div className={s.rel}>
          <Browser>
            <b className={s.hNew}>{one ? "Get your free quote" : "Book your stay, direct."}</b>
            {!one && <span className={s.lineFull} />}
            <em className={cx(s.goldBtn, one && s.bigBtn, s.pulse)}>{one ? "Get my quote →" : "Check availability"}</em>
          </Browser>
          <Cursor className={one ? s.curOne : s.curClick} />
          <em className={cx(s.toast, s.toastGood, s.pop)} style={d(1.9)}>
            ✓ New enquiry · just now
          </em>
        </div>
      );
    }
    case "fast":
      return (
        <div className={s.col}>
          <svg className={s.gauge} viewBox="0 0 120 70">
            <path className={s.gaugeBg} d="M10 64a50 50 0 0 1 100 0" pathLength={1} />
            <path className={s.gaugeFg} d="M10 64a50 50 0 0 1 100 0" pathLength={1} />
            <line className={s.needle} x1="60" y1="64" x2="60" y2="22" />
          </svg>
          <b className={cx(s.bigNum, s.pop)} style={d(1.3)}>
            98
          </b>
          <Foot at={1.6}>Loads in 0.9s on mobile</Foot>
        </div>
      );
    case "connected": {
      const nodes = alt === "chat" ? ["WhatsApp", "Web chat", "Calendar", "CRM"] : calls ? ["Phone line", "Routing", "Calendar", "CRM"] : ["Orders", "Stock", "Shipping", "Payments"];
      const pos = [
        ["-108px", "-56px"],
        ["108px", "-56px"],
        ["-108px", "56px"],
        ["108px", "56px"],
      ];
      return (
        <div className={s.center}>
          <svg className={s.hubLines} viewBox="-160 -110 320 220">
            {pos.map(([x, y], i) => (
              <line key={i} className={s.draw} pathLength={1} style={d(0.3 + i * 0.2)} x1="0" y1="0" x2={parseInt(x)} y2={parseInt(y)} />
            ))}
          </svg>
          <span className={cx(s.hub, s.pop)} style={d(0)}>
            K
          </span>
          {pos.map(([x, y], i) => (
            <span key={i}>
              <em className={cx(s.node, s.target, s.pop)} style={d(0.5 + i * 0.2, { "--x": x, "--y": y })}>
                {nodes[i]}
              </em>
              <i className={s.flow} style={d(1.2 + i * 0.25, { "--x": x, "--y": y })} />
            </span>
          ))}
        </div>
      );
    }
    case "filter":
      return (
        <div className={s.sieve}>
          <span className={s.sieveBar} />
          {Array.from({ length: 7 }, (_, i) => {
            const pass = [1, 3, 6].includes(i);
            return <i key={i} className={pass ? s.pass : s.reject} style={d(i * 0.3, { "--x": `${(i - 3) * 30}px`, "--side": i < 3 ? "-1" : "1" })} />;
          })}
          <span className={cx(s.qualified, s.pop)} style={d(1.6)}>
            Qualified ✓
          </span>
        </div>
      );
    case "route": {
      const to = calls ? ["Sales", "Support", "Owner"] : ["WhatsApp", "Email", "CRM"];
      return (
        <div className={s.routeWrap}>
          <span className={cx(s.card, s.routeSrc, s.in)} style={d(0)}>
            <I n={calls ? "phone" : "user"} z={16} /> {calls ? "Incoming call" : "New lead"}
          </span>
          <svg className={s.routeLines} viewBox="0 0 100 120" preserveAspectRatio="none">
            {["M0 60 C50 60 50 15 100 15", "M0 60 L100 60", "M0 60 C50 60 50 105 100 105"].map((p, i) => (
              <path key={i} className={s.draw} pathLength={1} style={d(0.3 + i * 0.2)} d={p} />
            ))}
          </svg>
          <div className={s.routeDst}>
            {to.map((x, i) => (
              <em key={x} className={cx(s.node, i === (calls ? 0 : 0) ? s.lit : "")} style={d(1.2 + i * 0.3)}>
                {x}
              </em>
            ))}
          </div>
          <Foot at={1.9}>{calls ? "To the right person, first time" : "In your inbox in seconds"}</Foot>
        </div>
      );
    }
    case "track":
      return (
        <div className={s.col}>
          <div className={s.path}>
            <i className={cx(s.tlLine, s.grow)} style={d(0.2)} />
            {["Click", "Page", "Form", "Enquiry"].map((x, i) => (
              <span key={x} className={cx(s.pnode, s.lit)} style={d(0.3 + i * 0.4)}>
                {x}
              </span>
            ))}
          </div>
          <Chip at={2}>Source: Meta · Campaign B</Chip>
        </div>
      );

    /* ───────── workflow steps ───────── */
    case "scan":
      return (
        <div className={s.rel}>
          <div className={s.thumbs}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={[1, 5].includes(i) ? s.found : ""} style={d(0.6 + (i === 5 ? 0.9 : 0))}>
                {[1, 5].includes(i) && (
                  <Chip at={0.8 + (i === 5 ? 0.9 : 0)} className={s.foundChip}>
                    works ↑
                  </Chip>
                )}
              </span>
            ))}
          </div>
          <I n="search" z={46} className={s.loupe} />
        </div>
      );
    case "pillars":
      return (
        <div className={s.temple}>
          <b className={cx(s.roof, s.pop)} style={d(1.2)}>
            Strategy
          </b>
          <div className={s.cols3}>
            {["Educate", "Prove", "Sell"].map((x, i) => (
              <span key={x} className={s.growY} style={d(0.2 + i * 0.25)}>
                <small>{x}</small>
              </span>
            ))}
          </div>
          <i className={cx(s.base, s.grow)} style={d(0)} />
        </div>
      );
    case "record":
      return (
        <div className={s.col}>
          <div className={cx(s.frameV, s.viewfinder)}>
            <span className={s.subject} />
            <i className={s.brTL} />
            <i className={s.brBR} />
            <em className={cx(s.rec, s.blink)}>● REC</em>
            <small className={s.tc}>
              00:00:
              <span className={s.tcRoll}>
                <span>
                  {Array.from({ length: 10 }, (_, i) => (
                    <b key={i}>{String(i + 10)}</b>
                  ))}
                </span>
              </span>
            </small>
          </div>
        </div>
      );
    case "optimise":
      return (
        <div className={s.col}>
          <div className={s.ab}>
            {[
              ["A", 48],
              ["B", 92],
              ["C", 30],
            ].map(([x, h], i) => (
              <span key={x} className={cx(s.growY, x === "B" && s.win)} style={d(0.2 + i * 0.2, { height: `${h}%` })}>
                <small>{x}</small>
              </span>
            ))}
          </div>
          <Foot at={1.4}>More of B next month ↑</Foot>
        </div>
      );
    case "palette":
      return (
        <div className={s.split}>
          <div className={s.swatches}>
            {["#09453E", "#C8A25A", "#FBF5E9", "#687B75"].map((c, i) => (
              <span key={c} className={s.pop} style={d(i * 0.2, { background: c })} />
            ))}
          </div>
          <div className={s.col}>
            <b className={cx(s.aa, s.in)} style={d(0.8)}>
              Aa
            </b>
            <div className={s.chipsRow}>
              {["Warm", "Direct", "Expert"].map((x, i) => (
                <Chip key={x} at={1.2 + i * 0.2}>
                  {x}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      );
    case "brainstorm":
      return (
        <div className={s.center}>
          <svg className={s.hubLines} viewBox="-160 -110 320 220">
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
              return <line key={i} className={s.draw} pathLength={1} style={d(0.3 + i * 0.15)} x1="0" y1="0" x2={Math.round(Math.cos(a) * 118)} y2={Math.round(Math.sin(a) * 78)} />;
            })}
          </svg>
          <span className={cx(s.hub, s.hubWide, s.pop)} style={d(0)}>
            Ideas
          </span>
          {["First client", "Big mistake", "Why I started", "Behind the scenes", "Hot take", "Client win"].map((x, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return (
              <em key={x} className={cx(s.node, s.target, s.pop, i === 2 && s.pick)} style={d(0.5 + i * 0.15, { "--x": `${Math.round(Math.cos(a) * 118)}px`, "--y": `${Math.round(Math.sin(a) * 78)}px` })}>
                {x}
              </em>
            );
          })}
        </div>
      );
    case "script":
      return (
        <div className={s.split}>
          <div className={cx(s.card, s.doc, s.scriptDoc)}>
            <b className={s.mono}>SCENE 1 — INT.</b>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cx(s.lineFull, s.grow)} style={d(0.3 + i * 0.3, { width: `${[100, 80, 92, 60][i]}%` })} />
            ))}
          </div>
          <div className={s.board}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={s.pop} style={d(1.2 + i * 0.25)}>
                <i />
              </span>
            ))}
          </div>
        </div>
      );
    case "hooks":
      return (
        <div className={cx(s.card, s.doc, s.hooks)}>
          <small className={s.mute}>Hooks</small>
          {["Stop scrolling if you…", "POV: your first client…", "3 mistakes every…", "Nobody tells you this…"].map((h, i) => (
            <p key={h} className={cx(s.hookLine, i === 1 && s.hookWin)} style={d(2.6)}>
              <span className={s.type} style={d(0.2 + i * 0.55, { "--n": h.length, "--t": "0.5s" })}>
                {h}
              </span>
              {i === 1 && <Chip at={2.6}>Winner</Chip>}
            </p>
          ))}
        </div>
      );
    case "sitemap":
      return (
        <div className={s.center}>
          <svg className={s.hubLines} viewBox="-160 -110 320 220">
            {[-100, 0, 100].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(0.3 + i * 0.15)} d={`M0 -62 V-30 H${x} V-6`} />
            ))}
            {[-130, -70, 70, 130].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(1 + i * 0.12)} d={`M${x < 0 ? -100 : 100} 18 V34 H${x} V52`} />
            ))}
          </svg>
          <em className={cx(s.node, s.target, s.pop, s.lit)} style={d(0, { "--x": "0px", "--y": "-74px" })}>
            Home
          </em>
          {["Services", "Work", "Contact"].map((x, i) => (
            <em key={x} className={cx(s.node, s.target, s.pop)} style={d(0.5 + i * 0.15, { "--x": `${(i - 1) * 100}px`, "--y": "6px" })}>
              {x}
            </em>
          ))}
          {["Web", "Ads", "Case 1", "Case 2"].map((x, i) => (
            <em key={x} className={cx(s.node, s.nodeSm, s.target, s.pop)} style={d(1.2 + i * 0.12, { "--x": `${[-130, -70, 70, 130][i]}px`, "--y": "64px" })}>
              {x}
            </em>
          ))}
        </div>
      );
    case "wireframe":
      return (
        <Browser className={s.wireDraw}>
          {[
            ["8%", "8%", "50%", "14%"],
            ["8%", "30%", "38%", "8%"],
            ["8%", "48%", "24%", "12%"],
            ["56%", "8%", "36%", "52%"],
            ["8%", "70%", "84%", "18%"],
          ].map(([l, t, w, h], i) => (
            <i key={i} className={s.wbox} style={d(i * 0.3, { left: l, top: t, width: w, height: h })} />
          ))}
        </Browser>
      );
    case "code":
      return (
        <div className={s.editor}>
          {[
            ["<Hero", "title=", "\"Book direct\"", "/>"],
            ["<Services", "items=", "{list}", "/>"],
            ["<Enquiry", "to=", "\"whatsapp\"", "/>"],
            ["export", "default", "Site", ""],
          ].map((ln, i) => (
            <p key={i} className={s.type} style={d(0.2 + i * 0.45, { "--n": 26, "--t": "0.45s" })}>
              <b>{ln[0]}</b> <i>{ln[1]}</i>
              <u>{ln[2]}</u> {ln[3]}
            </p>
          ))}
          <Chip at={2.2} className={s.cornerChip}>
            ✓ Build passed
          </Chip>
        </div>
      );
    case "launch":
      return (
        <div className={s.center}>
          <span className={s.toggle}>
            <i />
          </span>
          <b className={cx(s.liveTxt, s.pop)} style={d(0.9)}>
            Live
          </b>
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} className={s.confetti} style={d(1 + (i % 3) * 0.08, { "--ang": `${i * 36}deg`, "--c": ["#c8a25a", "#fbf5e9", "#e9d3a0"][i % 3] })} />
          ))}
          <I n="rocket" z={30} className={s.rocket} />
        </div>
      );
    case "catalogue":
      return (
        <div className={s.catalogue}>
          {["Rings", "Bags", "Shoes"].map((x, c) => (
            <div key={x}>
              <small className={s.in} style={d(0.1)}>
                {x}
              </small>
              {[0, 1].map((r) => (
                <span key={r} className={s.sort} style={d(0.3 + (c * 2 + r) * 0.15, { "--fx": `${(1 - c) * 60 + (r ? -30 : 30)}px`, "--fy": `${r ? -40 : 30}px` })}>
                  <I n="box" z={14} />
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    case "account":
      return (
        <div className={s.col}>
          <div className={cx(s.card, s.person, s.in)} style={d(0)}>
            <i className={s.av}>M</i>
            <span>
              <b>My account</b>
              <small>3 orders</small>
            </span>
          </div>
          <Rows
            items={[
              ["#1042", "Delivered"],
              ["#1088", "Shipped"],
            ]}
            at={0.4}
            step={0.35}
            mark={(i) => <Chip at={0.7 + i * 0.35}>{i ? "On the way" : "✓"}</Chip>}
          />
          <div className={s.trackBar}>
            <i className={s.grow} style={d(1.3)} />
          </div>
        </div>
      );
    case "target":
      return (
        <div className={s.center}>
          <span className={s.bull}>
            <i />
            <i />
            <i />
          </span>
          <span className={s.arrow} />
          <Chip at={1.2} className={s.belowChip}>
            One audience · one goal
          </Chip>
        </div>
      );
    case "flow":
      return (
        <div className={s.center}>
          <svg className={s.hubLines} viewBox="-160 -110 320 220">
            {[-110, 0, 110].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(0.4 + i * 0.2)} d={`M0 -46 C0 0 ${x} -10 ${x} 30`} />
            ))}
          </svg>
          <em className={cx(s.bub, s.target, s.pop)} style={d(0, { "--x": "0px", "--y": "-62px" })}>
            Hi! Quick question…
          </em>
          {["Prices", "Book a slot", "Talk to a human"].map((x, i) => (
            <em key={x} className={cx(s.node, s.target, s.pop)} style={d(0.8 + i * 0.2, { "--x": `${(i - 1) * 110}px`, "--y": "44px" })}>
              {x}
            </em>
          ))}
        </div>
      );
    case "train":
      return (
        <div className={s.center}>
          {["FAQs", "Prices", "Tone"].map((x, i) => (
            <span key={x} className={s.feed} style={d(i * 0.35, { "--x": `${(i - 1) * 100}px` })}>
              <I n="doc" z={14} /> {x}
            </span>
          ))}
          <span className={cx(s.hub, s.chipHub)}>
            <I n="chip" z={26} />
          </span>
          <div className={s.trainBar}>
            <i className={s.grow} style={d(0.4)} />
          </div>
          <Chip at={1.9} className={s.belowChip2}>
            Trained on your business ✓
          </Chip>
        </div>
      );
    case "test":
      return (
        <div className={s.col}>
          <Rows
            items={[
              ["Asks for prices", ""],
              ["Wants to book", ""],
              ["Unhappy customer", ""],
              ["Out of hours", ""],
            ]}
            step={0.35}
            mark={(i) => <Chip at={0.4 + i * 0.35}>✓ Pass</Chip>}
          />
        </div>
      );
    case "voice":
      return (
        <div className={s.col}>
          <span className={cx(s.wave, s.waveBig)}>
            {Array.from({ length: 24 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 7) * -0.1}s` }} />
            ))}
          </span>
          {["Warmth", "Pace"].map((x, i) => (
            <div key={x} className={s.slider}>
              <small>{x}</small>
              <span>
                <i style={d(0.3 + i * 0.3, { "--to": i ? "45%" : "78%" })} />
              </span>
            </div>
          ))}
          <Foot at={1.6}>Sounds like your team</Foot>
        </div>
      );
  }
}
