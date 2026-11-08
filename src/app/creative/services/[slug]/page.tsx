import { notFound } from "next/navigation";
import OriginalServices from "@/components/creative/OriginalServices";
import JsonLd from "@/components/shared/JsonLd";
import { serviceBySlug, services } from "@/content/services";
import { loadOriginalPage, originalPageFor, primarySlug } from "@/lib/creativeOriginal";
import { breadcrumbLd, pageMeta, serviceLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((sv) => ({ slug: sv.slug }));
}

export async function generateMetadata({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) return {};
  const original = originalPageFor(sv.slug, sv.division);
  const page = loadOriginalPage(original);
  // Services in one system share the original system page, so they share its canonical URL.
  return pageMeta({ exp: "creative", path: `/services/${primarySlug[original]}`, title: page.title, description: page.description });
}

export default async function CreativeServiceDetail({ params }: PageProps<"/creative/services/[slug]">) {
  const { slug } = await params;
  const sv = serviceBySlug(slug);
  if (!sv) notFound();
  const page = loadOriginalPage(originalPageFor(sv.slug, sv.division), sv.slug);
  return (
    <>
      <OriginalServices html={page.html} />
      <JsonLd data={serviceLd(sv, "creative")} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Kllezo", path: "/creative" },
          { name: "Services", path: "/creative/services" },
          { name: sv.name, path: `/creative/services/${sv.slug}` },
        ])}
      />
    </>
  );
}
