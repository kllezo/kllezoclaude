import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { divisions, services } from "@/content/services";
import { site } from "@/content/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <Logo size={34} tone="beige" />
          <p className={s.pos}>{site.positioning}</p>
          <p className={s.tag}>{site.tagline}</p>
        </div>
        {divisions.map((d) => (
          <div key={d.id} className={s.col}>
            <span className={s.head}>{d.name}</span>
            {services
              .filter((sv) => sv.division === d.id)
              .map((sv) => (
                <Link key={sv.slug} href={`/services/${sv.slug}`}>
                  {sv.name}
                </Link>
              ))}
          </div>
        ))}
        <div className={s.col}>
          <span className={s.head}>Company</span>
          <Link href="/services">All services</Link>
          <Link href="/growth">Growth System</Link>
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Strategy call</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} Kllezo. {site.closing}</span>
        <span className={s.exp}>
          <Link href="/growth">Growth System</Link> · <Link href="/contact">Book a strategy call</Link>
        </span>
      </div>
    </footer>
  );
}
