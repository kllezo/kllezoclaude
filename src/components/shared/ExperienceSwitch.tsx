"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Experience } from "@/content/site";
import { markArrival, rememberExperience } from "./experienceState";
import { track } from "@/lib/analytics";

/** Links to the same page in the other experience, e.g.
    /creative/services/ai-calling ⇄ /business/services/ai-calling. */
export default function ExperienceSwitch({ current, className, children }: { current: Experience; className?: string; children?: React.ReactNode }) {
  const pathname = usePathname() ?? `/${current}`;
  const target: Experience = current === "creative" ? "business" : "creative";
  // Shared URLs (/services/x, /work …) are rewritten into an experience, so keep the sub-path either way.
  const rel = pathname.startsWith(`/${current}`) ? pathname.slice(current.length + 1) : pathname === "/" ? "" : pathname;
  const href = `/${target}${rel}`;
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        rememberExperience(target);
        if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) markArrival(target);
        track("experience_switched", { to: target, from_path: pathname });
      }}
      aria-label={`Switch to the ${target} experience`}
    >
      {children ?? (target === "business" ? "Business view" : "Creative view")}
    </Link>
  );
}
