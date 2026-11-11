"use client";

import { useInView } from "./useInView";
import s from "./services.module.css";

/* A paragraph that reads itself in, word by word, when it scrolls into view. */
export default function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const { ref, seen } = useInView<HTMLParagraphElement>(0.4);
  const words = text.split(" ");
  return (
    <p ref={ref} className={`${s.words} ${className}`} data-on={seen ? "" : undefined} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ ["--i" as string]: i }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
