import { Suspense } from "react";
import Lines from "@/components/creative/kit/Lines";
import EnquiryForm from "@/components/shared/EnquiryForm";
import { site, whatsappLink } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/contact",
  title: "Start a project",
  description: "Tell Kllezo about your brand and what you want to build. We reply within one business day.",
});

export default function CreativeContact() {
  const wa = whatsappLink();
  return (
    <section className="cx-contact cx-wrap">
      <div className="cx-contact-intro">
        <p className="cx-kicker" data-cx-fade>
          Start a project
        </p>
        <Lines as="h1" className="cx-display" lines={["Have something", <>worth <em key="n">noticing?</em></>]} />
        <p className="cx-page-lede" data-cx-fade="0.3">
          Tell us about the brand, the moment and what you want people to feel. We reply within one business day with next steps — never a sales script.
        </p>
        <div className="cx-contact-direct" data-cx-fade="0.4">
          <a href={`mailto:${site.email}`} className="cx-underline">
            {site.email}
          </a>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="cx-underline">
              WhatsApp
            </a>
          )}
        </div>
      </div>
      <div className="cx-contact-form" data-cx-fade="0.2">
        <Suspense>
          <EnquiryForm exp="creative" />
        </Suspense>
      </div>
    </section>
  );
}
