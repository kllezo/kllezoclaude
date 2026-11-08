/* Hand-off between the entry screen and an experience.
   The entry screen ends with the viewport covered by an overlay
   in the target experience's style and sets
   <html data-arrive="creative|business">. The experience layout
   renders the same overlay (visible while that attribute is set)
   and animates it away, so the transition reads as one motion. */

import type { Experience } from "@/content/site";
import { EXPERIENCE_COOKIE } from "@/content/site";

export function rememberExperience(exp: Experience) {
  document.cookie = `${EXPERIENCE_COOKIE}=${exp}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function markArrival(exp: Experience) {
  document.documentElement.dataset.arrive = exp;
}

export function clearArrival() {
  delete document.documentElement.dataset.arrive;
}
