"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconBrowser, IconChat, IconMegaphone, IconPhone, IconCheck } from "./icons";
import s from "./SolutionSwitcher.module.css";

/* Problem → solved, shown not told. Pick a problem; the panel shows that problem
   as a live interface. Drag the line (or let it play) to see the same interface
   after Kllezo. Under it: the fix in four words a step. Mock-ups are illustrative. */

type Item = {
  id: string;
  icon: (p: { size?: number }) => React.ReactElement;
  problem: string;
  fix: string;
  steps: string[];
  wins: string[];
  href: string;
};

const ITEMS: Item[] = [
  {
    id: "content",
    icon: IconMegaphone,
    problem: "Content that gets no enquiries",
    fix: "Content Growth System",
    steps: ["Research", "Strategy", "Monthly calendar", "Produce & optimise"],
    wins: ["Planned calendar", "Steady short-form video", "Monthly report"],
    href: "/business/services/content-growth",
  },
  {
    id: "website",
    icon: IconBrowser,
    problem: "A website people leave",
    fix: "Business & Lead Generation Websites",
    steps: ["Map the journey", "Design to convert", "Build fast", "Track every step"],
    wins: ["One clear call to action", "Fast on mobile", "Enquiries tracked"],
    href: "/business/services/business-website",
  },
  {
    id: "texting",
    icon: IconChat,
    problem: "Messages waiting hours",
    fix: "AI Texting Agents",
    steps: ["Connect channels", "Train on your business", "Qualify & book", "Hand over to your team"],
    wins: ["Replies in seconds", "24/7 on WhatsApp & Instagram", "Bookings in your calendar"],
    href: "/business/services/ai-texting",
  },
  {
    id: "calling",
    icon: IconPhone,
    problem: "Missed calls after hours",
    fix: "AI Calling Agents",
    steps: ["Script the call", "Give it a voice", "Route & book", "Summaries to your team"],
    wins: ["Every call answered", "Callers qualified", "Reminders sent"],
    href: "/business/services/ai-calling",
  },
];

