import Lines from "@/components/creative/kit/Lines";
import ServiceIndex from "@/components/creative/ServiceIndex";
import { services } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/services",
  title: "Services",
  description: "Content, websites and AI agents — nine services from Kllezo's three divisions, designed to work as one system.",
});

export default function CreativeServices() {
  return (
    <>
      <section className="cx-page-hero cx-wrap">
        <p className="cx-kicker" data-cx-fade>
          Services — {services.length} ways in, one system
        </p>
        <Lines as="h1" className="cx-display" lines={["Everything a brand", <>needs to be <em key="w">wanted.</em></>]} />
        <p className="cx-page-lede" data-cx-fade="0.3">
          Choose a single service or connect all three divisions. Every one is planned, made and measured by the same studio.
        </p>
      </section>
      <div className="cx-wrap">
        <ServiceIndex />
      </div>
    </>
  );
}
