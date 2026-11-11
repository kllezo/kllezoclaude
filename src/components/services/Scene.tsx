"use client";

import { useInView } from "./useInView";
import type { DemoKind } from "@/content/services";
import s from "./Scene.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   Animated explainers: each service's problem ("before") and result ("after")
   as a small looping scene, so the point lands without reading. Pure CSS
   animation; plays once on screen, then loops. Scenes are illustrative.
   ───────────────────────────────────────────────────────────────────────── */

type State = "before" | "after";

export default function Scene({ kind, state, caption }: { kind: DemoKind; state: State; caption?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);
  return (
    <figure ref={ref} className={`${s.scene} ${s[state]}`} data-play={seen ? "" : undefined}>
      <span className={s.badge}>{state === "before" ? "Without a system" : "With Kllezo"}</span>
      <div className={s.stage} aria-hidden="true">
        <Body kind={kind} state={state} />
      </div>
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}

function Body({ kind, state }: { kind: DemoKind; state: State }) {
  const after = state === "after";
  switch (kind) {
    case "chat":
      return (
        <div className={s.inbox}>
          {["Aisha · WhatsApp", "Rohan · Instagram", "Meera · Website", "Imran · WhatsApp"].map((n, i) => (
            <div key={n} className={s.msg} style={{ ["--i" as string]: i }}>
              <i className={s.av}>{n[0]}</i>
              <div>
                <b>{n}</b>
                <span>{["Is Saturday free?", "Price for 4?", "Do you deliver?", "Can I book today?"][i]}</span>
              </div>
              <em className={after ? s.ok : s.bad}>{after ? (i === 1 ? "Booked ✓" : "Replied · 4s") : ["Unread · 2h", "Unread · 5h", "Unread · 9h", "Unread · 1d"][i]}</em>
            </div>
          ))}
          <p className={s.tally}>{after ? "4 of 4 answered" : "0 of 4 answered"}</p>
        </div>
      );
    case "call":
      return (
        <div className={s.calls}>
          <div className={s.ring}>
            <span className={s.ringIcon}>☎</span>
            <i />
            <i />
          </div>
          <ul>
            {["19:48 · New caller", "21:10 · Customer", "22:35 · New caller"].map((c, i) => (
              <li key={c} style={{ ["--i" as string]: i }}>
                <span>{c}</span>
                <em className={after ? s.ok : s.bad}>{after ? (i === 0 ? "Booked ✓" : "Answered") : "Missed"}</em>
              </li>
            ))}
          </ul>
          {after && (
            <div className={s.wave}>
              {Array.from({ length: 18 }, (_, i) => (
                <i key={i} style={{ ["--i" as string]: i % 6 }} />
              ))}
            </div>
          )}
        </div>
      );
    case "browser":
      return (
        <div className={s.browser}>
          <div className={s.bar}>
            <i />
            <i />
            <i />
          </div>
          <div className={s.page}>
            <b className={after ? s.hGood : s.hBad}>{after ? "Book your stay, direct." : "Welcome to our website"}</b>
            <span />
            <span />
            {after ? <em className={s.ctaBtn}>Check availability</em> : <small className={s.lostLink}>Contact (page 4)</small>}
          </div>
          <svg className={`${s.cursor} ${after ? s.cursorClick : s.cursorLeave}`} width="18" height="22" viewBox="0 0 18 22">
            <path d="M1 1l15 11-7 1-3 7z" fill="#fff" stroke="#111" strokeWidth="1.2" />
          </svg>
          <div className={after ? s.toastGood : s.toastBad}>{after ? "✓ New enquiry · just now" : "Visitor left · 6s"}</div>
        </div>
      );
    case "funnel":
      return (
        <div className={s.funnel}>
          {["Ad click", "Landing page", "Form", "Qualified"].map((st, i) => (
            <div key={st} className={s.stage2} style={{ ["--w" as string]: `${100 - i * 18}%`, ["--i" as string]: i }}>
              <span>{st}</span>
            </div>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} className={`${s.drop} ${after && i % 4 !== 0 ? s.dropKeep : ""}`} style={{ ["--i" as string]: i }} />
          ))}
          <p className={s.tally}>{after ? "Most clicks become conversations" : "Most clicks leak out before the form"}</p>
        </div>
      );
    case "store":
      return (
        <div className={s.store}>
          <div className={s.cart}>
            <span>🛒</span>
            <b>3 items</b>
          </div>
          <ol className={s.checkout}>
            {["Cart", "Details", "Payment", "Confirmed"].map((c, i) => (
              <li key={c} style={{ ["--i" as string]: i }} data-stop={!after && i >= 2 ? "" : undefined}>
                {c}
              </li>
            ))}
          </ol>
          <div className={after ? s.toastGood : s.toastBad}>{after ? "✓ Order placed" : "Cart abandoned"}</div>
        </div>
      );
    case "calendar":
      return (
        <div className={s.cal}>
          <div className={s.grid}>
            {Array.from({ length: 21 }, (_, i) => {
              const on = after ? i % 3 !== 2 : i === 4 || i === 13;
              return <span key={i} className={on ? (after ? s.postGood : s.postBad) : ""} style={{ ["--i" as string]: i }} />;
            })}
          </div>
          <svg className={s.chart} viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d={after ? "M0 56 C40 52 70 44 100 34 S160 14 200 4" : "M0 48 C50 50 100 46 140 49 S180 47 200 48"} />
          </svg>
          <p className={s.tally}>{after ? "Planned · posted · measured" : "Posted when someone had time"}</p>
        </div>
      );
    case "brand":
      return (
        <div className={s.brand}>
          <div className={s.profile}>
            <i className={after ? s.faceGood : s.faceBad}>{after ? "★" : "?"}</i>
            <div>
              <b>Your name</b>
              <span>{after ? "Known for: what you do best" : "Known for: —"}</span>
            </div>
          </div>
          <div className={s.tiles}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={after ? s.tileOn : ""} style={{ ["--i" as string]: i }} />
            ))}
          </div>
          <svg className={s.chart} viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d={after ? "M0 56 C50 50 90 38 130 24 S180 8 200 4" : "M0 50 C60 51 120 49 200 50"} />
          </svg>
          <p className={s.tally}>{after ? "Recognised, trusted, referred" : "Posting, but nobody remembers you"}</p>
        </div>
      );
    case "film":
      return (
        <div className={`${s.film} ${after ? s.filmGood : s.filmBad}`}>
          <div className={s.frame}>
            <span className={s.subject} />
            {after && (
              <>
                <i className={s.lbTop} />
                <i className={s.lbBot} />
                <em className={s.rec}>● REC 4K</em>
              </>
            )}
          </div>
          <p className={s.tally}>{after ? "Scripted · lit · graded" : "Shot on a phone, no plan"}</p>
        </div>
      );
    case "ads":
    default:
      return (
        <div className={s.ads}>
          <div className={`${s.ad} ${after ? s.adStay : s.adSkip}`}>
            <div className={s.adMedia}>
              <span>{after ? "Real customer, real hook" : "Generic stock ad"}</span>
            </div>
            <em className={s.adCta}>{after ? "Shop now →" : "Learn more"}</em>
          </div>
          <div className={after ? s.toastGood : s.toastBad}>{after ? "✓ Clicked → purchased" : "Skipped in 1s"}</div>
        </div>
      );
  }
}
