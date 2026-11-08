"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { divisions, servicesIn } from "@/content/services";
import { serviceMedia } from "@/content/creativeMedia";

/** The full catalogue as an editorial index. On pointer devices a preview of
    each service follows the cursor, tilting with its speed. */
export default function ServiceIndex() {
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = preview.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.35));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="cx-index" onPointerLeave={() => setHover(null)}>
      {divisions.map((d) => (
        <section key={d.id} id={d.id} className="cx-index-group" aria-labelledby={`grp-${d.id}`}>
          <header className="cx-index-head" data-cx-fade>
            <span className="cx-gold">{d.index}</span>
            <h2 id={`grp-${d.id}`}>{d.name}</h2>
            <p>{d.creativeLine}</p>
          </header>
          <ul>
            {servicesIn(d.id).map((sv) => (
              <li key={sv.slug} data-cx-fade>
                <Link
                  href={`/creative/services/${sv.slug}`}
                  className="cx-index-row"
                  data-cursor="Open"
                  onPointerEnter={() => setHover(sv.slug)}
                  onFocus={() => setHover(sv.slug)}
                  onBlur={() => setHover(null)}
                  data-dim={hover && hover !== sv.slug ? "" : undefined}
                >
                  <span className="cx-index-code">{sv.code}</span>
                  <span className="cx-index-name">{sv.name}</span>
                  <span className="cx-index-tag">{sv.tagline}</span>
                  <span className="cx-index-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div ref={preview} className="cx-index-preview" data-on={hover ? "" : undefined} aria-hidden="true">
        {Object.entries(serviceMedia).map(([slug, m]) => (
          <Image key={slug} src={m.src} alt="" width={m.w} height={m.h} sizes="320px" unoptimized data-on={hover === slug ? "" : undefined} />
        ))}
      </div>
    </div>
  );
}
