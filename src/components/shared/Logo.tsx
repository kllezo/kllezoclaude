import Image from "next/image";

/* Official Kllezo mark (wings + wordmark), from the brand logo files.
   Forest green on light surfaces, beige on dark. `size` is the rendered height in px. */
const RATIO = 720 / 203;

export default function Logo({ size = 28, tone = "green", className, priority }: { size?: number; tone?: "green" | "beige"; className?: string; priority?: boolean }) {
  return (
    <Image
      src={`/brand/kllezo-mark-${tone}.webp`}
      alt="Kllezo"
      width={Math.round(size * RATIO)}
      height={size}
      className={className}
      priority={priority}
      unoptimized
      style={{ display: "block", width: "auto", height: size }}
    />
  );
}
