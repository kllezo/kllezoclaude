"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { studioFrames } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";

/* ─────────────────────────────────────────────────────────────────────────
   01 · CONTENT — "The scroll-stopper".
   A phone feed you can flick. Everything in it is noise except Kllezo's
   posts — and however hard you flick, the feed always comes to rest on one.
   That is the whole pitch for the content division, as a toy.
   ───────────────────────────────────────────────────────────────────────── */

const H = 400; // one post, px
const KLLEZO = [studioFrames[0], studioFrames[4], studioFrames[2], studioFrames[10]];
// noise, noise, KLLEZO … repeating; numbers index into KLLEZO
const PATTERN: (number | null)[] = [null, null, 0, null, null, null, 1, null, null, 2, null, null, null, 3];
const TOTAL = PATTERN.length * H;
const CAPTIONS = ["We don't build content. We build desire.", "Luxury, redefined.", "Your brand is what people say when you're not in the room.", "Behind the shoot."];

export default function ScrollStopper() {
  const phone = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState(0);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const view = phone.current!;
    const tr = track.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let y = H * 2 - (view.clientHeight - H) / 2; // start centred on the first Kllezo post
    let v = 0; // px per frame
    let dragging = false;
    let settling: gsap.core.Tween | null = null;
    let lastInput = performance.now();
    let lastY = 0;
    let lastT = 0;
    let visible = false;
    let lastTickIdx = -1;

    const wrap = (n: number) => ((n % TOTAL) + TOTAL) % TOTAL;
    const render = () => {
      tr.style.transform = `translate3d(0, ${-wrap(y)}px, 0)`;
      const idx = Math.floor(wrap(y + view.clientHeight / 2) / H);
      if (idx !== lastTickIdx) {
        lastTickIdx = idx;
        if (Math.abs(v) > 2) sfx.tick();
      }
    };
    render();

    const centreOffset = () => (view.clientHeight - H) / 2;
    const settle = () => {
      // nearest Kllezo post ahead in the direction of travel
      const dir = Math.sign(v) || 1;
      const centre = y + centreOffset();
      let best = Infinity;
      for (let k = -1; k <= 2; k++) {
        PATTERN.forEach((p, i) => {
          if (p === null) return;
          const top = Math.floor(centre / TOTAL) * TOTAL + (i + k * PATTERN.length) * H;
          const d = top - centre;
          if (d * dir >= -H * 0.3 && Math.abs(d) < Math.abs(best)) best = d;
        });
      }
      v = 0;
      settling = gsap.to(
        { p: y },
        {
          p: y + best,
          duration: Math.min(1.4, 0.5 + Math.abs(best) / 1600),
          ease: "back.out(1.6)",
          onUpdate() {
            y = (this.targets()[0] as { p: number }).p;
            render();
          },
          onComplete: () => {
            settling = null;
            setStops((s) => s + 1);
            setBurst((b) => b + 1);
            sfx.like();
          },
        },
      );
    };

    const kill = () => {
      settling?.kill();
      settling = null;
    };

    const tick = () => {
      if (!visible || dragging || settling) return;
      if (Math.abs(v) > 0.01) {
        y += v;
        v *= 0.955;
        render();
        if (Math.abs(v) < 1.6) settle();
      } else if (!reduce && performance.now() - lastInput > 4200) {
        // idle: flick by itself, so the point makes itself
        lastInput = performance.now();
        v = 38 + Math.random() * 30;
      }
    };
    gsap.ticker.add(tick);

    const down = (e: PointerEvent) => {
      kill();
      dragging = true;
      travel = 0;
      v = 0;
      lastY = e.clientY;
      lastT = performance.now();
      lastInput = lastT;
      if (e.pointerType === "mouse") view.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dy = lastY - e.clientY;
      travel += Math.abs(dy);
      y += dy;
      v = (dy / Math.max(1, now - lastT)) * 16.67;
      lastY = e.clientY;
      lastT = now;
      lastInput = now;
      render();
    };
    let travel = 0;
    const up = () => {
      if (!dragging) return;
      dragging = false;
      lastInput = performance.now();
      // A tap (no drag) flicks the feed — that's the gesture on touch screens,
      // where vertical swipes stay with the page.
      if (travel < 6) v = 46 + Math.random() * 30;
      else if (Math.abs(v) < 1.6) settle();
    };
    // Touch: the browser takes vertical swipes for page scroll and cancels the pointer.
    const cancel = () => {
      dragging = false;
      if (Math.abs(v) < 1.6 && !settling) settle();
    };
    view.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerup", up);
    view.addEventListener("pointercancel", cancel);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.2 });
    io.observe(view);

    return () => {
      gsap.ticker.remove(tick);
      kill();
      io.disconnect();
      view.removeEventListener("pointerdown", down);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", up);
      view.removeEventListener("pointercancel", cancel);
    };
  }, []);

  const posts = [...PATTERN, ...PATTERN];

  return (
    <section className="cx-toy cx-stopper" aria-labelledby="stopper-h">
      <div className="cx-wrap cx-toy-grid">
        <div className="cx-toy-copy">
          <p className="cx-kicker">
            <span className="cx-gold">01</span> / 04 — Content Engine
          </p>
          <h2 id="stopper-h" className="cx-toy-title" data-cx-fade>
            Stories people
            <br />
            <em>stop</em> for.
          </h2>
          <p className="cx-toy-body" data-cx-fade="0.1">
            The feed is endless and everyone is shouting. We plan, shoot and publish content made to be the thing a thumb stops on — then do it again every month, on a system.
          </p>
          <p className="cx-toy-hint" data-cx-fade="0.2">
            <span aria-hidden="true">↕</span> <span className="cx-on-mouse">Drag the feed and flick it as hard as you like.</span>
            <span className="cx-on-touch">Tap the phone to flick the feed.</span>
          </p>
          <div className="cx-toy-stat" aria-live="polite">
            <b>{String(stops).padStart(2, "0")}</b> times it stopped on Kllezo
          </div>
          <Link href="/creative/services/content-growth" className="cx-arrow-link">
            The Content Growth System <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="cx-phone-wrap">
          <div ref={phone} className="cx-phone-shell" data-cursor="Drag" role="img" aria-label="A social feed that always comes to rest on a Kllezo post">
            <div className="cx-phone-notch" />
            <div ref={track} className="cx-feed">
              {posts.map((p, i) =>
                p === null ? (
                  <div key={i} className="cx-post is-noise" style={{ height: H }}>
                    <div className="cx-post-head">
                      <i />
                      <span />
                    </div>
                    <div className="cx-post-media" style={{ ["--h" as string]: `${(i * 47) % 360}` }} />
                    <div className="cx-post-lines">
                      <span />
                      <span />
                    </div>
                  </div>
                ) : (
                  <div key={i} className="cx-post is-kllezo" style={{ height: H }}>
                    <div className="cx-post-head">
                      <i className="cx-post-avatar" />
                      <b>kllezo.studio</b>
                    </div>
                    <div className="cx-post-media">
                      <Image src={KLLEZO[p].src} alt="" width={KLLEZO[p].w} height={KLLEZO[p].h} sizes="320px" unoptimized draggable={false} />
                    </div>
                    <p className="cx-post-cap">{CAPTIONS[p]}</p>
                  </div>
                ),
              )}
            </div>
            <div className="cx-heart" key={burst} data-on={burst ? "" : undefined} aria-hidden="true">
              ♥
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
