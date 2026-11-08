import { Suspense } from "react";
import EnquiryForm from "@/components/shared/EnquiryForm";
import GoldFlow from "@/components/shared/GoldFlow";
import { site, whatsappLink } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "creative",
  path: "/contact",
  title: "Begin a Project",
  description: "Tell Kllezo about your brand. We'll reply within one business day to begin the conversation.",
});

export default function CreativeContact() {
  const wa = whatsappLink();
  return (
    <section className={p.contact}>
      <div className={p.contactBg} aria-hidden="true">
        <GoldFlow ribbons={5} intensity={0.6} focus={0.2} />
      </div>
      <div className={`${c.wrap} ${p.contactGrid}`}>
        <div className={p.contactSide}>
          <span className={c.kicker} data-arrive-item>
            Begin
          </span>
          <h1 className={c.h2} data-arrive-item>
            Tell us what you want people to <span className={c.italic}>feel.</span>
          </h1>
          <p className={c.body} data-arrive-item>
            Choose as many crafts as you like. We&apos;ll come back within one business day to begin the conversation.
          </p>
          <div className={p.direct} data-arrive-item>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer">
                WhatsApp →
              </a>
            )}
          </div>
        </div>
        <div data-arrive-item>
          <Suspense>
            <EnquiryForm exp="creative" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
