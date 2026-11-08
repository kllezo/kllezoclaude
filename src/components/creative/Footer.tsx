import Link from "next/link";
import Logo from "@/components/shared/Logo";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { services } from "@/content/services";
import { site } from "@/content/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <Link href="/creative/contact" className={s.big}>
        <span>Let&apos;s make</span>
        <span>
          something <em>unforgettable.</em>
        </span>
        <i aria-hidden="true">→</i>
      </Link>
      <div className={s.grid}>
        <div>
          <Logo size={28} />
          <p className={s.closing}>{site.closing}</p>
        </div>
        <nav aria-label="Services" className={s.services}>
          {services.map((sv) => (
            <Link key={sv.slug} href={`/creative/services/${sv.slug}`}>
              {sv.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Studio" className={s.studio}>
          <Link href="/creative/work">Work</Link>
          <Link href="/creative/about">About</Link>
          <Link href="/creative/contact">Contact</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} Kllezo</span>
        <span>
          You&apos;re in the Creative experience ·{" "}
          <ExperienceSwitch current="creative" className={s.sw}>
            Switch to Business
          </ExperienceSwitch>{" "}
          · <Link href="/?choose">Choose again</Link>
        </span>
      </div>
    </footer>
  );
}
