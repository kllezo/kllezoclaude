/* Kllezo wordmark. The "K" mark is two strokes meeting at a point —
   the two experiences converging on one idea. Colour follows `currentColor`. */

export function KMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M10 7v18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22.5 7.5 13.2 16l9.3 8.5" fill="none" stroke="var(--k-accent, #C8A25A)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = 28, className, label = true }: { size?: number; className?: string; label?: boolean }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.38 }}>
      <KMark size={size} />
      {label && (
        <span aria-hidden="true" style={{ fontWeight: 600, letterSpacing: "0.22em", fontSize: size * 0.55, lineHeight: 1 }}>KLLEZO</span>
      )}
      <span className="sr-only">Kllezo</span>
    </span>
  );
}
