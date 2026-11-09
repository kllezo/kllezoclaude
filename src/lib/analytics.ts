/* Shared analytics — one tracker for both experiences.
   Sends to Google Analytics 4 when NEXT_PUBLIC_GA_ID is set;
   every event carries the experience so reports can compare them. */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, { page: window.location.pathname, ...params });
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, params);
}
