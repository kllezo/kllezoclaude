import { Suspense } from "react";
import OriginalShell from "@/components/creative/OriginalShell";
import EnquiryForm from "@/components/shared/EnquiryForm";
import { site, whatsappLink } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/contact",
  title: "Book A Strategy Call",
  description: "Tell Kllezo about your business and the systems you need. We'll reply within one business day.",
});

export default function CreativeContact() {
  const wa = whatsappLink();
  return (
    <OriginalShell back={{ href: "/creative", label: "Back To Universe" }}>
      <div className="landing-hero">
        <div className="hero-subtitle">Strategy Call</div>
        <h1 className="hero-title">Book A Strategy Call</h1>
        <p className="hero-desc">Tell us about your business and the systems you need. We&apos;ll reply within one business day.</p>
        <p className="kz-direct">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
        </p>
      </div>
      <div className="kz-page">
        <Suspense>
          <EnquiryForm exp="creative" />
        </Suspense>
      </div>
    </OriginalShell>
  );
}
