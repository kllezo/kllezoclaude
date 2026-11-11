"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has been on screen (stays true). Also reports reduced motion. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReduce(r);
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen, reduce };
}
