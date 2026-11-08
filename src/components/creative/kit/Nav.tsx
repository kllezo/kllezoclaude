"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { divisions, servicesIn } from "@/content/services";
import { site } from "@/content/site";
import { sound } from "./sfx";

const PAGES = [
  { href: "/creative", label: "Home" },
  { href: "/creative/services", label: "Services" },
  { href: "/creative/work", label: "Work" },
  { href: "/creative/about", label: "Studio" },
  { href: "/creative/contact", label: "Contact" },
];

/** Top bar that steps aside while reading (hides on scroll down, returns on scroll up)
    and a full-screen index menu. */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    const off = sound.subscribe(setAudio);
    if (sound.restore()) sound.set(true);
    return () => {
      off();
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = menu.current!;
    const lenis = (window as unknown as { __cxLenis?: { stop(): void; start(): void } }).__cxLenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll(".cx-menu-big a > span"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.35 });
        gsap.fromTo(el.querySelectorAll("[data-menu-fade]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.55 });
      }
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      return () => {
        window.removeEventListener("keydown", onKey);
        lenis?.start();
        document.documentElement.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <header className="cx-nav" data-hidden={hidden && !open ? "" : undefined} data-solid={solid && !open ? "" : undefined}>
        <Link href="/creative" className="cx-brand" aria-label="Kllezo — home">
          <Image src="/brand/kllezo-mark-beige.webp" alt="Kllezo" width={128} height={36} priority unoptimized />
        </Link>
        <div className="cx-nav-right">
          <button type="button" className="cx-sound" aria-pressed={audio} onClick={() => sound.set(!audio)} aria-label={audio ? "Turn sound off" : "Turn sound on"}>
            <span className="cx-sound-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="cx-hide-sm">{audio ? "Sound on" : "Sound off"}</span>
          </button>
          <ExperienceSwitch current="creative" className="cx-nav-link cx-hide-sm">
            Business view
          </ExperienceSwitch>
          <Link href="/creative/contact" className="cx-nav-cta cx-hide-sm">
            Start a project
          </Link>
          <button type="button" className="cx-burger" aria-expanded={open} aria-controls="cx-menu" onClick={() => setOpen((o) => !o)}>
            <span className="cx-burger-label">{open ? "Close" : "Menu"}</span>
            <span className="cx-burger-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        id="cx-menu"
        ref={menu}
        onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
        className="cx-menu" data-open={open ? "" : undefined} aria-hidden={!open} inert={!open}>
        <nav className="cx-menu-big" aria-label="Main">
          {PAGES.map((p, i) => (
            <Link key={p.href} href={p.href} aria-current={pathname === p.href ? "page" : undefined}>
              <span>
                <sup>0{i + 1}</sup>
                {p.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="cx-menu-side">
          {divisions.map((d) => (
            <div key={d.id} data-menu-fade>
              <p className="cx-kicker">{d.name}</p>
              <ul>
                {servicesIn(d.id).map((sv) => (
                  <li key={sv.slug}>
                    <Link href={`/creative/services/${sv.slug}`}>{sv.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="cx-menu-foot" data-menu-fade>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <ExperienceSwitch current="creative" className="cx-underline">
              Switch to the Business experience
            </ExperienceSwitch>
          </div>
        </div>
      </div>
    </>
  );
}
