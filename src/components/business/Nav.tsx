"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/shared/Logo";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { divisions, services } from "@/content/services";
import s from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menus on route change
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const active = (p: string) => pathname === p || pathname.startsWith(p + "/");
  const links = [
    { href: "/business/work", label: "Work" },
    { href: "/business/about", label: "About" },
  ];

  return (
    <header className={s.nav} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className={s.inner}>
        <Link href="/business" className={s.logo} aria-label="Kllezo Business home">
          <Logo size={28} />
        </Link>

        <nav className={s.links} aria-label="Primary">
          <div className={s.hasMega} onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <Link href="/business/services" className={s.link} data-active={active("/business/services") || undefined} aria-expanded={mega} onFocus={() => setMega(true)}>
              Services
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
            <div className={s.mega} data-open={mega || undefined}>
              {divisions.map((d) => (
                <div key={d.id} className={s.megaCol}>
                  <span className={s.megaHead}>
                    <b>{d.index}</b> {d.name}
                  </span>
                  {services
                    .filter((sv) => sv.division === d.id)
                    .map((sv) => (
                      <Link key={sv.slug} href={`/business/services/${sv.slug}`} className={s.megaItem} onBlur={(e) => !e.currentTarget.closest(`.${s.hasMega}`)?.contains(e.relatedTarget as Node) && setMega(false)}>
                        <span>{sv.name}</span>
                        <small>{sv.tagline}</small>
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={s.link} data-active={active(l.href) || undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={s.right}>
          <ExperienceSwitch current="business" className={s.switch}>
            <span className={s.switchTrack} aria-hidden="true">
              <i />
            </span>
            <span className={s.switchLabel}>Creative view</span>
          </ExperienceSwitch>
          <Link href="/business/contact" className={s.cta}>
            Book a Strategy Call
          </Link>
          <button className={s.burger} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="biz-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <i />
            <i />
          </button>
        </div>
      </div>

      <div id="biz-menu" className={s.sheet} hidden={!open}>
        <nav aria-label="Mobile">
          <Link href="/business/services" className={s.sheetMain}>
            Services
          </Link>
          <div className={s.sheetServices}>
            {services.map((sv) => (
              <Link key={sv.slug} href={`/business/services/${sv.slug}`}>
                {sv.name}
              </Link>
            ))}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={s.sheetMain}>
              {l.label}
            </Link>
          ))}
          <Link href="/business/contact" className={s.sheetMain}>
            Contact
          </Link>
        </nav>
        <div className={s.sheetFoot}>
          <Link href="/business/contact" className={s.sheetCta}>
            Book a Strategy Call
          </Link>
          <ExperienceSwitch current="business" className={s.sheetSwitch}>
            Switch to the Creative experience →
          </ExperienceSwitch>
          <Link href="/?choose" className={s.sheetChoose}>
            Back to the two worlds
          </Link>
        </div>
      </div>
    </header>
  );
}
