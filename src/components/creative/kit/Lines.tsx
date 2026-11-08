import { createElement, type ReactNode } from "react";

/** A headline revealed line by line from behind a mask (see Motion: data-cx-lines).
    Lines are authored explicitly — the break points are part of the typography. */
export default function Lines({
  as = "h2",
  lines,
  className,
  delay,
  id,
}: {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  lines: ReactNode[];
  className?: string;
  delay?: number;
  id?: string;
}) {
  return createElement(
    as,
    { className, id, "data-cx-lines": delay ?? "" },
    lines.map((l, i) => (
      <span className="cx-line" key={i}>
        <span>{l}</span>
      </span>
    )),
  );
}
