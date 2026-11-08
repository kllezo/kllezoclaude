"use client";

import { useEffect, useState } from "react";

/** A running film timecode (HH:MM:SS:FF at 24fps). Decorative. */
export default function Timecode({ className }: { className?: string }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const id = window.setInterval(() => setF(Math.floor(((performance.now() - start) / 1000) * 24)), 1000 / 12);
    return () => window.clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  const ff = f % 24;
  const ss = Math.floor(f / 24) % 60;
  const mm = Math.floor(f / 1440) % 60;
  return <span className={className}>{`00:${p(mm)}:${p(ss)}:${p(ff)}`}</span>;
}
