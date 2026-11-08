import Link from "next/link";
import Logo from "@/components/shared/Logo";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { divisions, services } from "@/content/services";
import { site } from "@/content/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <Logo size={30} />
          <p className={s.pos}>{site.positioning}</p>
          <p className={s.tag}>{site.tagline}</p>
        </div>
        {divisions.map((d) => (
          <div key={d.id} className={s.col}>
            <span className={s.head}>{d.name}</span>
            {services
              .filter((sv) => sv.division === d.id)
              .map((sv) => (
                <Link key={sv.slug} href={`/business/services/${sv.slug}`}>
                  {sv.name}
                </Link>
              ))}
          </div>
        ))}
        <div className={s.col}>
          <span className={s.head}>Company</span>
          <Link href="/business/services">All services</Link>
          <Link href="/business/work">Work</Link>
          <Link href="/business/about">About</Link>
          <Link href="/business/contact">Strategy call</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} Kllezo. {site.closing}</span>
        <span className={s.exp}>
          You&apos;re in the Business experience ·{" "}
          <ExperienceSwitch current="business" className={s.switch}>
            Switch to Creative
          </ExperienceSwitch>{" "}
          · <Link href="/?choose">Choose again</Link>
        </span>
      </div>
    </footer>
  );
}
