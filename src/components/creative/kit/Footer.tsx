import Link from "next/link";
import ExperienceSwitch from "@/components/shared/ExperienceSwitch";
import { divisions, servicesIn } from "@/content/services";
import { site, whatsappLink } from "@/content/site";
import Lines from "./Lines";

export default function Footer() {
  const wa = whatsappLink();
  return (
    <footer className="cx-footer">
      <div className="cx-wrap">
        <div className="cx-footer-top">
          <Lines as="p" className="cx-footer-big" lines={["Creative brains,", <em key="e">automated gains.</em>]} />
          <Link href="/creative/contact" className="cx-orb-btn" data-cx-magnetic data-cursor="Talk">
            <span>Start a project</span>
          </Link>
        </div>
        <div className="cx-footer-grid">
          {divisions.map((d) => (
            <div key={d.id}>
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
          <div>
            <p className="cx-kicker">Studio</p>
            <ul>
              <li>
                <Link href="/creative/work">Work</Link>
              </li>
              <li>
                <Link href="/creative/about">About</Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="cx-footer-base">
          <span>© {new Date().getFullYear()} Kllezo</span>
          <span>{site.tagline}</span>
          <ExperienceSwitch current="creative" className="cx-underline">
            Business view
          </ExperienceSwitch>
        </div>
      </div>
    </footer>
  );
}
