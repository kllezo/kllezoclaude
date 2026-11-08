/* ============================================================
   Case studies — CMS-ready.
   Each entry follows the PRD structure. Results are optional and
   must only be filled with figures the client has verified.
   Publish a case study by adding it here (or to the Supabase
   `case_studies` table — see supabase/migrations) with
   `published: true`. Nothing is fabricated: until real case
   studies are approved, the Work pages show the categories and
   an honest "being documented" state.
   ============================================================ */

export const workCategories = [
  { id: "content", label: "Content creation" },
  { id: "personal-brand", label: "Personal branding" },
  { id: "video", label: "Video production" },
  { id: "business-website", label: "Business websites" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "lead-generation", label: "Lead generation" },
  { id: "ai-automation", label: "AI automation" },
] as const;

export type WorkCategoryId = (typeof workCategories)[number]["id"];

export interface VerifiedResult {
  label: string;
  value: string;
  /** Who verified it and how, e.g. "Client analytics, Mar–May 2026". Required. */
  source: string;
}

export interface CaseStudy {
  slug: string;
  published: boolean;
  client: string;
  intro: string;
  categories: WorkCategoryId[];
  problem: string;
  strategy: string;
  execution: string;
  deliverables: string[];
  results?: VerifiedResult[];
  media: { type: "image" | "video"; src: string; alt: string }[];
}

export const caseStudies: CaseStudy[] = [];

export const publishedCaseStudies = () => caseStudies.filter((c) => c.published);
