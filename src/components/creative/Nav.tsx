"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/shared/Logo";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { divisions, services } from "@/content/services";
import s from "./Nav.module.css";

const main = [
  { href: "/creative", label: "Prologue" },
  { href: "/creative/services", label: "Services" },
  { href: "/creative/work", label: "Work" },
  { href: "/creative/about", label: "About" },
  { href: "/creative/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <header className={s.nav} data-hidden={(hidden && !open) || undefined} data-open={open || undefined}>
        <Link href="/creative" className={s.logo} aria-label="Kllezo Creative home">
          <Logo size={28} />
        </Link>
        <div className={s.right}>
          <ExperienceSwitch current="creative" className={s.switch}>
            <span>Business view</span>
            <i aria-hidden="true">⇄</i>
          </ExperienceSwitch>
          <Link href="/creative/contact" className={s.begin}>
            Begin a project
          </Link>
          <button className={s.menuBtn} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="creative-menu">
            <span>{open ? "Close" : "Menu"}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div id="creative-menu" className={s.menu} data-open={open || undefined} aria-hidden={!open} inert={!open}>
        <nav className={s.menuMain} aria-label="Primary">
          {main.map((m, i) => (
            <Link key={m.href} href={m.href} style={{ ["--i" as string]: i }} data-active={pathname === m.href || undefined}>
              <small>0{i + 1}</small>
              {m.label}
            </Link>
          ))}
        </nav>
        <div className={s.menuSide}>
          {divisions.map((d) => (
            <div key={d.id}>
              <span className={s.menuHead}>{d.name}</span>
              {services
                .filter((sv) => sv.division === d.id)
                .map((sv) => (
                  <Link key={sv.slug} href={`/creative/services/${sv.slug}`}>
                    {sv.name}
                  </Link>
                ))}
            </div>
          ))}
          <div className={s.menuFoot}>
            <ExperienceSwitch current="creative" className={s.menuSwitch}>
              Switch to the Business experience →
            </ExperienceSwitch>
            <Link href="/?choose">Back to the two worlds</Link>
          </div>
        </div>
      </div>
    </>
  );
}
