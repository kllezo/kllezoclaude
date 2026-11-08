"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { markArrival, rememberExperience } from "@/components/shared/experienceState";
import { track } from "@/lib/analytics";
import "./original/services.css";

const CATEGORY_ROUTE: Record<string, string> = {
  content: "/creative/services/content-growth",
  websites: "/creative/services/business-website",
  texting: "/creative/services/ai-texting",
  calling: "/creative/services/ai-calling",
};

/** Hosts one of the original Kllezo services pages (markup from
    src/content/creative-original) and runs the original services.js against it. */
export default function OriginalServices({ html, landing = false }: { html: string; landing?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname() ?? "/creative/services";

  useEffect(() => {
    const root = ref.current!;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    const timers: number[] = [];

    // Original runtime: cursor, process line, counters, solution cards, lightbox, orb canvases.
    import("./original/services-runtime").then(({ mountServices }) => {
      if (!cancelled) destroy = mountServices();
    });

    // Experience switch (kept beside the original "Back" link).
    const businessHref = pathname.replace(/^\/creative/, "/business") || "/business";
    root.querySelectorAll<HTMLAnchorElement>("[data-exp-switch]").forEach((a) => (a.href = businessHref));

    // Route the original's plain links through the app router (no full reloads).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!a || !root.contains(a)) return;
      const href = a.getAttribute("href")!;
      if (!href.startsWith("/")) return;
      e.preventDefault();
      if (a.hasAttribute("data-exp-switch")) {
        rememberExperience("business");
        markArrival("business");
        track("experience_switched", { to: "business", from_path: pathname });
        router.push(businessHref);
        return;
      }
      router.push(href);
    };
    root.addEventListener("click", onClick);

    // Original landing logic (services.html inline script): hash deep links and the orb selection transition.
    let transitioning = false;
    const orbClick = (e: MouseEvent) => {
      const card = (e.target as Element).closest<HTMLElement>(".orb-card[data-category]");
      if (!card || transitioning) return;
      const target = CATEGORY_ROUTE[card.dataset.category ?? ""];
      if (!target) return;
      transitioning = true;
      root.querySelector("#landing-view")?.classList.add("in-transition");
      card.classList.add("selected-orb");
      root.querySelectorAll(".orb-card").forEach((o) => o !== card && o.classList.add("faded-orb"));
      router.prefetch(target);
      timers.push(window.setTimeout(() => router.push(target), 450));
    };
    if (landing) {
      const hashTarget = CATEGORY_ROUTE[window.location.hash.slice(1)];
      if (hashTarget) router.replace(hashTarget);
      root.addEventListener("click", orbClick);
    }

    // Video loading: the original autoplayed every clip on load. Attach sources only as
    // each clip approaches the viewport, and pause clips that leave it.
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const v = target as HTMLVideoElement;
          if (isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else if (v.src) v.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    root.querySelectorAll("video[data-src]").forEach((v) => io.observe(v));

    return () => {
      cancelled = true;
      destroy?.();
      io.disconnect();
      timers.forEach(clearTimeout);
      root.removeEventListener("click", onClick);
      root.removeEventListener("click", orbClick);
      document.body.classList.remove("hov");
    };
  }, [landing, pathname, router]);

  return <div ref={ref} className="kz-s" dangerouslySetInnerHTML={{ __html: html }} />;
}
