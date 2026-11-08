import s from "./LeakDiagram.module.css";

export type Leak = { where: string; t: string; d: string; fix: string; vendor: string };

/* The problem, drawn: growth bought in pieces is three pipes that don't meet.
   Demand flows along each one and spills out of the gap at its end — the same
   three gaps the list below names. Hovering or focusing a leak marks its gap.
   Pure SVG + CSS; the flow stops under prefers-reduced-motion. */
const SEG = [
  { x0: 20, x1: 310 },
  { x0: 420, x1: 710 },
  { x0: 820, x1: 1110 },
];

export default function LeakDiagram({ leaks, dark = false }: { leaks: Leak[]; dark?: boolean }) {
  return (
    <div className={`${s.root} ${dark ? s.dark : ""}`}>
      <svg className={s.svg} viewBox="0 0 1200 170" role="img" aria-label="Three disconnected services, each losing demand at its edge">
        {SEG.map((g, i) => (
          <g key={i} className={s.seg} data-i={i}>
            <text className={s.vendor} x={g.x0} y="30">
              {leaks[i].vendor}
            </text>
            <rect className={s.pipe} x={g.x0} y="48" width={g.x1 - g.x0} height="28" rx="14" />
            {[0, 1, 2, 3].map((p) => (
              <circle
                key={p}
                className={s.drop}
                r="7"
                cx="0"
                cy="62"
                style={{ ["--x0" as string]: g.x0 + 10, ["--x1" as string]: g.x1, ["--delay" as string]: `${p * 0.9 + i * 0.35}s` }}
              />
            ))}
            <g className={s.gap} transform={`translate(${g.x1 + 24} 0)`}>
              <line x1="0" y1="80" x2="0" y2="130" />
              <text x="0" y="156" textAnchor="middle">
                {leaks[i].where} leaks
              </text>
            </g>
          </g>
        ))}
      </svg>

      <ol className={s.list}>
        {leaks.map((l, i) => (
          <li key={l.where} data-i={i} tabIndex={0} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
            <span className={s.where}>
              <i>{String(i + 1).padStart(2, "0")}</i> {l.where}
            </span>
            <h3 className={s.title}>{l.t}</h3>
            <p className={s.desc}>{l.d}</p>
            <span className={s.fix}>
              Fixed by <b>{l.fix}</b>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
