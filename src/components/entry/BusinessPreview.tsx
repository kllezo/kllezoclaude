import s from "./BusinessPreview.module.css";

/* A sophisticated, interface-like composition: a product window with
   a sidebar, a growth system node graph with pulses travelling between
   modules, a pipeline and drawing chart. Pure CSS/SVG animation —
   decorative, so it carries no figures that could read as claims. */

export default function BusinessPreview() {
  return (
    <div className={s.wrap}>
      <div className={s.grid} />
      <div className={s.window}>
        <div className={s.bar}>
          <i />
          <i />
          <i />
          <span>kllezo / growth-system</span>
        </div>
        <div className={s.body}>
          <aside className={s.side}>
            {["Overview", "Content", "Websites", "AI Systems", "Leads"].map((l, i) => (
              <span key={l} className={i === 0 ? s.on : undefined} style={{ ["--i" as string]: i }}>
                {l}
              </span>
            ))}
          </aside>
          <div className={s.main}>
            <svg viewBox="0 0 300 150" className={s.graph}>
              <defs>
                <linearGradient id="bp-line" x1="0" x2="1">
                  <stop offset="0" stopColor="#09453E" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#09453E" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path id="bp-a" d="M60 40 C 120 40, 120 75, 150 75" className={s.link} />
              <path id="bp-b" d="M60 110 C 120 110, 120 75, 150 75" className={s.link} />
              <path id="bp-c" d="M150 75 C 190 75, 200 75, 245 75" className={s.link} />
              {["bp-a", "bp-b", "bp-c"].map((id, i) => (
                <circle key={id} r="3" className={s.pulse}>
                  <animateMotion dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.6}s`}>
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              ))}
              <g className={s.node} transform="translate(60 40)">
                <rect x="-36" y="-13" width="72" height="26" rx="13" />
                <text textAnchor="middle" dy="4">Content</text>
              </g>
              <g className={s.node} transform="translate(60 110)">
                <rect x="-36" y="-13" width="72" height="26" rx="13" />
                <text textAnchor="middle" dy="4">Websites</text>
              </g>
              <g className={`${s.node} ${s.core}`} transform="translate(150 75)">
                <circle r="18" />
                <text textAnchor="middle" dy="4">AI</text>
              </g>
              <g className={`${s.node} ${s.goal}`} transform="translate(258 75)">
                <rect x="-30" y="-13" width="60" height="26" rx="6" />
                <text textAnchor="middle" dy="4">Growth</text>
              </g>
            </svg>
            <div className={s.cards}>
              <div className={s.card}>
                <span className={s.label}>Pipeline</span>
                <div className={s.stages}>
                  {["Visit", "Enquiry", "Qualified", "Customer"].map((st, i) => (
                    <span key={st} style={{ ["--i" as string]: i }}>
                      {st}
                    </span>
                  ))}
                </div>
              </div>
              <div className={s.card}>
                <span className={s.label}>Momentum</span>
                <svg viewBox="0 0 120 40" className={s.spark}>
                  <path d="M0 34 L15 30 L30 31 L45 24 L60 25 L75 17 L90 15 L105 8 L120 5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
