import Link from "next/link";
import WorkBrowser from "@/components/shared/WorkBrowser";
import SiteShowcase from "@/components/business/SiteShowcase";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "business",
  path: "/work",
  title: "Our Work & Case Studies",
  description:
    "Kllezo case studies across content creation, personal branding, video production, business websites, e-commerce, lead generation and AI automation.",
});

const structure = ["Client introduction", "Initial problem", "Strategy", "Execution", "Deliverables", "Verified results", "Screenshots & video"];

export default function BusinessWork() {
  return (
    <>
      <section className={p.hero}>
        <div className={b.wrap}>
          <span className={b.eyebrow} data-arrive-item>
            Our work
          </span>
          <h1 className={b.h1} data-arrive-item>
            Proof, <span className={b.serif}>not promises.</span>
          </h1>
          <p className={b.lead} data-arrive-item>
            Every case study follows the same structure, so you can see exactly what was done and what changed.
          </p>
          <ol className={p.structure} data-arrive-item>
            {structure.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className={`${b.section} ${b.white}`} style={{ paddingTop: 56 }}>
        <div className={b.wrap}>
          <WorkBrowser exp="business" />
        </div>
      </section>
      <section className={b.section}>
        <div className={b.wrap}>
          <div className={b.head}>
            <div>
              <span className={b.eyebrow}>What we build</span>
              <h2 className={b.h2}>The systems behind the work.</h2>
            </div>
            <p className={b.lead}>Illustrative interfaces of the website experiences we design and build.</p>
          </div>
          <SiteShowcase />
          <div className={b.actions}>
            <Link href="/business/contact" className={b.btn}>
              Book a Strategy Call →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
