import { Suspense } from "react";
import EnquiryForm, { WaIcon } from "@/components/shared/EnquiryForm";
import { site, whatsappLink } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import b from "@/components/business/b.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "business",
  path: "/contact",
  title: "Book a Strategy Call",
  description: "Tell Kllezo about your business and the services you're interested in. We'll reply within one business day to arrange a strategy call.",
});

const next = [
  { t: "We review your enquiry", d: "The team reads every enquiry personally — usually within one business day." },
  { t: "Strategy call", d: "A focused conversation about your goals, what's not working and where the biggest opportunity is." },
  { t: "Clear proposal", d: "A written recommendation with scope, timeline and investment. No obligation." },
];

export default function BusinessContact() {
  const wa = whatsappLink();
  return (
    <section className={p.contact}>
      <div className={`${b.wrap} ${p.contactGrid}`}>
        <div className={p.contactSide}>
          <span className={b.eyebrow} data-arrive-item>
            Strategy call
          </span>
          <h1 className={`${b.h1} ${p.contactH1}`} data-arrive-item>
            Let&apos;s build your <span className={b.serif}>growth system.</span>
          </h1>
          <p className={b.lead} data-arrive-item>
            Choose as many services as you need — we&apos;ll recommend how they fit together.
          </p>
          <ol className={p.next} data-arrive-item>
            {next.map((n, i) => (
              <li key={n.t}>
                <span>{i + 1}</span>
                <div>
                  <b>{n.t}</b>
                  <p>{n.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={p.direct} data-arrive-item>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <WaIcon /> WhatsApp us
              </a>
            )}
          </div>
        </div>
        <div data-arrive-item>
          <Suspense>
            <EnquiryForm exp="business" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