export default function SolutionSwitcher() {
  const [active, setActive] = useState(0);
  const [x, setX] = useState(100); // % of the panel showing BEFORE
  const panel = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const played = useRef<Set<number>>(new Set());
  const anim = useRef(0);

  // Play the wipe once per problem when it comes into view.
  useEffect(() => {
    const el = panel.current!;
    let delay = 0;
    const play = () => {
      if (played.current.has(active) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setX(50);
        return;
      }
      played.current.add(active);
      cancelAnimationFrame(anim.current);
      setX(100);
      delay = window.setTimeout(() => {
        const t0 = performance.now();
        const step = (now: number) => {
          if (dragging.current) return;
          const p = Math.min(1, (now - t0) / 1600);
          setX(100 - (1 - Math.pow(1 - p, 3)) * 50);
          if (p < 1) anim.current = requestAnimationFrame(step);
        };
        anim.current = requestAnimationFrame(step);
      }, 450);
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && play(), { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(delay);
      cancelAnimationFrame(anim.current);
    };
  }, [active]);

  useEffect(() => {
    const el = panel.current!;
    const set = (cx: number) => {
      const r = el.getBoundingClientRect();
      setX(Math.max(0, Math.min(100, ((cx - r.left) / r.width) * 100)));
    };
    const down = (e: PointerEvent) => {
      dragging.current = true;
      cancelAnimationFrame(anim.current);
      el.setPointerCapture(e.pointerId);
      set(e.clientX);
    };
    const move = (e: PointerEvent) => dragging.current && set(e.clientX);
    const up = () => (dragging.current = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  const item = ITEMS[active];

  return (
    <div className={s.root}>
      <div className={s.tabs} role="tablist" aria-label="Problems">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          return (
            <button key={it.id} type="button" role="tab" aria-selected={i === active} className={s.tab} onClick={() => setActive(i)}>
              <span className={s.tabIcon}>
                <Icon size={22} />
              </span>
              <span className={s.tabText}>
                <small>Problem {i + 1}</small>
                <b>{it.problem}</b>
              </span>
            </button>
          );
        })}
      </div>

      <div className={s.main} role="tabpanel" aria-label={`${item.problem} — before and after`}>
        <div
          ref={panel}
          className={s.panel}
          style={{ ["--x" as string]: `${x}%` }}
          tabIndex={0}
          role="slider"
          aria-label="Before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(100 - x)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setX((v) => Math.max(0, v - 8));
            if (e.key === "ArrowRight") setX((v) => Math.min(100, v + 8));
          }}
        >
          <div className={`${s.side} ${s.after}`}>
            <Mock id={item.id} after />
          </div>
          <div className={`${s.side} ${s.before}`}>
            <Mock id={item.id} after={false} />
          </div>
          <span className={`${s.label} ${s.labelBefore}`}>Before</span>
          <span className={`${s.label} ${s.labelAfter}`}>With Kllezo</span>
          <div className={s.handle} aria-hidden="true">
            <i>⟷</i>
          </div>
        </div>

        <div className={s.fix}>
          <div className={s.fixHead}>
            <span>The fix</span>
            <Link href={item.href}>{item.fix} →</Link>
          </div>
          <ol className={s.steps}>
            {item.steps.map((st, i) => (
              <li key={st} style={{ ["--i" as string]: i }}>
                <b>{i + 1}</b>
                {st}
              </li>
            ))}
          </ol>
          <ul className={s.wins}>
            {item.wins.map((w) => (
              <li key={w}>
                <IconCheck size={16} />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Interface mock-ups (illustrative) ──────────────────────────────── */

function Mock({ id, after }: { id: string; after: boolean }) {
  if (id === "content") {
    return (
      <div className={s.mock}>
        <p className={s.mockTitle}>Enquiries from content</p>
        <svg viewBox="0 0 300 120" className={s.chart} preserveAspectRatio="none">
          <path d={after ? "M0 108 C40 104 70 96 100 84 S160 60 190 46 S250 20 300 8" : "M0 100 C50 102 90 98 130 101 S220 99 300 100"} className={after ? s.lineGood : s.lineBad} />
        </svg>
        <div className={s.posts}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <span key={d} className={after ? (i % 2 === 0 ? s.slotOn : s.slotPlan) : i === 2 ? s.slotRandom : s.slotOff}>
              {d}
            </span>
          ))}
        </div>
        <p className={after ? s.badgeGood : s.badgeBad}>{after ? "Planned · produced · measured" : "Posted when someone had time"}</p>
      </div>
    );
  }
  if (id === "website") {
    return (
      <div className={s.mock}>
        <div className={s.site}>
          <div className={s.siteBar}>
            <i />
            <i />
            <i />
          </div>
          {after ? (
            <div className={s.siteGood}>
              <b>Book your stay, direct.</b>
              <span>Private villas · best rate guaranteed</span>
              <em>Check availability</em>
            </div>
          ) : (
            <div className={s.siteBad}>
              <b>Welcome to our website</b>
              <span />
              <span />
              <span />
              <small>Contact us (page 4)</small>
            </div>
          )}
        </div>
        <p className={after ? s.badgeGood : s.badgeBad}>{after ? "✓ New enquiry · just now" : "Visitor left · 6 seconds"}</p>
      </div>
    );
  }
  if (id === "texting") {
    const rows = ["Aisha · WhatsApp", "Rohan · Instagram", "Meera · Website chat", "Imran · WhatsApp"];
    return (
      <div className={s.mock}>
        <p className={s.mockTitle}>Inbox</p>
        <ul className={s.inbox}>
          {rows.map((r, i) => (
            <li key={r}>
              <span>{r}</span>
              <em className={after ? s.tagGood : s.tagBad}>{after ? (i === 1 ? "Booked" : "Replied") : ["Unread · 4h", "Unread · 9h", "Unread · 1d", "Unread · 2d"][i]}</em>
            </li>
          ))}
        </ul>
        <p className={after ? s.badgeGood : s.badgeBad}>{after ? "Every message answered in seconds" : "Answered when someone is free"}</p>
      </div>
    );
  }
  const calls = ["19:48", "21:10", "22:35", "23:02"];
  return (
    <div className={s.mock}>
      <p className={s.mockTitle}>Calls tonight</p>
      <ul className={s.inbox}>
        {calls.map((c, i) => (
          <li key={c}>
            <span>
              {c} · {["New caller", "Existing customer", "New caller", "Unknown"][i]}
            </span>
            <em className={after ? s.tagGood : s.tagBad}>{after ? (i % 2 ? "Answered" : "Booked") : "Missed"}</em>
          </li>
        ))}
      </ul>
      <p className={after ? s.badgeGood : s.badgeBad}>{after ? "Answered by the agent · summaries sent" : "Voicemail · no messages left"}</p>
    </div>
  );
}
