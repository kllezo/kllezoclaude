/* ─────────────────────────────────────────────────────────────────────────
   A real day's sky for a given minute of the day (0–1440, may exceed for the
   next morning). Gradient stops are interpolated from observed sky colours —
   pre-dawn, dawn blush, blue midday, golden hour, sunset, dusk, night — with
   the sun travelling an arc and setting behind a city skyline whose windows
   light up after dark, and stars fading in. Pure CSS: cheap to re-render on
   every scroll frame.
   ───────────────────────────────────────────────────────────────────────── */

type Stop = { m: number; top: string; mid: string; low: string };

// zenith → mid-sky → horizon
const STOPS: Stop[] = [
  { m: 0, top: "#03050d", mid: "#080d22", low: "#121a3a" },
  { m: 300, top: "#060a1c", mid: "#121b3d", low: "#2b2c55" },
  { m: 345, top: "#16224a", mid: "#4b4a78", low: "#d9867a" }, // first light
  { m: 390, top: "#2d4f86", mid: "#9a8fb5", low: "#ffc28f" }, // sunrise
  { m: 480, top: "#2f68ae", mid: "#7fb0e0", low: "#ffe2bb" },
  { m: 600, top: "#2563b6", mid: "#64a2e4", low: "#cfe6f8" },
  { m: 780, top: "#1d5cb0", mid: "#5698e0", low: "#c6e2fa" }, // midday
  { m: 960, top: "#2759a3", mid: "#6b9dd4", low: "#ecd8b0" },
  { m: 1050, top: "#2a4b85", mid: "#b98468", low: "#ffb062" }, // golden hour
  { m: 1110, top: "#1c2350", mid: "#8a3f62", low: "#ff6a3d" }, // sunset
  { m: 1155, top: "#121638", mid: "#3d2b5e", low: "#b4506a" }, // dusk
  { m: 1230, top: "#090d26", mid: "#141a3c", low: "#2c2a58" },
  { m: 1440, top: "#03050d", mid: "#080d22", low: "#121a3a" },
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
const smooth = (t: number) => t * t * (3 - 2 * t);

export function skyAt(minute: number) {
  const m = ((minute % 1440) + 1440) % 1440;
  let i = 0;
  while (i < STOPS.length - 2 && STOPS[i + 1].m <= m) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const t = smooth((m - a.m) / (b.m - a.m));
  return { top: mix(a.top, b.top, t), mid: mix(a.mid, b.mid, t), low: mix(a.low, b.low, t), m };
}

const SUNRISE = 380;
const SUNSET = 1125;

// a fixed, hand-placed star field (no randomness → no hydration mismatch)
const STARS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 137.508) % 100;
  const y = ((i * 61.8) % 62) + 1;
  const r = i % 7 === 0 ? 2 : i % 3 === 0 ? 1.4 : 1;
  return `${x.toFixed(2)}vw ${y.toFixed(2)}vh 0 ${r === 2 ? 0.4 : 0}px rgba(255,255,255,${(0.5 + (i % 5) * 0.1).toFixed(2)})`;
}).join(",");

export default function Sky({ minute, className = "" }: { minute: number; className?: string }) {
  const { top, mid, low, m } = skyAt(minute);
  const day = m >= SUNRISE - 20 && m <= SUNSET + 20;
  // sun arc: 0 at sunrise, 1 at sunset
  const p = Math.min(1.08, Math.max(-0.08, (m - SUNRISE) / (SUNSET - SUNRISE)));
  const altitude = Math.sin(Math.max(0, Math.min(1, p)) * Math.PI); // 0 horizon … 1 noon
  const low1 = 1 - altitude;
  const sunColor = mix("#fff8e6", "#ff7a3a", Math.pow(low1, 2.2));
  const glow = mix("#fff3c8", "#ff5a2a", Math.pow(low1, 1.6));
  // night: stars and moon
  const night = m < SUNRISE ? Math.min(1, (SUNRISE - m) / 60) : m > SUNSET ? Math.min(1, (m - SUNSET) / 70) : 0;
  const moonP = m > SUNSET ? (m - SUNSET) / (1440 - SUNSET + SUNRISE) : (m + 1440 - SUNSET) / (1440 - SUNSET + SUNRISE);
  const moonAlt = Math.sin(Math.min(1, Math.max(0, moonP)) * Math.PI);
  const windows = Math.min(1, Math.max(0, (m - (SUNSET - 30)) / 60)) + (m < SUNRISE ? 1 : 0);

  return (
    <div
      className={`cx-sky ${className}`}
      aria-hidden="true"
      style={{
        background: `linear-gradient(180deg, ${top} 0%, ${mid} 52%, ${low} 82%, ${low} 100%)`,
      }}
    >
      <div className="cx-sky-stars" style={{ boxShadow: STARS, opacity: night * 0.9 }} />
      {day && (
        <div
          className="cx-sky-sun"
          style={{
            left: `${44 + p * 52}%`,
            top: `${74 - altitude * 60}%`,
            background: `radial-gradient(circle, ${sunColor} 0 34%, ${glow} 46%, transparent 70%)`,
            boxShadow: `0 0 ${80 + low1 * 120}px ${30 + low1 * 50}px ${glow}55`,
          }}
        />
      )}
      {day && <div className="cx-sky-haze" style={{ background: `radial-gradient(70% 45% at ${44 + p * 52}% 82%, ${glow}${low1 > 0.5 ? "66" : "22"}, transparent 70%)` }} />}
      {night > 0 && <div className="cx-sky-moon" style={{ left: `${46 + moonP * 48}%`, top: `${66 - moonAlt * 50}%`, opacity: night }} />}
      <svg className="cx-sky-city" viewBox="0 0 1600 200" preserveAspectRatio="none">
        <path
          d="M0 200V150h40v-30h30v-22h22v52h26v-70h44v70h20v-40h36v-46h30v86h24v-58h48v58h18v-96h40v96h22v-60h34v-24h28v84h30v-42h46v42h20v-110h50v110h24v-70h30v-26h34v96h22v-50h52v50h18v-84h44v84h26v-40h36v-64h30v104h22v-56h46v56h20v-92h48v92h24v-46h40v46h30v-68h34v68h26v-40h48v40h22v-74h40v74h18v-30h40v-22h26v52h40V200Z"
          fill="#07090f"
        />
        <g fill="#ffd27a" opacity={Math.min(1, windows)}>
          {Array.from({ length: 46 }, (_, i) => (
            <rect key={i} x={(i * 34.7 + 60) % 1560} y={120 + ((i * 23) % 60)} width="5" height="5" opacity={i % 3 === 0 ? 0.35 : 0.9} />
          ))}
        </g>
      </svg>
    </div>
  );
}
