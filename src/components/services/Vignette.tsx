"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Alt, Vkind } from "@/content/motion";
import s from "./Vignette.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   Screens: each problem, outcome and step shown on the interface it really
   happens in — WhatsApp, Instagram, Google, Ads Manager, a phone's call log,
   a real Kllezo website or dashboard. Drawn on a fixed 480×360 canvas and
   scaled to fit, so they look identical everywhere. CSS animation replays
   whenever the screen is remounted. Names and numbers are illustrative;
   the photography and site designs are Kllezo's own work.
   ───────────────────────────────────────────────────────────────────────── */

export type Tone = "bad" | "good";

const W = 480;
const H = 360;
const A = "/creative/assets";

const d = (sec: number, more: Record<string, string | number> = {}): CSSProperties => ({ "--d": `${sec}s`, ...more }) as CSSProperties;
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

export default function Vignette({ v, tone, alt, className }: { v: Vkind; tone: Tone; alt?: Alt; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(Math.min(e.contentRect.width / W, 1.6)));
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

/* ── icons ─────────────────────────────────────────────────────────────── */
const P: Record<string, ReactNode> = {
  phone: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />,
  save: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" />,
  play: <path d="M8 5v14l11-7L8 5Z" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  bag: <path d="M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" />,
  card: <path d="M3 6h18v12H3zM3 10h18" />,
  truck: <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  grid: <path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16" />,
  users: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20a6 6 0 0 0-4-5.6" />,
  lock: <path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" />,
  file: <path d="M6 3h8l4 4v14H6zM14 3v4h4" />,
  mic: <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3" />,
  dots: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  back: <path d="M15 5l-7 7 7 7" />,
};
const I = ({ n, z = 14, className, style, fill }: { n: string; z?: number; className?: string; style?: CSSProperties; fill?: boolean }) => (
  <svg width={z} height={z} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {P[n]}
  </svg>
);

/* ── device chrome ─────────────────────────────────────────────────────── */
const Sig = () => (
  <svg width="44" height="10" viewBox="0 0 46 10">
    <g fill="currentColor">
      <rect x="0" y="6" width="2.6" height="4" rx=".6" />
      <rect x="4" y="4" width="2.6" height="6" rx=".6" />
      <rect x="8" y="2" width="2.6" height="8" rx=".6" />
      <rect x="12" y="0" width="2.6" height="10" rx=".6" />
    </g>
    <path d="M19.5 3.6a7 7 0 0 1 9 0M21.4 5.7a4.2 4.2 0 0 1 5.2 0M23.2 7.7a1.5 1.5 0 0 1 1.6 0" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <rect x="32.5" y=".5" width="11" height="9" rx="2.6" stroke="currentColor" fill="none" opacity=".45" />
    <rect x="34" y="2" width="8" height="6" rx="1.4" fill="currentColor" />
  </svg>
);

function Phone({ children, x = 0, time = "9:41", dark, className }: { children: ReactNode; x?: number; time?: string; dark?: boolean; className?: string }) {
  return (
    <div className={cx(s.phone, className)} style={{ left: `calc(50% + ${x}px)` }}>
      <div className={cx(s.scr, dark && s.scrDark)}>
        <div className={s.status}>
          <b>{time}</b>
          <i className={s.island} />
          <Sig />
        </div>
        {children}
      </div>
    </div>
  );
}

function Win({ url, children, w = 424, x = 0, y = 28, h = 290, dark, className }: { url: string; children: ReactNode; w?: number; x?: number; y?: number; h?: number; dark?: boolean; className?: string }) {
  return (
    <div className={cx(s.win, dark && s.winDark, className)} style={{ width: w, left: `calc(50% + ${x}px)`, top: y }}>
      <div className={s.wbar}>
        <span className={s.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>
          <I n="lock" z={9} /> {url}
        </span>
        <span />
      </div>
      <div className={s.wbody} style={{ height: h }}>
        {children}
      </div>
    </div>
  );
}

type Img = { f: string; pos?: string; size?: string };
/** A crop of one of Kllezo's own images. */
const Shot = ({ f, pos = "center", size = "cover", pan, className, style }: Img & { pan?: boolean; className?: string; style?: CSSProperties }) => (
  <i className={cx(s.shot, pan && s.pan, className)} style={{ backgroundImage: `url(${A}/${f})`, backgroundPosition: pos, backgroundSize: size, ...style }} />
);

const APPS: Record<string, [string, ReactNode]> = {
  whatsapp: [s.icWa, <I key="i" n="phone" z={13} />],
  instagram: [s.icIg, <i key="i" className={s.igGlyph} />],
  phone: [s.icPhone, <I key="i" n="phone" z={13} fill />],
  calendar: [s.icCal, <b key="i">14</b>],
  mail: [s.icMail, <I key="i" n="mail" z={13} />],
  reminders: [s.icRem, <I key="i" n="check" z={13} />],
  team: [s.icTeam, <I key="i" n="users" z={13} />],
  kllezo: [s.icK, <b key="i">K</b>],
  store: [s.icStore, <I key="i" n="bag" z={13} />],
  card: [s.icCard, <I key="i" n="card" z={13} />],
  truck: [s.icTruck, <I key="i" n="truck" z={13} />],
  sheets: [s.icSheets, <I key="i" n="grid" z={13} />],
  messages: [s.icMsg, <I key="i" n="chat" z={13} fill />],
  crm: [s.icCrm, <I key="i" n="users" z={13} />],
};
const App = ({ a, z = 26 }: { a: string; z?: number }) => {
  const [c, g] = APPS[a] ?? APPS.kllezo;
  return (
    <i className={cx(s.app, c)} style={{ width: z, height: z }}>
      {g}
    </i>
  );
};

/** An iOS notification banner, sliding in. */
const Notif = ({ a, t, b, time = "now", at, y = 0, className }: { a: string; t: string; b: string; time?: string; at: number; y?: number; className?: string }) => (
  <div className={cx(s.notif, s.drop, className)} style={d(at, { top: `${40 + y}px` })}>
    <App a={a} z={24} />
    <div>
      <b>{t}</b>
      <span>{b}</span>
    </div>
    <small>{time}</small>
  </div>
);

/** A floating annotation card beside a device. */
const Float = ({ children, at, x, y, w, kind }: { children: ReactNode; at: number; x: number; y: number; w?: number; kind?: "bad" | "good" }) => (
  <div className={cx(s.float, kind === "bad" && s.fBad, kind === "good" && s.fGood, s.pop)} style={{ ...d(at, { left: `${x}px`, top: `${y}px` }), width: w }}>
    {children}
  </div>
);

const Chip = ({ children, at, kind = "a", className }: { children: ReactNode; at: number; kind?: "a" | "soft" | "ok" | "no"; className?: string }) => (
  <em className={cx(s.chip, kind === "a" ? s.chipA : kind === "soft" ? s.chipSoft : kind === "ok" ? s.chipOk : s.chipNo, s.pop, className)} style={d(at)}>
    {children}
  </em>
);

/** Count up to a number once mounted. */
function Count({ to, at = 0, dur = 1.3, pre = "", suf = "", dec = 0 }: { to: number; at?: number; dur?: number; pre?: string; suf?: string; dec?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now() + at * 1000;
    const tick = (now: number) => {
      const k = instant ? 1 : Math.min(1, Math.max(0, (now - t0) / (dur * 1000)));
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, at, dur]);
  return (
    <>
      {pre}
      {dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN")}
      {suf}
    </>
  );
}

const Cursor = ({ x0, y0, x1, y1, at = 0.2, leave, click = true }: { x0: number; y0: number; x1: number; y1: number; at?: number; leave?: boolean; click?: boolean }) => (
  <svg className={cx(s.cursor, leave ? s.curLeave : click ? s.curClick : s.curMove)} style={d(at, { "--x0": `${x0}px`, "--y0": `${y0}px`, "--x1": `${x1}px`, "--y1": `${y1}px` })} width="16" height="20" viewBox="0 0 18 22">
    <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#111" strokeWidth="1.3" />
  </svg>
);

/* ── app UIs ───────────────────────────────────────────────────────────── */
type Msg = { t?: ReactNode; me?: boolean; at: number; time?: string; tick?: "read" | "sent"; typing?: number; card?: ReactNode; sys?: boolean };

function WaChat({ name, sub = "online", msgs, av = "#7a9e93", x, time }: { name: string; sub?: string; msgs: Msg[]; av?: string; x?: number; time?: string }) {
  return (
    <Phone x={x} time={time}>
      <div className={s.waHead}>
        <I n="back" z={14} />
        <i className={s.waAv} style={{ background: av }}>
          {name[0]}
        </i>
        <span>
          <b>{name}</b>
          <small>{sub}</small>
        </span>
        <I n="phone" z={13} />
      </div>
      <div className={s.waBody}>
        {msgs.map((m, i) =>
          m.sys ? (
            <p key={i} className={cx(s.waSys, s.in)} style={d(m.at)}>
              {m.t}
            </p>
          ) : m.typing !== undefined ? (
            <p key={i} className={cx(s.waMsg, s.typing, s.flash)} style={d(m.at, { "--dur": `${m.typing}s` })}>
              <i />
              <i />
              <i />
            </p>
          ) : (
            <div key={i} className={cx(s.waMsg, m.me && s.waMe, s.in)} style={d(m.at)}>
              {m.card ?? m.t}
              <small>
                {m.time ?? "9:41"}
                {m.me && <span className={m.tick === "sent" ? s.tickGrey : s.tickBlue}>✓✓</span>}
              </small>
            </div>
          ),
        )}
      </div>
      <div className={s.waInput}>
        <span>Message</span>
        <i>
          <I n="mic" z={12} />
        </i>
      </div>
    </Phone>
  );
}

function WaList({ rows, x }: { rows: { n: string; m: string; t: string; badge?: number; at: number }[]; x?: number }) {
  return (
    <Phone x={x}>
      <div className={s.waListHead}>
        <b>Chats</b>
        <span className={s.waSearch}>
          <I n="search" z={10} /> Search
        </span>
      </div>
      <div className={s.waList}>
        {rows.map((r, i) => (
          <div key={i} className={cx(s.waRow, s.in)} style={d(r.at)}>
            <i className={s.waAv} style={{ background: ["#7a9e93", "#c9a27a", "#8a90c9", "#c98a8a", "#9ac98a", "#b48ac9"][i % 6] }}>
              {r.n[0]}
            </i>
            <span>
              <b>{r.n}</b>
              <small>{r.m}</small>
            </span>
            <span className={s.waMeta}>
              <small className={r.badge ? s.waTimeNew : ""}>{r.t}</small>
              {r.badge ? (
                <em className={cx(s.waBadge, s.pop)} style={d(r.at + 0.3)}>
                  {r.badge}
                </em>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

const IgHead = ({ name, verified, ring = true }: { name: string; verified?: boolean; ring?: boolean }) => (
  <div className={s.igHead}>
    <i className={cx(s.igAv, ring && s.igRing)} />
    <b>
      {name}
      {verified && <span className={s.verified}>✓</span>}
    </b>
    <I n="dots" z={14} />
  </div>
);
const IgActions = () => (
  <div className={s.igActions}>
    <I n="heart" z={16} />
    <I n="chat" z={16} />
    <I n="send" z={16} />
    <span />
    <I n="save" z={16} />
  </div>
);

function Ads({ rows, cols, title = "Ads Manager", banner, kpis }: { rows: ReactNode[][]; cols: string[]; title?: string; banner?: ReactNode; kpis?: ReactNode }) {
  return (
    <Win url="adsmanager · Campaigns">
      <div className={s.ads}>
        <div className={s.adsTop}>
          <b>{title}</b>
          <span>Last 7 days</span>
        </div>
        {kpis}
        {banner}
        <div className={s.adsTable} style={{ gridTemplateColumns: `1.6fr repeat(${cols.length - 1}, 1fr)` }}>
          {cols.map((c) => (
            <span key={c} className={s.adsTh}>
              {c}
            </span>
          ))}
          {rows.map((r, i) => r.map((c, j) => <span key={`${i}-${j}`}>{c}</span>))}
        </div>
      </div>
    </Win>
  );
}

const Spark = ({ up, at = 0.4, w = 70, h = 22 }: { up: boolean; at?: number; w?: number; h?: number }) => (
  <svg className={cx(s.spark, up ? s.sparkUp : s.sparkDown)} width={w} height={h} viewBox="0 0 70 22" preserveAspectRatio="none">
    <path className={s.draw} style={d(at)} pathLength={1} d={up ? "M1 20 L12 17 L22 18 L33 12 L44 11 L56 6 L69 2" : "M1 3 L12 5 L22 4 L33 10 L44 12 L56 17 L69 20"} />
  </svg>
);

function Doc({ url, title, children }: { url: string; title: ReactNode; children: ReactNode }) {
  return (
    <Win url={url}>
      <div className={s.doc}>
        <h4 className={s.docTitle}>{title}</h4>
        {children}
      </div>
    </Win>
  );
}

function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Win url={`figma.com · ${title}`}>
      <div className={s.board}>
        <span className={s.boardTitle}>{title}</span>
        {children}
      </div>
    </Win>
  );
}

const Sticky = ({ children, x, y, c = "y", at, r = 0, w = 96 }: { children: ReactNode; x: number; y: number; c?: "y" | "p" | "g" | "b"; at: number; r?: number; w?: number }) => (
  <span className={cx(s.sticky, s[`st_${c}`], s.pop)} style={d(at, { left: `${x}px`, top: `${y}px`, rotate: `${r}deg`, width: `${w}px` })}>
    {children}
  </span>
);

const Typed = ({ children, at, n = 30, t = 1 }: { children: ReactNode; at: number; n?: number; t?: number }) => (
  <span className={s.type} style={d(at, { "--n": n, "--t": `${t}s` })}>
    {children}
  </span>
);

/* image crops */
const F1 = (q: 0 | 1 | 2 | 3): Img => ({ f: "content/1a-1d.webp", size: "200% 200%", pos: ["0% 0%", "100% 0%", "0% 100%", "100% 100%"][q] });
const PERSON: Img = { f: "content/6.webp", size: "520%", pos: "64% 27%" };
const VILLA: Img = { f: "content/5.webp", size: "230%", pos: "38% 55%" };
const PERFUME: Img = { f: "content/4.webp", size: "330%", pos: "50% 45%" };
const PODCAST: Img = { f: "content/10.webp", size: "260%", pos: "30% 30%" };
const SITE = (n: number): Img => ({ f: `niche-${n}.webp`, size: "100% auto", pos: "50% 0%" });

/* ── the screens ───────────────────────────────────────────────────────── */
function Body({ v, alt }: { v: Vkind; alt?: Alt }) {
  const calls = alt === "calls";
  switch (v) {
    /* ═════════ content growth ═════════ */
    case "igFlat":
      return (
        <>
          <Phone x={-56}>
            <IgHead name="yourbusiness" ring={false} />
            <div className={cx(s.igImg, s.meh)}>
              <b>Happy Monday!</b>
              <small>Have a great week ☕</small>
            </div>
            <IgActions />
            <p className={s.igLikes}>12 likes</p>
            <p className={s.igCap}>
              <b>yourbusiness</b> New week, new goals! #monday #motivation
            </p>
            <p className={s.igMuted}>No comments yet</p>
          </Phone>
          <Float at={0.4} x={290} y={40} w={172}>
            <b>Post insights</b>
            {(
              [
                ["Accounts reached", <Count key="c" to={112} at={0.6} />],
                ["Profile visits", "0"],
                ["Website taps", "0"],
                ["Messages", "0"],
              ] as [string, ReactNode][]
            ).map(([k, val], i) => (
              <div key={k} className={cx(s.insRow, s.in)} style={d(0.6 + i * 0.25)}>
                <span>{k}</span>
                <b>{val}</b>
              </div>
            ))}
          </Float>
          <Float at={1.8} x={290} y={210} w={172} kind="bad">
            <small>Enquiries from Instagram</small>
            <b className={s.bigBad}>0</b>
            <Spark up={false} at={2} w={140} />
          </Float>
        </>
      );
    case "igMess": {
      const tiles = [s.tQuote, s.tFest, s.tMeme, s.tBlur, s.tHire, s.tCall, s.tRepost, s.tQuote2, s.tStock];
      const label = ["“Believe in yourself”", "Happy Diwali!", "Monday mood 😩", "", "We're hiring?", "CALL NOW 98xxx", "Repost", "Keep going!!", "Best service"];
      return (
        <>
          <Phone x={-30}>
            <div className={s.igProf}>
              <i className={s.igAvBig} />
              <div>
                <b>214</b>
                <small>posts</small>
              </div>
              <div>
                <b>380</b>
                <small>followers</small>
              </div>
              <div>
                <b>12</b>
                <small>following</small>
              </div>
            </div>
            <p className={s.igBio}>
              <b>Your Business</b>
              Best services in town!!! DM for price
            </p>
            <div className={s.igGrid}>
              {tiles.map((c, i) => (
                <span key={i} className={cx(c, s.pop)} style={d(0.15 + i * 0.12)}>
                  {label[i]}
                </span>
              ))}
            </div>
          </Phone>
          <Sticky x={318} y={78} at={1.5} r={4} w={130}>
            What do we post today??
          </Sticky>
          <Float at={2.1} x={318} y={200} w={130} kind="bad">
            <small>Last post</small>
            <b>19 days ago</b>
          </Float>
        </>
      );
    }
    case "lockOverdue":
      return (
        <Phone dark time="21:47">
          <div className={s.lock}>
            <small>Friday 14 June</small>
            <b>21:47</b>
          </div>
          <Notif a="reminders" t="Reminders" b="Post on Instagram · 4 days late" time="2h" at={0.3} y={86} />
          <Notif a="whatsapp" t="Team" b="Riya: who's posting today?" time="1h" at={0.8} y={140} />
          <Notif a="instagram" t="Instagram" b="9 days since your last post" time="40m" at={1.3} y={194} />
          <Notif a="calendar" t="Content shoot" b="Cancelled · meeting ran over" time="now" at={1.8} y={248} />
        </Phone>
      );
    case "noData":
      return (
        <>
          <Win url="analytics · Reports snapshot">
            <div className={s.dash}>
              <div className={s.dashTop}>
                <b>Reports snapshot</b>
                <span>Last 28 days</span>
              </div>
              <div className={cx(s.warn, s.in)} style={d(0.4)}>
                ⚠ No conversion events are set up
              </div>
              <div className={s.kpis}>
                {["Users", "Enquiries", "Sales", "Top source"].map((k, i) => (
                  <div key={k} className={cx(s.kpi, s.in)} style={d(0.6 + i * 0.12)}>
                    <small>{k}</small>
                    <b>—</b>
                  </div>
                ))}
              </div>
              <div className={s.empty}>
                <span>No data for this date range</span>
              </div>
            </div>
          </Win>
          <Cursor x0={120} y0={250} x1={330} y1={200} at={0.6} click={false} />
          <b className={cx(s.qFloat, s.bob)} style={{ left: 400, top: 50 }}>
            ?
          </b>
          <b className={cx(s.qFloat, s.bob)} style={{ left: 50, top: 270, animationDelay: "-0.8s" }}>
            ?
          </b>
        </>
      );
    case "docStrategy":
      return (
        <Doc
          url="notion.so · Content strategy"
          title={
            <Typed at={0.1} n={26}>
              Content Strategy — Q3
            </Typed>
          }
        >
          <div className={s.props}>
            <span>Owner · Kllezo</span>
            <Chip kind="ok" at={1.9}>
              Approved by you ✓
            </Chip>
          </div>
          <small className={s.docH}>Pillars</small>
          <div className={s.pillars}>
            {(
              [
                ["Educate", 40],
                ["Prove", 35],
                ["Sell", 25],
              ] as [string, number][]
            ).map(([k, pct], i) => (
              <div key={k} className={cx(s.pillar, s.in)} style={d(0.6 + i * 0.2)}>
                <b>{k}</b>
                <small>{pct}% of posts</small>
                <i className={s.grow} style={d(0.9 + i * 0.2, { width: `${pct * 2}%` })} />
              </div>
            ))}
          </div>
          <small className={s.docH}>Plan</small>
          {["Instagram Reels + YouTube Shorts", "3 posts a week, Mon · Wed · Fri", "One message per post, one call to action"].map((x, i) => (
            <p key={x} className={cx(s.todo, s.in)} style={d(1.2 + i * 0.25)}>
              <i className={s.pop} style={d(1.4 + i * 0.25)}>
                ✓
              </i>
              {x}
            </p>
          ))}
        </Doc>
      );
    case "calendarReal":
      return (
        <>
          <Win url="kllezo.studio · Content calendar" dark>
            <Shot f="content/2.webp" />
            <i className={s.sweep} />
          </Win>
          <Float at={1.2} x={300} y={262} w={160} kind="good">
            <b>30 days planned</b>
            <small>Approved before we film</small>
          </Float>
          <Notif className={s.notifFloat} a="kllezo" t="Scheduled" b="Reel · Tuesday 9:00 AM" at={1.8} y={-24} />
        </>
      );
    case "igGood": {
      const tiles = [F1(1), F1(0), VILLA, F1(3), PERFUME, F1(2), PODCAST, SITE(1), PERSON];
      return (
        <>
          <Phone x={-36}>
            <div className={s.igProf}>
              <i className={cx(s.igAvBig, s.igRing)} />
              <div>
                <b>
                  <Count to={248} at={0.2} />
                </b>
                <small>posts</small>
              </div>
              <div>
                <b>
                  <Count to={12.4} dec={1} suf="K" at={0.2} />
                </b>
                <small>followers</small>
              </div>
              <div>
                <b>180</b>
                <small>following</small>
              </div>
            </div>
            <p className={s.igBio}>
              <b>
                yourbrand <span className={s.verified}>✓</span>
              </b>
              Built properly. Posted on schedule.
            </p>
            <div className={s.igGrid}>
              {tiles.map((t, i) => (
                <span key={i} className={s.pop} style={d(0.3 + i * 0.13)}>
                  <Shot {...t} />
                </span>
              ))}
            </div>
          </Phone>
          <Notif className={s.notifFloat} a="instagram" t="Reel published" b="Your reel is live · 9:00 AM" at={1.7} y={-24} />
          <Float at={2.3} x={318} y={210} w={140} kind="good">
            <small>Reach this month</small>
            <b className={s.bigGood}>
              +<Count to={38} at={2.4} suf="%" />
            </b>
          </Float>
        </>
      );
    }
    case "dashEngage":
      return (
        <>
          <Win url="kllezo.studio · Monthly report" dark>
            <Shot f="content/7.webp" />
            <i className={s.ring} style={{ left: "14%", top: "18%", width: "60%", height: "20%" }} />
          </Win>
          <Float at={1.2} x={300} y={262} w={164} kind="good">
            <small>Best performer</small>
            <b>How-to reels ↑ 43%</b>
          </Float>
          <Float at={1.8} x={16} y={262} w={140} kind="good">
            <small>Views this month</small>
            <b className={s.bigGood}>
              <Count to={2.4} dec={1} suf="M" at={1.9} />
            </b>
          </Float>
        </>
      );
    case "researchBoard":
      return (
        <Board title="Research">
          {[SITE(2), VILLA, SITE(3)].map((img, i) => (
            <span key={i} className={cx(s.boardShot, s.pop)} style={d(0.1 + i * 0.2, { left: `${[22, 156, 290][i]}px`, top: `${[40, 32, 44][i]}px` })}>
              <Shot {...img} />
            </span>
          ))}
          <Sticky x={34} y={186} at={1.1} r={-3}>
            Hook in the first second ✓
          </Sticky>
          <Sticky x={166} y={196} at={1.4} c="p" r={2}>
            They post 3× a week
          </Sticky>
          <Sticky x={300} y={188} at={1.7} c="g" r={-2}>
            Gap: nobody does how-to
          </Sticky>
          <span className={s.loupe}>
            <I n="search" z={44} />
          </span>
        </Board>
      );
    case "pillars":
      return (
        <Board title="Strategy">
          {["Educate", "Prove", "Sell"].map((k, c) => (
            <div key={k} className={s.boardCol} style={{ left: 22 + c * 132 }}>
              <b className={cx(s.colHead, s.in)} style={d(c * 0.15)}>
                {k}
              </b>
              {[
                ["3 mistakes when…", "How we do it", "Myth vs fact"],
                ["Client result", "Behind the scenes", "Review reel"],
                ["Offer of the month", "Book a call", "FAQ answers"],
              ][c].map((x, r) => (
                <Sticky key={x} x={0} y={34 + r * 66} at={0.5 + (c * 3 + r) * 0.12} c={(["y", "p", "g"] as const)[c]} w={112}>
                  {x}
                </Sticky>
              ))}
            </div>
          ))}
        </Board>
      );
    case "hooksDoc":
      return calls ? (
        <Doc url="docs · Call script" title="Inbound call script">
          {[
            ["Greet", "“Hi, thanks for calling — this is Aria.”"],
            ["Qualify", "“Is this a new booking or an existing one?”"],
            ["Answer", "Prices, timings, location — from your notes"],
            ["Book", "“Tuesday at 4 works. I'll text a confirmation.”"],
          ].map(([k, x], i) => (
            <p key={k} className={s.scriptRow}>
              <Chip at={0.2 + i * 0.5} kind="soft">
                {k}
              </Chip>
              <Typed at={0.3 + i * 0.5} n={44} t={0.5}>
                {x}
              </Typed>
            </p>
          ))}
        </Doc>
      ) : (
        <Doc url="docs · Hooks" title="Hooks — this month">
          {["Stop scrolling if you run a hotel…", "POV: your first direct booking", "3 mistakes every owner makes", "Nobody tells you this about OTAs"].map((h, i) => (
            <p key={h} className={cx(s.hook, i === 1 && s.hookWin)} style={d(2.6)}>
              <Typed at={0.2 + i * 0.55} n={h.length} t={0.5}>
                {h}
              </Typed>
              {i === 1 && <Chip at={2.6}>Winner</Chip>}
            </p>
          ))}
        </Doc>
      );
    case "cameraReal":
      return (
        <>
          <Win url="Camera A · Live" dark>
            <Shot f="content/4.webp" />
            <em className={cx(s.live, s.blink)}>● REC</em>
          </Win>
          <Float at={1} x={320} y={262} w={140} kind="good">
            <small>Shot list</small>
            <b>12 / 14 done</b>
          </Float>
        </>
      );
    case "dashCampaign":
      return (
        <>
          <Win url="kllezo.studio · Campaigns" dark>
            <Shot f="content/12.webp" />
            <i className={s.ring} style={{ left: "2%", top: "6%", width: "96%", height: "16%" }} />
          </Win>
          <Float at={1.1} x={16} y={262} w={140} kind="good">
            <small>Return on ad spend</small>
            <b className={s.bigGood}>
              <Count to={4.2} dec={1} suf="×" at={1.2} />
            </b>
          </Float>
          <Float at={1.6} x={324} y={262} w={140} kind="good">
            <small>Cost per lead</small>
            <b className={s.bigGood}>↓ 31%</b>
          </Float>
        </>
      );

    /* ═════════ personal brand ═════════ */
    case "googleMissing":
      return (
        <>
          <Phone x={-40}>
            <div className={s.gBar}>
              <b className={s.gLogo}>
                <span>G</span>
                <span>o</span>
                <span>o</span>
                <span>g</span>
                <span>l</span>
                <span>e</span>
              </b>
              <span className={s.gSearch}>
                <I n="search" z={10} />
                <Typed at={0.1} n={22} t={0.8}>
                  best expert near me
                </Typed>
              </span>
            </div>
            <div className={s.gMap}>
              <i style={{ left: "22%", top: "40%" }} />
              <i style={{ left: "58%", top: "28%" }} />
              <i style={{ left: "70%", top: "62%" }} />
            </div>
            {[
              ["Studio Aria", "4.8 ★★★★★ (212)"],
              ["Nest & Co.", "4.7 ★★★★★ (167)"],
              ["Urban Form", "4.6 ★★★★☆ (98)"],
            ].map(([n, r], i) => (
              <div key={n} className={cx(s.gRes, s.in)} style={d(0.9 + i * 0.2)}>
                <b>{n}</b>
                <small>{r}</small>
              </div>
            ))}
            <div className={cx(s.gRes, s.in)} style={d(1.6)}>
              <b>Top 10 experts in your city</b>
              <small>blog · 2 min read</small>
            </div>
          </Phone>
          <Float at={2} x={312} y={110} w={150} kind="bad">
            <small>Your business</small>
            <b>Not in the top 20</b>
            <small>Page 3 of results</small>
          </Float>
        </>
      );
    case "notesBlank":
      return (
        <>
          <Phone x={-34}>
            <div className={s.notesHead}>
              <I n="back" z={12} /> Notes
            </div>
            <div className={s.notes}>
              <b>Post ideas</b>
              <small>12 June at 23:14</small>
              <p className={s.strike}>Motivational quote?</p>
              <p className={s.strike}>Behind the scenes??</p>
              <p className={s.strike}>Something about pricing</p>
              <p className={s.typeLine}>
                <span className={s.typeDel}>So today I want to talk about…</span>
                <i className={s.caret} />
              </p>
            </div>
          </Phone>
          <Float at={1.4} x={318} y={150} w={140} kind="bad">
            <small>Posts this month</small>
            <b className={s.bigBad}>0</b>
          </Float>
        </>
      );
    case "calBusy":
      return (
        <>
          <Phone x={-30}>
            <div className={s.calHead}>
              <b>Thursday</b>
              <small>13 June</small>
            </div>
            <div className={s.day}>
              {["9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].map((h) => (
                <span key={h} className={s.hour}>
                  {h}
                </span>
              ))}
              {(
                [
                  ["Client call", 0, 1, "#5b8def"],
                  ["Site visit", 1.2, 1.6, "#e7a33e"],
                  ["Team meeting", 3, 1, "#8f6bd8"],
                  ["Proposal due", 4.2, 1.8, "#e05d5d"],
                  ["Calls", 6.2, 1.4, "#41a37a"],
                ] as [string, number, number, string][]
              ).map(([n, t, h, c], i) => (
                <i key={n} className={cx(s.ev, s.in)} style={d(0.1 + i * 0.15, { top: `${t * 26 + 4}px`, height: `${h * 26 - 3}px`, background: c })}>
                  {n}
                </i>
              ))}
              <i className={cx(s.ev, s.evRec)} style={d(1.3, { top: `${7.8 * 26 + 4}px`, height: "22px" })}>
                Record content
              </i>
            </div>
          </Phone>
          <Notif className={s.notifFloat} a="calendar" t="Record content" b="Moved to next week (again)" at={2} y={-24} />
        </>
      );
    case "profilesMismatch":
    case "profilesMatch": {
      const good = v === "profilesMatch";
      return (
        <div className={s.profiles}>
          {[
            ["Instagram", s.pIg],
            ["LinkedIn", s.pLi],
            ["YouTube", s.pYt],
          ].map(([p, cls], i) => (
            <div key={p} className={cx(s.pCard, good ? s.align : s.jitter)} style={d(i * 0.15, { "--r": `${[-6, 4, -3][i]}deg`, "--y": `${[10, -8, 6][i]}px` })}>
              <i className={cx(s.pBanner, cls)} />
              <span className={cx(s.pAv, good && s.pAvGood)} style={good ? d(0.7 + i * 0.15) : { background: ["#c9705a", "#5a7fc9", "#9a9a9a"][i] }}>
                {good ? <Shot {...PERSON} /> : null}
              </span>
              <b style={good ? undefined : { fontFamily: ["Georgia, serif", "ui-monospace, monospace", "Impact, sans-serif"][i] }}>{good ? "Your Name" : ["your.name_", "Y. Name, MBA", "YN OFFICIAL"][i]}</b>
              <small>{good ? "Helping founders grow with video" : ["dm for collab ✨", "Strategic leader | Visionary", "subscribe!!"][i]}</small>
              <em className={s.pPlat}>{p}</em>
            </div>
          ))}
          <p className={cx(s.under, s.pop, good ? s.underGood : s.underBad)} style={d(1.4)}>
            {good ? "Recognised on every platform ✓" : "Three profiles. Three different people."}
          </p>
        </div>
      );
    }
    case "linkedin":
      return (
        <>
          <Win url="linkedin.com/in/yourname">
            <div className={s.li}>
              <span className={s.liBanner}>
                <Shot {...F1(1)} />
              </span>
              <span className={s.liAv}>
                <Shot {...PERSON} />
              </span>
              <b className={s.liName}>Your Name</b>
              <p className={s.liHead}>
                <Typed at={0.4} n={46} t={1.1}>
                  Founder · Helping hotels win direct bookings
                </Typed>
              </p>
              <small className={s.liMeta}>
                <Count to={8240} at={0.6} /> followers · 500+ connections
              </small>
              <div className={cx(s.liPost, s.in)} style={d(1.4)}>
                <b>“We stopped paying 20% to OTAs. Here&apos;s how.”</b>
                <small>
                  <Count to={1284} at={1.6} /> reactions · 96 comments
                </small>
              </div>
            </div>
          </Win>
          <Notif className={s.notifFloat} a="mail" t="New enquiry" b="Found you on LinkedIn — can we talk?" at={2.2} y={-24} />
        </>
      );
    case "podcastReal":
      return (
        <>
          <Win url="kllezo.studio · Podcast" dark x={-36} w={380} h={254}>
            <Shot f="content/3.webp" />
          </Win>
          <div className={s.clips}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={s.pop} style={d(0.8 + i * 0.15)}>
                <Shot f="content/3.webp" size="420%" pos={`${20 + i * 3}% 40%`} />
                <I n="play" z={9} fill />
              </span>
            ))}
          </div>
          <Float at={2} x={150} y={300} w={180} kind="good">
            <b>1 session → 24 clips</b>
          </Float>
        </>
      );
    case "youtubeReal":
      return (
        <>
          <Win url="youtube.com/@yourbrand" dark>
            <Shot f="content/10.webp" />
            <i className={s.ring} style={{ left: "75%", top: "8%", width: "24%", height: "86%" }} />
          </Win>
          <Float at={1.3} x={16} y={262} w={156} kind="good">
            <small>Subscribers</small>
            <b className={s.bigGood}>
              +<Count to={2140} at={1.4} />
            </b>
          </Float>
        </>
      );
    case "target":
      return (
        <Board title="Positioning">
          <span className={s.bull}>
            <i />
            <i />
            <i />
          </span>
          <span className={s.arrow} />
          <Sticky x={24} y={50} at={1} r={-3} w={110}>
            Who: boutique hotel owners
          </Sticky>
          <Sticky x={290} y={46} at={1.3} c="p" r={3} w={110}>
            Pain: OTAs take 20%
          </Sticky>
          <Sticky x={286} y={190} at={1.6} c="g" r={-2} w={116}>
            Promise: more direct bookings
          </Sticky>
        </Board>
      );
    case "palette":
      return (
        <Win url="figma.com · Brand identity" dark>
          <div className={s.figma}>
            <div className={s.swatches}>
              {["#09453E", "#C8A25A", "#FBF5E9", "#687B75"].map((c, i) => (
                <span key={c} className={s.pop} style={d(i * 0.15)}>
                  <i style={{ background: c }} />
                  <small>{c}</small>
                </span>
              ))}
            </div>
            <div className={cx(s.typeSpec, s.in)} style={d(0.8)}>
              <b>Aa</b>
              <span>
                Playfair Display
                <small>Headlines · Inter for body</small>
              </span>
            </div>
            <div className={s.toneRow}>
              {["Warm", "Direct", "Expert", "No jargon"].map((x, i) => (
                <Chip key={x} at={1.3 + i * 0.15}>
                  {x}
                </Chip>
              ))}
            </div>
          </div>
        </Win>
      );
    case "brainstorm":
      return (
        <Board title="Story bank">
          <svg className={s.lines} viewBox="0 0 424 290">
            {[
              [80, 70],
              [212, 50],
              [344, 70],
              [80, 220],
              [212, 240],
              [344, 220],
            ].map(([x, y], i) => (
              <line key={i} className={s.draw} pathLength={1} style={d(0.3 + i * 0.12)} x1="212" y1="148" x2={x} y2={y} />
            ))}
          </svg>
          <b className={cx(s.idea, s.pop)} style={{ left: 212, top: 148 }}>
            Ideas
          </b>
          {(
            [
              ["First client", 80, 70, "y"],
              ["Biggest mistake", 212, 50, "p"],
              ["Why I started", 344, 70, "g"],
              ["Behind the scenes", 80, 220, "b"],
              ["A hot take", 212, 240, "y"],
              ["Client win", 344, 220, "p"],
            ] as [string, number, number, string][]
          ).map(([t, x, y, c], i) => (
            <span key={t} className={cx(s.sticky, s[`st_${c}`], s.centered, s.pop, i === 2 && s.voted)} style={d(0.5 + i * 0.13, { left: `${x}px`, top: `${y}px`, width: "100px" })}>
              {t}
            </span>
          ))}
        </Board>
      );
    case "scriptReal":
      return (
        <>
          <Win url="kllezo.studio · Script" dark>
            <Shot f="content/6.webp" />
            <i className={s.scan} />
          </Win>
          <Float at={1.4} x={320} y={262} w={140} kind="good">
            <small>Hook</small>
            <b>0–3s ✓ approved</b>
          </Float>
        </>
      );
    case "everywhere":
      return (
        <div className={s.every}>
          <span className={cx(s.evHub, s.pop)}>
            <Shot {...F1(1)} />
          </span>
          {(
            [
              ["Instagram", -150, -84, F1(1)],
              ["Website", 150, -84, SITE(1)],
              ["Ads", 0, 108, F1(1)],
            ] as [string, number, number, Img][]
          ).map(([n, x, y, img], i) => (
            <span key={n}>
              <i className={s.flyDot} style={d(0.5 + i * 0.25, { "--x": `${x}px`, "--y": `${y}px` })} />
              <span className={cx(s.evCard, s.pop)} style={d(1 + i * 0.25, { "--x": `${x}px`, "--y": `${y}px` })}>
                <span className={s.evImg}>
                  <Shot {...img} />
                </span>
                <b>{n} ✓</b>
              </span>
            </span>
          ))}
        </div>
      );

    /* ═════════ video ═════════ */
    case "ytClones":
      return (
        <>
          <Win url="youtube.com/results?q=company+video">
            <div className={s.yt}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={cx(s.ytCard, s.in)} style={d(i * 0.12)}>
                  <span className={s.ytThumb}>
                    <i />
                    {i === 4 && <em>you</em>}
                  </span>
                  <b>Corporate Video 202{(i % 3) + 3}</b>
                  <small>{[312, 280, 145, 402, 198, 87][i]} views</small>
                </div>
              ))}
            </div>
          </Win>
          <Float at={1.4} x={322} y={262} w={140} kind="bad">
            <b>Which one is you?</b>
          </Float>
        </>
      );
    case "launchCountdown":
      return (
        <>
          <Doc url="docs · Launch plan" title="Launch checklist">
            {(
              [
                ["Website updated", true],
                ["Ads scheduled", true],
                ["Press list ready", true],
                ["Hero film", false],
              ] as [string, boolean][]
            ).map(([k, ok], i) => (
              <p key={k} className={cx(s.todo, s.in, !ok && s.todoBad)} style={d(0.2 + i * 0.25)}>
                <i className={cx(s.pop, !ok && s.xMark)} style={d(0.4 + i * 0.25)}>
                  {ok ? "✓" : "✕"}
                </i>
                {k}
                {!ok && (
                  <Chip kind="no" at={1.3}>
                    Not started
                  </Chip>
                )}
              </p>
            ))}
          </Doc>
          <Float at={0.8} x={330} y={200} w={120} kind="bad">
            <small>Launch in</small>
            <span className={s.flip}>
              <span>
                {[7, 6, 5, 4, 3].map((n) => (
                  <b key={n}>{n}</b>
                ))}
              </span>
            </span>
            <small>days</small>
          </Float>
        </>
      );
    case "filesPile":
      return (
        <>
          <Win url="Finder · Shoot_2025">
            <div className={s.finder}>
              <div className={s.fSide}>
                <small>Favourites</small>
                <span>Desktop</span>
                <span className={s.fOn}>Shoot_2025</span>
                <span>Downloads</span>
              </div>
              <div className={s.fList}>
                {["IMG_2231.MOV", "C0042.MP4", "drone_final_v3.mov", "interview_raw.mp4", "C0043.MP4", "broll_misc.mov", "IMG_2240.MOV", "untitled_04.mp4"].map((f, i) => (
                  <div key={f} className={cx(s.fRow, s.in)} style={d(i * 0.1)}>
                    <I n="file" z={11} /> <b>{f}</b>
                    <small>{(1.2 + ((i * 7) % 10) / 3).toFixed(1)} GB</small>
                  </div>
                ))}
                <p className={s.fFoot}>2,148 items · 186 GB</p>
              </div>
            </div>
          </Win>
          <Float at={1.4} x={334} y={262} w={124} kind="bad">
            <small>Edited into a story</small>
            <b className={s.bigBad}>0</b>
          </Float>
        </>
      );
    case "shakyCam":
      return (
        <>
          <Phone dark x={-30}>
            <div className={s.cam}>
              <Shot f="content/11.webp" size="300%" pos="70% 40%" className={s.shaky} />
              <i className={s.focus} />
              <em className={s.camTime}>● 00:14</em>
              <span className={s.shutter} />
            </div>
          </Phone>
          <Float at={1} x={316} y={120} w={140} kind="bad">
            <small>Take</small>
            <b>14 of ???</b>
            <small>No shot list. No director.</small>
          </Float>
        </>
      );
    case "storyboard":
      return (
        <Win url="kllezo.studio · Storyboard" dark>
          <div className={s.sb}>
            <p className={cx(s.sbTitle, s.in)}>
              Concept · <b>“Built for desire”</b>
            </p>
            {(["01 · Wide — arrival", "02 · Detail — texture", "03 · Hero — reveal", "04 · Close — the promise"] as const).map((c, i) => (
              <div key={c} className={cx(s.sbFrame, s.pop)} style={d(0.3 + i * 0.25)}>
                <span>
                  <Shot {...F1(([0, 3, 1, 2] as const)[i])} />
                </span>
                <small>{c}</small>
              </div>
            ))}
          </div>
        </Win>
      );
    case "formatsReal":
      return (
        <div className={s.formats}>
          <span className={s.morph}>
            <Shot {...F1(1)} />
          </span>
          <div className={s.fmtChips}>
            {["16:9 · YouTube", "9:16 · Reels", "1:1 · Feed", "4:5 · Ads"].map((x, i) => (
              <Chip key={x} at={0.3 + i * 0.55}>
                {x}
              </Chip>
            ))}
          </div>
        </div>
      );
    case "timelineReal":
      return (
        <>
          <Win url="Premiere Pro · Hero_film_v3" dark>
            <Shot f="content/9.webp" />
            <i className={s.playhead} />
          </Win>
          <div className={s.doneRow}>
            {["Colour ✓", "Sound ✓", "Motion ✓"].map((x, i) => (
              <Chip key={x} at={1 + i * 0.35}>
                {x}
              </Chip>
            ))}
          </div>
        </>
      );
    case "gradeReal":
      return (
        <Win url="DaVinci · Grade" dark>
          <Shot {...F1(1)} />
          <span className={s.wipe}>
            <Shot {...F1(1)} />
          </span>
          <i className={s.wipeLine} />
          <em className={s.tagL}>LOG</em>
          <em className={s.tagR}>GRADED</em>
        </Win>
      );
    case "deliverFiles":
      return (
        <Win url="Deliverables · Hero film">
          <div className={s.files}>
            {["Master_4K.mp4", "Reel_9x16.mp4", "Feed_1x1.mp4", "Cutdown_15s.mp4", "Stills (24)"].map((f, i) => (
              <div key={f} className={cx(s.fileRow, s.in)} style={d(i * 0.2)}>
                <I n="file" z={12} />
                <b>{f}</b>
                <span className={s.prog}>
                  <i className={s.grow} style={d(0.3 + i * 0.25)} />
                </span>
                <Chip kind="ok" at={1.1 + i * 0.25}>
                  ✓
                </Chip>
              </div>
            ))}
            <Chip at={2.4} className={s.dl}>
              Ready to download
            </Chip>
          </div>
        </Win>
      );

    /* ═════════ ugc / ads ═════════ */
    case "adsFatigue":
      return (
        <Ads
          cols={["Ad", "Status", "Cost / result", "Frequency", "Trend"]}
          banner={
            <div className={cx(s.warn, s.in)} style={d(1.2)}>
              ⚠ Creative fatigue — results are dropping
            </div>
          }
          kpis={
            <div className={s.kpis}>
              {[
                ["Week 1", "₹96"],
                ["Week 2", "₹188"],
                ["Week 3", "₹412"],
              ].map(([k, val], i) => (
                <div key={k} className={cx(s.kpi, s.in)} style={d(0.2 + i * 0.2)}>
                  <small>{k} · cost/result</small>
                  <b className={i === 2 ? s.red : ""}>{val}</b>
                </div>
              ))}
            </div>
          }
          rows={[
            [
              <span key="a" className={s.adName}>
                <i className={s.adThumbMeh} /> Summer_v1
              </span>,
              <span key="b" className={s.dotGreen}>
                Active
              </span>,
              <b key="c" className={s.red}>
                ₹<Count to={412} at={0.3} />
              </b>,
              <b key="d" className={s.red}>
                <Count to={6.4} dec={1} at={0.3} />
              </b>,
              <Spark key="e" up={false} at={0.6} w={60} />,
            ],
          ]}
        />
      );
    case "adsOne":
      return (
        <>
          <Ads
            cols={["Ad", "Status", "Results", "Cost"]}
            rows={[
              [
                <span key="a" className={s.adName}>
                  <i className={s.adThumbMeh} /> Ad_v1_final
                </span>,
                <span key="b" className={s.dotGreen}>
                  Active
                </span>,
                "18",
                "₹340",
              ],
              ...Array.from({ length: 4 }, (_, i) => [
                <span key={`e${i}`} className={cx(s.adEmpty, s.in)} style={d(0.4 + i * 0.15)}>
                  + Add a variation
                </span>,
                "",
                "",
                "",
              ]),
            ]}
          />
          <Float at={1.4} x={312} y={262} w={150} kind="bad">
            <b>Nothing to compare it to</b>
          </Float>
        </>
      );
    case "feedSkip":
      return (
        <>
          <Phone x={-30}>
            <div className={s.feed}>
              <div className={s.feedFast}>
                {([F1(2), null, F1(0), null] as (Img | null)[]).map((img, i) => (
                  <div key={i} className={s.post}>
                    <IgHead name={img ? (i === 0 ? "traveldiaries" : "foodie.daily") : "yourbrand · Sponsored"} ring={!!img} />
                    <span className={cx(s.postImg, !img && s.polished)}>{img ? <Shot {...img} /> : <b>MEGA SALE · 50% OFF</b>}</span>
                  </div>
                ))}
              </div>
            </div>
          </Phone>
          <Float at={1.8} x={316} y={140} w={140} kind="bad">
            <small>Your ad</small>
            <b>Scrolled past in 0.8s</b>
          </Float>
        </>
      );
    case "adConfused":
      return (
        <>
          <Phone x={-30}>
            <IgHead name="yourbrand" ring={false} />
            <small className={s.sponsored}>Sponsored</small>
            <div className={cx(s.igImg, s.productMeh)}>
              <i />
              <b>The future of everyday living.</b>
            </div>
            <IgActions />
            <div className={s.comments}>
              {["what does this even do?", "price??", "is this a scam", "for men or women?"].map((c, i) => (
                <p key={c} className={s.in} style={d(0.6 + i * 0.4)}>
                  <b>{["rahul.k", "sneha_", "amit.v", "pooja"][i]}</b> {c}
                </p>
              ))}
            </div>
          </Phone>
          <Float at={2.2} x={316} y={140} w={136} kind="bad">
            <small>Purchases</small>
            <b className={s.bigBad}>0</b>
          </Float>
        </>
      );
    case "thumbLab":
      return (
        <>
          <Win url="kllezo.studio · Creative lab" dark>
            <Shot f="content/8.webp" />
          </Win>
          <Float at={1} x={300} y={262} w={164} kind="good">
            <small>Batch 07</small>
            <b>12 new creatives ready</b>
          </Float>
        </>
      );
    case "adsVariants":
      return (
        <Ads
          cols={["Hook", "Status", "Cost / result", "Results"]}
          rows={(["A", "B", "C", "D", "E", "F"] as const).map((h, i) => {
            const win = i === 1 || i === 4;
            return [
              <span key="a" className={s.adName}>
                <i className={s.adThumb}>
                  <Shot {...F1(([0, 1, 2, 3, 1, 0] as const)[i])} />
                </i>
                Hook {h}
              </span>,
              win ? (
                <Chip key="b" kind="ok" at={1.6 + i * 0.1}>
                  Winner
                </Chip>
              ) : (
                <span key="b" className={s.dotGreen}>
                  Active
                </span>
              ),
              <b key="c" className={win ? s.green : ""}>
                ₹{[180, 64, 210, 155, 71, 240][i]}
              </b>,
              <span key="d" className={s.resBar}>
                <i className={s.grow} style={d(0.3 + i * 0.12, { width: `${[30, 92, 22, 44, 84, 18][i]}%` })} />
              </span>,
            ];
          })}
        />
      );
    case "ugcNative":
      return (
        <>
          <Phone dark x={-30}>
            <div className={s.reel}>
              <Shot f="content/6.webp" size="380%" pos="64% 30%" />
              <p className={s.reelCap}>
                <b>@realcustomer</b>
                ok this actually changed my mornings
              </p>
              <div className={s.rail}>
                <span>
                  <I n="heart" z={18} fill className={s.liked} />
                  <small>
                    <Count to={18.2} dec={1} suf="K" at={0.6} />
                  </small>
                </span>
                <span>
                  <I n="chat" z={18} />
                  <small>342</small>
                </span>
                <span>
                  <I n="send" z={18} />
                </span>
              </div>
              {[0, 1, 2].map((i) => (
                <I key={i} n="heart" z={16} fill className={s.floatHeart} style={d(0.8 + i * 0.5, { left: `${130 + i * 8}px` })} />
              ))}
              <em className={cx(s.shopBtn, s.pop)} style={d(1.8)}>
                Shop now
              </em>
            </div>
          </Phone>
          <Float at={2.2} x={316} y={150} w={140} kind="good">
            <small>Watched to the end</small>
            <b className={s.bigGood}>92%</b>
          </Float>
        </>
      );
    case "demoReel":
      return (
        <>
          <Phone dark x={-30}>
            <div className={s.reel}>
              <Shot {...PERFUME} />
              {[
                ["Lasts 12 hours", "8%", "26%"],
                ["Travel size", "50%", "44%"],
                ["Free returns", "10%", "62%"],
              ].map(([t, x, y], i) => (
                <em key={t} className={cx(s.callout, s.pop)} style={d(0.5 + i * 0.5, { left: x, top: y })}>
                  {t}
                </em>
              ))}
              <em className={cx(s.shopBtn, s.pulse)}>Shop now →</em>
            </div>
          </Phone>
          <Float at={2.1} x={316} y={150} w={140} kind="good">
            <small>Understood in</small>
            <b className={s.bigGood}>3 sec</b>
          </Float>
        </>
      );

    /* ═════════ websites ═════════ */
    case "siteBounce":
      return (
        <>
          <Win url="your-business.com">
            <div className={s.dated}>
              <b className={s.serifOld}>Welcome to our Website!!</b>
              <div className={s.marquee}>
                <span>★ Best quality ★ Since 1998 ★ Call now ★</span>
              </div>
              <p>We are a leading company providing quality services to our valued customers.</p>
              <u>Home</u> <u>About us</u> <u>Services</u> <u>Contact (page 4)</u>
              <small className={s.counterOld}>Visitors: 000213</small>
            </div>
            <em className={s.rec}>● Session recording · visitor #1,204</em>
          </Win>
          <Cursor x0={200} y0={220} x1={440} y1={10} at={0.4} leave />
          <Float at={1.9} x={316} y={262} w={146} kind="bad">
            <small>Bounce rate</small>
            <b className={s.bigBad}>
              <Count to={78} at={2} suf="%" />
            </b>
          </Float>
        </>
      );
    case "safariSlow":
      return (
        <>
          <Phone x={-30}>
            <div className={s.safari}>
              <span className={s.safUrl}>
                <I n="lock" z={9} /> your-business.com
              </span>
              <i className={s.safProg} />
            </div>
            <div className={s.blank}>
              <i className={s.spinner} />
              <span />
              <span />
              <span />
            </div>
          </Phone>
          <Float at={0.6} x={316} y={110} w={140} kind="bad">
            <small>Still loading…</small>
            <b className={s.bigBad}>
              <Count to={4.8} dec={1} suf="s" at={0.6} dur={2.6} />
            </b>
          </Float>
          <Float at={2.4} x={316} y={226} w={140} kind="bad">
            <b>Visitor gave up</b>
          </Float>
        </>
      );
    case "siteReal":
    case "storeReal": {
      const store = v === "storeReal";
      return (
        <>
          <Win url={store ? "titan-fitness.store" : "aurelia-estates.com"}>
            <Shot {...SITE(store ? 3 : 1)} pan />
          </Win>
          <Float at={1.6} x={312} y={262} w={150} kind="good">
            <small>{store ? "Conversion rate" : "Enquiries"}</small>
            <b className={s.bigGood}>{store ? "↑ 2.3×" : "↑ every week"}</b>
          </Float>
        </>
      );
    }
    case "siteEnquiry":
      return (
        <>
          <Win url="the-culinary.co">
            <Shot {...SITE(2)} />
            <em className={cx(s.siteCta, s.pulse)}>Reserve a table</em>
          </Win>
          <Cursor x0={380} y0={80} x1={120} y1={250} at={0.3} />
          <Notif className={s.notifFloat} a="whatsapp" t="New reservation" b="Table for 4 · Saturday 8:00 PM" at={1.8} y={-24} />
        </>
      );
    case "lighthouse":
      return (
        <Win url="pagespeed.web.dev · Mobile">
          <div className={s.lh}>
            {(
              [
                ["Performance", 98],
                ["Accessibility", 100],
                ["Best practices", 100],
                ["SEO", 100],
              ] as [string, number][]
            ).map(([k, n], i) => (
              <div key={k} className={s.gaugeBox}>
                <svg viewBox="0 0 60 60" className={s.gauge}>
                  <circle cx="30" cy="30" r="25" className={s.gBg} />
                  <circle cx="30" cy="30" r="25" className={s.gFg} style={d(0.2 + i * 0.15, { "--v": n / 100 })} pathLength={1} />
                </svg>
                <b>
                  <Count to={n} at={0.2 + i * 0.15} />
                </b>
                <small>{k}</small>
              </div>
            ))}
            <Chip at={1.6} className={s.lhChip}>
              Loads in 0.9s on 4G
            </Chip>
          </div>
        </Win>
      );
    case "sitemap":
      return (
        <Board title="Sitemap">
          <svg className={s.lines} viewBox="0 0 424 290">
            {[86, 212, 338].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(0.3 + i * 0.15)} d={`M212 72 V104 H${x} V128`} />
            ))}
            {[50, 122, 302, 374].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(1 + i * 0.12)} d={`M${x < 212 ? 86 : 338} 158 V180 H${x} V200`} />
            ))}
          </svg>
          <span className={cx(s.node, s.nodeMain, s.pop)} style={{ left: 212, top: 58 }}>
            Home
          </span>
          {["Services", "Work", "Contact"].map((x, i) => (
            <span key={x} className={cx(s.node, s.pop)} style={d(0.5 + i * 0.15, { left: `${[86, 212, 338][i]}px`, top: "144px" })}>
              {x}
            </span>
          ))}
          {["Websites", "AI agents", "Case study", "Case study"].map((x, i) => (
            <span key={i} className={cx(s.node, s.nodeSm, s.pop)} style={d(1.2 + i * 0.12, { left: `${[50, 122, 302, 374][i]}px`, top: "214px" })}>
              {x}
            </span>
          ))}
        </Board>
      );
    case "figmaReal":
      return (
        <Win url="figma.com · Homepage" dark>
          <div className={s.fig}>
            <div className={s.figLayers}>
              {["Frame · Home", "Nav", "Hero", "Stats", "Featured", "Footer"].map((x, i) => (
                <span key={x} className={cx(i === 2 && s.figSel, s.in)} style={d(i * 0.08)}>
                  {x}
                </span>
              ))}
            </div>
            <div className={s.figCanvas}>
              <span className={cx(s.figFrame, s.pop)}>
                <Shot {...SITE(5)} />
                <i className={s.figBox} />
              </span>
              <em className={cx(s.figName, s.in)} style={d(1)}>
                Kllezo design
              </em>
            </div>
          </div>
        </Win>
      );
    case "code":
      return (
        <Win url="VS Code · app/page.tsx" dark>
          <div className={s.editor}>
            {[
              ["export default function", "Home", "() {"],
              ["  return <Hero", " title=", "\"Book direct\" />"],
              ["  <Services", " items=", "{services} />"],
              ["  <Enquiry", " to=", "\"whatsapp\" />"],
              ["}", "", ""],
            ].map((ln, i) => (
              <p key={i}>
                <span className={s.ln}>{i + 1}</span>
                <Typed at={0.2 + i * 0.4} n={34} t={0.4}>
                  <b>{ln[0]}</b> <i>{ln[1]}</i>
                  <u>{ln[2]}</u>
                </Typed>
              </p>
            ))}
            <div className={cx(s.term, s.in)} style={d(2.2)}>
              <span>$ npm run build</span>
              <b>✓ Compiled · 22 pages · 0 errors</b>
            </div>
          </div>
        </Win>
      );
    case "deployLive":
      return (
        <Win url="vercel.com · Deployments">
          <div className={s.deploy}>
            {["Cloning repository", "Installing dependencies", "Building pages", "Deploying to edge"].map((x, i) => (
              <p key={x} className={s.in} style={d(0.2 + i * 0.35)}>
                <i className={cx(s.pop, s.okDot)} style={d(0.4 + i * 0.35)}>
                  ✓
                </i>
                {x}
              </p>
            ))}
            <div className={cx(s.ready, s.pop)} style={d(1.8)}>
              <i className={s.liveDot} />
              <b>Ready</b>
              <span>your-business.com</span>
              <Chip at={2}>Live</Chip>
            </div>
          </div>
        </Win>
      );

    /* ═════════ e-commerce ═════════ */
    case "storeGeneric":
      return (
        <>
          <Win url="my-store.mytemplate.com">
            <div className={s.tpl}>
              <div className={s.tplNav}>
                <b>MY STORE</b>
                <span>Home · Shop · Contact</span>
              </div>
              <p className={s.tplHero}>Welcome to my store</p>
              <div className={s.tplGrid}>
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i} className={s.in} style={d(0.2 + i * 0.12)}>
                    <i />
                    <small>Product {i + 1}</small>
                    <b>₹999</b>
                  </span>
                ))}
              </div>
            </div>
          </Win>
          <Float at={1.5} x={300} y={262} w={164} kind="bad">
            <b>Looks like 10,000 other stores</b>
          </Float>
        </>
      );
    case "checkoutDrop":
      return (
        <>
          <Phone x={-36}>
            <div className={s.co}>
              <b className={s.coH}>Checkout</b>
              <div className={s.coSteps}>
                <span className={s.on}>Cart</span>
                <span className={s.on}>Address</span>
                <span>Payment</span>
              </div>
              <div className={s.coLine}>
                <span>Subtotal</span>
                <b>₹4,131</b>
              </div>
              <div className={cx(s.coLine, s.in)} style={d(0.8)}>
                <span>Shipping</span>
                <b className={s.red}>+ ₹149</b>
              </div>
              <div className={cx(s.modal, s.pop)} style={d(1.3)}>
                <b>Create an account to continue</b>
                <span />
                <span />
                <em>Sign up</em>
              </div>
            </div>
          </Phone>
          <Cursor x0={230} y0={260} x1={460} y1={20} at={1.8} leave />
          <Notif className={s.notifFloat} a="store" t="Cart abandoned" b="₹4,280 · left at payment" at={2.4} y={-24} />
        </>
      );
    case "silosApps":
      return (
        <>
          <Win url="Stock.xlsx" w={210} x={-120} y={40} h={150}>
            <div className={s.sheet} style={{ gridTemplateColumns: "1.4fr 1fr" }}>
              {["Item", "Stock", "Ring S", "4", "Ring M", "-3", "Bag", "12", "Belt", "0"].map((c, i) => (
                <span key={i} className={cx(i < 2 && s.th, c === "-3" && s.cellBad)}>
                  {c}
                </span>
              ))}
            </div>
          </Win>
          <Win url="WhatsApp · Orders" w={190} x={110} y={24} h={130}>
            <div className={s.miniChat}>
              <p className={s.in} style={d(0.4)}>
                Is Ring M available?
              </p>
              <p className={cx(s.me, s.in)} style={d(0.8)}>
                Yes! Sending link
              </p>
              <p className={s.in} style={d(1.2)}>
                Paid ✓ 2 pieces
              </p>
            </div>
          </Win>
          <Win url="courier · Tracking" w={220} x={-10} y={214} h={80}>
            <div className={s.track}>
              <b>AWB 88213…</b>
              <span className={s.red}>Status: not found</span>
            </div>
          </Win>
          <Float at={1.6} x={340} y={214} w={124} kind="bad">
            <b>Sold stock you don&apos;t have</b>
          </Float>
        </>
      );
    case "checkoutGood":
      return (
        <>
          <Phone x={-36}>
            <div className={s.co}>
              <b className={s.coH}>Checkout</b>
              <div className={s.coItem}>
                <span>
                  <Shot {...PERFUME} />
                </span>
                <div>
                  <b>Noir Eau de Parfum</b>
                  <small>50 ml · ₹4,131</small>
                </div>
              </div>
              <div className={s.coLine}>
                <span>Deliver to</span>
                <b>Home · saved ✓</b>
              </div>
              <div className={s.coLine}>
                <span>Shipping</span>
                <b className={s.green}>Free</b>
              </div>
              <em className={cx(s.payBtn, s.press)}>Pay ₹4,131</em>
              <div className={cx(s.confirmed, s.pop)} style={d(1.6)}>
                <I n="check" z={22} />
                <b>Order confirmed</b>
                <small>#1042 · arriving Thursday</small>
              </div>
            </div>
          </Phone>
          <Notif className={s.notifFloat} a="store" t="New order" b="₹4,131 · paid · stock updated" at={2.1} y={-24} />
        </>
      );
    case "connectedApps": {
      const nodes: [string, string][] =
        alt === "chat"
          ? [
              ["whatsapp", "WhatsApp"],
              ["instagram", "Instagram"],
              ["calendar", "Calendar"],
              ["crm", "CRM"],
            ]
          : calls
            ? [
                ["phone", "Phone line"],
                ["team", "Your team"],
                ["calendar", "Calendar"],
                ["crm", "CRM"],
              ]
            : [
                ["store", "Store"],
                ["card", "Payments"],
                ["truck", "Shipping"],
                ["sheets", "Stock"],
              ];
      const pos = [
        [-150, -100],
        [150, -100],
        [-150, 100],
        [150, 100],
      ];
      return (
        <div className={s.hubWrap}>
          <svg className={s.lines} viewBox="-240 -180 480 360">
            {pos.map(([x, y], i) => (
              <line key={i} className={s.draw} pathLength={1} style={d(0.3 + i * 0.15)} x1="0" y1="0" x2={x} y2={y} />
            ))}
          </svg>
          <span className={cx(s.hub, s.pop)}>
            <App a="kllezo" z={56} />
          </span>
          {pos.map(([x, y], i) => (
            <span key={i}>
              <span className={cx(s.hubNode, s.pop)} style={d(0.5 + i * 0.15, { "--x": `${x}px`, "--y": `${y}px` })}>
                <App a={nodes[i][0]} z={30} />
                <b>{nodes[i][1]}</b>
                <small className={s.synced}>● synced</small>
              </span>
              <i className={s.flowDot} style={d(1.2 + i * 0.3, { "--x": `${x}px`, "--y": `${y}px` })} />
            </span>
          ))}
        </div>
      );
    }
    case "catalogue":
      return (
        <Win url="Store admin · Products">
          <div className={s.admin}>
            <div className={s.adminTh}>
              <span>Product</span>
              <span>Category</span>
              <span>Stock</span>
            </div>
            {(
              [
                [PERFUME, "Noir Eau de Parfum", "Fragrance", 42],
                [F1(3), "Gold Signet Ring", "Jewellery", 18],
                [F1(0), "Travel Duffel", "Bags", 9],
                [PODCAST, "Studio Mic Kit", "Audio", 26],
              ] as [Img, string, string, number][]
            ).map(([img, n, c, st], i) => (
              <div key={n} className={cx(s.adminRow, s.in)} style={d(0.2 + i * 0.2)}>
                <span className={s.adminP}>
                  <i>
                    <Shot {...img} />
                  </i>
                  {n}
                </span>
                <span>
                  <Chip at={0.6 + i * 0.2} kind="soft">
                    {c}
                  </Chip>
                </span>
                <b>{st}</b>
              </div>
            ))}
          </div>
        </Win>
      );
    case "account":
      return (
        <>
          <Phone x={-30}>
            <div className={s.co}>
              <b className={s.coH}>My orders</b>
              <div className={s.coItem}>
                <span>
                  <Shot {...PERFUME} />
                </span>
                <div>
                  <b>Order #1042</b>
                  <small>Noir Eau de Parfum</small>
                </div>
              </div>
              <div className={s.trackline}>
                {["Ordered", "Packed", "Shipped", "Out for delivery"].map((x, i) => (
                  <p key={x} className={cx(s.in, i < 3 && s.tlDone)} style={d(0.3 + i * 0.3)}>
                    <i />
                    {x}
                  </p>
                ))}
              </div>
            </div>
          </Phone>
          <Notif className={s.notifFloat} a="truck" t="Out for delivery" b="Your order arrives today" at={1.8} y={-24} />
        </>
      );

    /* ═════════ lead generation ═════════ */
    case "adsSpend":
      return (
        <Ads
          title="Campaign · Spring leads"
          cols={["Campaign", "Spend", "Clicks", "Leads"]}
          kpis={
            <div className={s.kpis}>
              <div className={cx(s.kpi, s.in)}>
                <small>Amount spent</small>
                <b>
                  ₹<Count to={48200} at={0.2} />
                </b>
              </div>
              <div className={cx(s.kpi, s.in)} style={d(0.15)}>
                <small>Link clicks</small>
                <b>
                  <Count to={3912} at={0.3} />
                </b>
              </div>
              <div className={cx(s.kpi, s.kpiBad, s.in)} style={d(0.3)}>
                <small>Enquiries</small>
                <b className={s.red}>0</b>
              </div>
            </div>
          }
          rows={[
            ["Spring_broad", "₹31,400", "2,610", <b key="l" className={s.red}>0</b>],
            ["Spring_retarget", "₹16,800", "1,302", <b key="l" className={s.red}>0</b>],
          ]}
        />
      );
    case "inboxJunk":
      return (
        <>
          <Phone x={-30}>
            <div className={s.mailHead}>
              <b>Inbox</b>
              <small>Website form</small>
            </div>
            {["“hi”", "price??", "just browsing", "asdfgh", "call me (no number)"].map((b, i) => (
              <div key={i} className={cx(s.mailRow, s.in)} style={d(0.2 + i * 0.25)}>
                <i />
                <span>
                  <b>Website form</b>
                  <small>{b}</small>
                </span>
                <Chip kind="no" at={0.5 + i * 0.25}>
                  Not ready
                </Chip>
              </div>
            ))}
          </Phone>
          <Float at={1.9} x={316} y={150} w={140} kind="bad">
            <small>Worth a call</small>
            <b className={s.bigBad}>1 in 9</b>
          </Float>
        </>
      );
    case "formVoid":
      return (
        <>
          <Win url="your-business.com/contact" x={-50} w={330}>
            <div className={s.form}>
              <b>Get a quote</b>
              <span>Priya Sharma</span>
              <span>priya@email.com</span>
              <span>Looking to start next month…</span>
              <em>Send</em>
              <div className={cx(s.thanks, s.pop)} style={d(0.9)}>
                ✓ Thanks! We&apos;ll be in touch.
              </div>
            </div>
          </Win>
          <span className={s.flyMail} style={d(1.3)}>
            <I n="mail" z={26} />
          </span>
          <Float at={1.6} x={330} y={80} w={130} kind="bad">
            <small>info@ inbox</small>
            <b className={s.bigBad}>
              <Count to={214} at={1.6} />
            </b>
            <small>unread</small>
          </Float>
          <Float at={2.4} x={330} y={232} w={130} kind="bad">
            <b>3 days later · no reply</b>
          </Float>
        </>
      );
    case "sheetMess":
      return (
        <Win url="Leads_2025_FINAL(2).xlsx">
          <div className={s.sheet} style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr" }}>
            {["Name", "Phone", "Source", "Status"].map((c) => (
              <span key={c} className={s.th}>
                {c}
              </span>
            ))}
            {[
              ["Priya S.", "98•••21", "??", "called?"],
              ["Arjun", "—", "facebook?", ""],
              ["Neha K.", "99•••04", "unknown", "lost"],
              ["Rohit", "97•••88", "google or insta", "??"],
              ["Meera", "", "—", ""],
            ].flatMap((r, i) =>
              r.map((c, j) => (
                <span key={`${i}${j}`} className={cx(s.in, j === 2 && s.cellBad)} style={d(0.2 + i * 0.2)}>
                  {c}
                </span>
              )),
            )}
          </div>
          <Chip kind="no" at={1.6} className={s.cornerChip}>
            Which campaign worked?
          </Chip>
        </Win>
      );
    case "landingReal":
      return (
        <>
          <Phone x={-30}>
            <div className={s.landing}>
              <span className={s.landImg}>
                <Shot {...SITE(6)} />
              </span>
              <b>Get your free consultation</b>
              <small>Reply within 10 minutes, 7 days a week.</small>
              <em className={cx(s.landBtn, s.pulse)}>Book my consultation</em>
              <div className={s.sheetUp} style={d(1.6)}>
                <b>Almost done</b>
                <span>Your name</span>
                <span>WhatsApp number</span>
                <em>Confirm</em>
              </div>
            </div>
          </Phone>
          <Cursor x0={330} y0={60} x1={232} y1={262} at={0.4} />
        </>
      );
    case "qualifyForm":
      return (
        <>
          <Phone x={-30}>
            <div className={s.qf}>
              <i className={s.qfBar}>
                <i className={s.grow} style={d(0.3)} />
              </i>
              <b>What&apos;s your budget?</b>
              <div className={s.qfOpts}>
                {["Under ₹1L", "₹1–5L", "₹5–10L", "₹10L+"].map((o, i) => (
                  <span key={o} className={i === 2 ? s.lit : ""} style={d(0.7)}>
                    {o}
                  </span>
                ))}
              </div>
              <b>When do you want to start?</b>
              <div className={s.qfOpts}>
                {["This month", "In 3 months", "Just looking"].map((o, i) => (
                  <span key={o} className={i === 0 ? s.lit : ""} style={d(1.2)}>
                    {o}
                  </span>
                ))}
              </div>
              <div className={cx(s.qfOk, s.pop)} style={d(1.8)}>
                ✓ Qualified · sending to your team
              </div>
            </div>
          </Phone>
          <Float at={2.2} x={316} y={150} w={140} kind="good">
            <small>Lead score</small>
            <b className={s.bigGood}>Hot</b>
          </Float>
        </>
      );
    case "waLead":
      return (
        <WaChat
          name="Kllezo Leads"
          sub="business account"
          av="#09453E"
          msgs={[
            { sys: true, t: "Today", at: 0 },
            {
              at: 0.4,
              time: "10:02",
              card: (
                <div className={s.leadCard}>
                  <b>New qualified lead</b>
                  <span>Priya Sharma</span>
                  <span>Budget · ₹5–10L</span>
                  <span>Wants a call · Tue 4 PM</span>
                  <span>Source · Meta · Campaign B</span>
                </div>
              ),
            },
            {
              at: 1.4,
              time: "10:02",
              card: (
                <div className={s.quick}>
                  <em>Call now</em>
                  <em>Assign</em>
                </div>
              ),
            },
            { me: true, at: 2.1, t: "Calling her now 👍", time: "10:03" },
          ]}
        />
      );
    case "funnelTracked":
      return (
        <Win url="kllezo.studio · Lead funnel">
          <div className={s.funnel}>
            {(
              [
                ["Ad clicks", 3912, 100],
                ["Page views", 3140, 80],
                ["Form starts", 610, 44],
                ["Enquiries", 214, 26],
              ] as [string, number, number][]
            ).map(([k, n, w], i) => (
              <div key={k} className={s.fRowF}>
                <small>{k}</small>
                <span className={s.fBar}>
                  <i className={s.grow} style={d(0.2 + i * 0.2, { width: `${w}%` })} />
                </span>
                <b>
                  <Count to={n} at={0.2 + i * 0.2} />
                </b>
              </div>
            ))}
            <div className={cx(s.srcRow, s.pop)} style={d(1.4)}>
              <span>Best source</span>
              <b>Meta · Campaign B</b>
              <Chip at={1.6}>41% of enquiries</Chip>
            </div>
          </div>
        </Win>
      );
    case "abTest":
      return (
        <Win url="kllezo.studio · A/B test">
          <div className={s.ab}>
            {(
              [
                ["A", 3.1, 6],
                ["B", 5.8, 5],
              ] as [string, number, number][]
            ).map(([k, r, n], i) => (
              <div key={k} className={cx(s.abCard, i === 1 && s.abWin, s.in)} style={d(i * 0.2)}>
                <span>
                  <Shot {...SITE(n)} />
                </span>
                <b>Variant {k}</b>
                <i className={s.abBar}>
                  <i className={s.grow} style={d(0.5 + i * 0.2, { width: `${r * 14}%` })} />
                </i>
                <small>
                  <Count to={r} dec={1} at={0.5 + i * 0.2} suf="% convert" />
                </small>
                {i === 1 && <Chip at={1.6}>Winner</Chip>}
              </div>
            ))}
          </div>
        </Win>
      );

    /* ═════════ AI texting ═════════ */
    case "waUnread":
      return (
        <>
          <WaList
            x={-30}
            rows={[
              { n: "Aisha", m: "Is Saturday free for 6?", t: "2h", badge: 2, at: 0.2 },
              { n: "Rohan", m: "What's the price for 4 people?", t: "5h", badge: 1, at: 0.4 },
              { n: "Meera", m: "Do you deliver to Banjara Hills?", t: "9h", badge: 3, at: 0.6 },
              { n: "Imran", m: "Can I book for today?", t: "Yesterday", badge: 1, at: 0.8 },
              { n: "+91 98•• ••221", m: "Hello?", t: "Yesterday", badge: 2, at: 1 },
            ]}
          />
          <Float at={1.7} x={316} y={150} w={140} kind="bad">
            <small>Average reply time</small>
            <b className={s.bigBad}>6 hrs</b>
          </Float>
        </>
      );
    case "waCold":
      return (
        <WaChat
          name="Karthik"
          sub="last seen yesterday"
          msgs={[
            { sys: true, t: "Monday", at: 0 },
            { t: "Hi, interested in booking for 6 people this weekend", at: 0.2, time: "11:02" },
            { t: "Hello?", at: 0.7, time: "13:40" },
            { sys: true, t: "Wednesday", at: 1.1 },
            { t: "Never mind, found another place", at: 1.4, time: "09:15" },
            { me: true, t: "Hi! Sorry for the delay, yes we have…", at: 2, time: "18:22", tick: "sent" },
          ]}
        />
      );
    case "waRepeat":
      return (
        <>
          <WaList
            x={-30}
            rows={[
              { n: "Sana", m: "What are your timings?", t: "10:41", badge: 1, at: 0.2 },
              { n: "Vikram", m: "What are your timings?", t: "10:38", badge: 1, at: 0.35 },
              { n: "Divya", m: "timings pls", t: "10:31", badge: 1, at: 0.5 },
              { n: "Arjun", m: "Are you open Sunday? Timings?", t: "10:22", badge: 2, at: 0.65 },
              { n: "Neha", m: "What are your timings?", t: "10:15", badge: 1, at: 0.8 },
            ]}
          />
          <Float at={1.5} x={316} y={150} w={140} kind="bad">
            <small>Same question today</small>
            <b className={s.bigBad}>×47</b>
          </Float>
        </>
      );
    case "waPingPong":
      return (
        <WaChat
          name="Sneha"
          msgs={[
            { t: "Can I book Tuesday 4pm?", at: 0, time: "10:02" },
            { me: true, t: "Sorry, full. Wednesday?", at: 0.4, time: "12:30" },
            { t: "Can't do Wed. Thursday?", at: 0.8, time: "15:11" },
            { me: true, t: "Thursday morning only…", at: 1.2, time: "18:45" },
            { t: "Hmm, I'll check and get back", at: 1.6, time: "21:03" },
            { sys: true, t: "3 days · still not booked", at: 2 },
          ]}
        />
      );
    case "waInstant":
      return (
        <>
          <WaChat
            name="Your Business"
            sub="business account"
            av="#09453E"
            time="2:14"
            msgs={[
              { me: true, t: "Hi! Table for 4 on Saturday?", at: 0.2, time: "2:14" },
              { typing: 0.8, at: 0.7 },
              { t: "Yes — 7:30 PM is free. Shall I book it under your name?", at: 1.5, time: "2:14" },
              {
                at: 1.9,
                time: "2:14",
                card: (
                  <div className={s.quick}>
                    <em>Book 7:30</em>
                    <em>Other time</em>
                  </div>
                ),
              },
            ]}
          />
          <Float at={2.2} x={16} y={130} w={124} kind="good">
            <small>Replied in</small>
            <b className={s.bigGood}>4 sec</b>
          </Float>
        </>
      );
    case "waQualify":
      return (
        <WaChat
          name="Your Business"
          sub="business account"
          av="#09453E"
          msgs={[
            { me: true, t: "Interested in a party booking", at: 0.1, time: "16:20" },
            { t: "Lovely! How many guests, which date, and budget per person?", at: 0.5, time: "16:20" },
            { me: true, t: "Around 40, on 21 June, ₹1,500 each", at: 1, time: "16:21" },
            {
              at: 2,
              time: "16:21",
              card: (
                <div className={s.leadCard}>
                  <b>✓ Qualified · handed to your team</b>
                  <span>40 guests · 21 June · ₹60K</span>
                </div>
              ),
            },
          ]}
        />
      );
    case "waFollow":
      return (
        <WaChat
          name="Your Business"
          sub="business account"
          av="#09453E"
          msgs={[
            { sys: true, t: "Day 1", at: 0 },
            { t: "Hi Karthik! Still planning the weekend dinner? Saturday has 2 tables left.", at: 0.3, time: "11:00" },
            { sys: true, t: "Day 3", at: 0.9 },
            { t: "Quick one — shall I hold a table for 6 at 8 PM?", at: 1.2, time: "11:00" },
            { me: true, t: "Yes please! Let's book 🙌", at: 1.8, time: "11:04" },
          ]}
        />
      );
    case "waBooked":
      return (
        <>
          <WaChat
            name="Your Business"
            sub="business account"
            av="#09453E"
            x={-30}
            msgs={[
              { t: "You're booked ✅", at: 0.1, time: "18:30" },
              {
                at: 0.5,
                time: "18:30",
                card: (
                  <div className={s.bookCard}>
                    <i>
                      <b>SAT</b>
                      <span>21</span>
                    </i>
                    <div>
                      <b>Table for 4</b>
                      <small>8:00 PM · Indoor</small>
                    </div>
                  </div>
                ),
              },
              { sys: true, t: "Friday", at: 1.2 },
              { t: "Reminder: see you tomorrow at 8 PM! Reply C to change.", at: 1.4, time: "10:00" },
              { me: true, t: "See you there!", at: 2, time: "10:02" },
            ]}
          />
          <Float at={2.3} x={316} y={150} w={140} kind="good">
            <small>No-shows</small>
            <b className={s.bigGood}>↓ 60%</b>
          </Float>
        </>
      );
    case "flow":
      return (
        <Board title="Conversation map">
          <svg className={s.lines} viewBox="0 0 424 290">
            {[90, 212, 334].map((x, i) => (
              <path key={x} className={s.draw} pathLength={1} style={d(0.4 + i * 0.2)} d={`M212 86 C212 140 ${x} 120 ${x} 168`} />
            ))}
          </svg>
          <span className={cx(s.bubbleNode, s.pop)} style={{ left: 212, top: 64 }}>
            “Hi! Quick question…”
          </span>
          {[
            ["Prices", "Send the price list"],
            ["Book a table", "Check calendar → confirm"],
            ["Complaint", "Hand to a human"],
          ].map(([a, b], i) => (
            <span key={a} className={cx(s.flowCard, s.pop)} style={d(0.8 + i * 0.2, { left: `${[90, 212, 334][i]}px`, top: "198px" })}>
              <b>{a}</b>
              <small>{b}</small>
            </span>
          ))}
        </Board>
      );
    case "train":
      return (
        <Win url="Agent · Knowledge base">
          <div className={s.files}>
            {["FAQs.pdf", "Price list.xlsx", "Menu 2025.pdf", "Tone of voice.doc", "Booking rules.doc"].map((f, i) => (
              <div key={f} className={cx(s.fileRow, s.in)} style={d(i * 0.2)}>
                <I n="file" z={12} />
                <b>{f}</b>
                <span className={s.prog}>
                  <i className={s.grow} style={d(0.2 + i * 0.25)} />
                </span>
                <Chip kind="ok" at={1 + i * 0.25}>
                  Learned
                </Chip>
              </div>
            ))}
            <Chip at={2.4} className={s.dl}>
              Agent trained on your business ✓
            </Chip>
          </div>
        </Win>
      );
    case "testRun":
      return (
        <Win url="Agent · Test suite" dark>
          <div className={s.console}>
            {(calls
              ? ["Caller asks for prices", "Caller wants to book", "Caller is upset", "Call after hours", "Caller asks for a person"]
              : ["Customer asks for prices", "Customer wants to book", "Customer is upset", "Message at 2am", "Asks for a human"]
            ).map((t, i) => (
              <p key={t} className={s.in} style={d(0.2 + i * 0.35)}>
                <span>▸ {t}</span>
                <b className={s.pop} style={d(0.45 + i * 0.35)}>
                  PASS
                </b>
              </p>
            ))}
            <p className={cx(s.sum, s.in)} style={d(2.2)}>
              48 / 48 scenarios passed ✓
            </p>
          </div>
        </Win>
      );
    case "convoLog":
      return (
        <Win url="kllezo.studio · Conversations">
          <div className={s.dash}>
            <div className={s.kpis}>
              {(
                [
                  ["Handled", <Count key="a" to={1284} at={0.2} />],
                  ["Booked", <Count key="b" to={312} at={0.3} />],
                  ["Avg reply", "4s"],
                ] as [string, ReactNode][]
              ).map(([k, val], i) => (
                <div key={k} className={cx(s.kpi, s.in)} style={d(i * 0.12)}>
                  <small>{k}</small>
                  <b>{val}</b>
                </div>
              ))}
            </div>
            {[
              ["Aisha", "Table for 6 · Sat", "Booked"],
              ["Rohan", "Price for 4", "Answered"],
              ["Meera", "Delivery area", "Answered"],
              ["Imran", "Wants the manager", "Handed over"],
            ].map(([n, t, st], i) => (
              <div key={n} className={cx(s.logRow, s.in)} style={d(0.6 + i * 0.2)}>
                <b>{n}</b>
                <span>{t}</span>
                <Chip kind={st === "Booked" ? "ok" : "soft"} at={0.8 + i * 0.2}>
                  {st}
                </Chip>
              </div>
            ))}
          </div>
        </Win>
      );

    /* ═════════ AI calling ═════════ */
    case "iosMissed":
      return (
        <>
          <Phone x={-30} time="07:12">
            <div className={s.recHead}>
              <b>Recents</b>
              <span>
                <em>All</em>
                <em className={s.on}>Missed</em>
              </span>
            </div>
            {[
              ["+91 98•• ••221", "22:41"],
              ["New caller", "23:05"],
              ["+91 90•• ••118 (2)", "06:48"],
              ["Customer", "07:12"],
            ].map(([n, t], i) => (
              <div key={i} className={cx(s.recRow, s.in)} style={d(0.2 + i * 0.3)}>
                <span>
                  <b className={s.red}>{n}</b>
                  <small>mobile</small>
                </span>
                <small>{t}</small>
              </div>
            ))}
          </Phone>
          <Float at={1.6} x={316} y={150} w={140} kind="bad">
            <small>Missed overnight</small>
            <b className={s.bigBad}>5</b>
          </Float>
        </>
      );
    case "callQueue":
      return (
        <>
          <Phone dark x={-30}>
            <div className={s.incall}>
              <small>Customer</small>
              <b>
                03:<Count to={12} at={0} dur={2.4} />
              </b>
              <div className={s.callBtns}>
                {Array.from({ length: 6 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <span className={s.endBtn}>
                <I n="phone" z={18} fill />
              </span>
            </div>
            <Notif a="phone" t="Call waiting" b="3 more callers on hold" at={0.8} y={0} />
          </Phone>
          <Float at={1.5} x={316} y={140} w={140} kind="bad">
            <small>Asked today</small>
            <b>“What are your timings?” ×31</b>
          </Float>
        </>
      );
    case "callbackList":
      return (
        <>
          <Phone x={-30}>
            <div className={s.remHead}>
              <b>Call back</b>
              <small>5 overdue</small>
            </div>
            {[
              ["Call back Priya", "Mon · enquiry form"],
              ["Call back Arjun", "Tue · missed call"],
              ["Call back Neha", "Tue · website"],
              ["Call back Rahul", "Wed · Instagram"],
              ["Call back Sana", "Thu · referral"],
            ].map(([t, b], i) => (
              <div key={t} className={cx(s.remRow, s.in)} style={d(0.2 + i * 0.2)}>
                <i />
                <span>
                  <b>{t}</b>
                  <small className={s.red}>{b} · overdue</small>
                </span>
              </div>
            ))}
          </Phone>
          <Float at={1.6} x={316} y={150} w={140} kind="bad">
            <b>Each one called a competitor instead</b>
          </Float>
        </>
      );
    case "calNoShow":
      return (
        <>
          <Phone x={-30}>
            <div className={s.calHead}>
              <b>Tuesday</b>
              <small>10 June</small>
            </div>
            <div className={cx(s.calEv, s.in)}>
              <i />
              <div>
                <b>Consultation · Ravi</b>
                <small>10:00 – 10:30</small>
                <small>No reminder sent</small>
              </div>
            </div>
            <em className={cx(s.stamp, s.pop)} style={d(1)}>
              No-show
            </em>
          </Phone>
          <Float at={1.6} x={316} y={150} w={140} kind="bad">
            <small>Lost this month</small>
            <b className={s.bigBad}>9 slots</b>
          </Float>
        </>
      );
    case "callAnswered":
      return (
        <>
          <Win url="Kllezo · AI voice agent" dark x={-56} w={300} h={300}>
            <Shot f="calling-agent-1.webp" />
          </Win>
          <Float at={0.8} x={318} y={80} w={146} kind="good">
            <small>Answered in</small>
            <b className={s.bigGood}>1 ring</b>
            <small>2:14 AM · Sunday</small>
          </Float>
          <Float at={1.5} x={318} y={212} w={146} kind="good">
            <small>Missed calls this week</small>
            <b className={s.bigGood}>0</b>
          </Float>
        </>
      );
    case "callTranscript":
      return (
        <>
          <Win url="Kllezo · Live transcript" dark x={-56} w={300} h={300}>
            <Shot f="calling-agent-1.webp" className={s.dim} />
            <div className={s.transcript}>
              <p className={s.in} style={d(0.3)}>
                <b>Caller</b> I need a quote for a full renovation.
              </p>
              <p className={cx(s.ai, s.in)} style={d(1)}>
                <b>Agent</b> Happy to help — connecting you to our sales lead now.
              </p>
            </div>
          </Win>
          <Float at={1.8} x={318} y={140} w={146} kind="good">
            <small>Routed to</small>
            <b>Sales team ✓</b>
          </Float>
        </>
      );
    case "outboundCalls":
      return (
        <>
          <Phone x={-30}>
            <div className={s.recHead}>
              <b>AI follow-ups</b>
              <span>
                <em className={s.on}>Today</em>
              </span>
            </div>
            {[
              ["Priya · new lead", "2m 14s", "Booked ✓"],
              ["Arjun · form", "1m 40s", "Call Tue"],
              ["Neha · website", "3m 02s", "Booked ✓"],
              ["Rahul · Instagram", "0m 55s", "Not now"],
            ].map(([n, t, st], i) => (
              <div key={n} className={cx(s.recRow, s.in)} style={d(0.2 + i * 0.3)}>
                <span>
                  <b>{n}</b>
                  <small>outgoing · {t}</small>
                </span>
                <Chip kind={st.startsWith("Booked") ? "ok" : "soft"} at={0.5 + i * 0.3}>
                  {st}
                </Chip>
              </div>
            ))}
          </Phone>
          <Float at={1.8} x={316} y={150} w={140} kind="good">
            <small>Called back within</small>
            <b className={s.bigGood}>5 min</b>
          </Float>
        </>
      );
    case "callBooked":
      return (
        <>
          <Win url="Kllezo · Appointment" dark x={-56} w={300} h={300}>
            <Shot f="calling-agent-3.webp" />
          </Win>
          <Notif className={s.notifFloat} a="messages" t="Reminder" b="Your appointment is tomorrow at 3:00 PM" at={1.4} y={-24} />
          <Float at={2} x={318} y={212} w={146} kind="good">
            <small>Show-up rate</small>
            <b className={s.bigGood}>↑ 94%</b>
          </Float>
        </>
      );
    case "voice":
      return (
        <Win url="Agent · Voice settings">
          <div className={s.voice}>
            <div className={s.voices}>
              {["Aria · warm", "Dev · calm", "Meera · bright"].map((x, i) => (
                <span key={x} className={cx(s.in, i === 0 && s.voiceOn)} style={d(i * 0.15)}>
                  <I n="mic" z={12} /> {x}
                </span>
              ))}
            </div>
            <span className={s.waveBig}>
              {Array.from({ length: 34 }, (_, i) => (
                <i key={i} style={{ animationDelay: `${(i % 7) * -0.1}s` }} />
              ))}
            </span>
            {["Warmth", "Pace", "Formality"].map((x, i) => (
              <div key={x} className={s.slider}>
                <small>{x}</small>
                <span>
                  <i style={d(0.3 + i * 0.2, { "--to": ["78%", "45%", "30%"][i] })} />
                </span>
              </div>
            ))}
          </div>
        </Win>
      );
    default:
      return null;
  }
}
