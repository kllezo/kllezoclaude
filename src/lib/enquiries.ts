/* ============================================================
   Enquiry backend — shared by both experiences.
   · Storage: Supabase (PostgREST) when SUPABASE_URL and
     SUPABASE_SERVICE_ROLE_KEY are set; otherwise a local JSONL
     file in development so the flow is testable offline.
   · Notification: Resend when RESEND_API_KEY is set.
   No SDKs — plain fetch keeps the server bundle small.
   ============================================================ */

import { budgets, industries, type Experience } from "@/content/site";
import { serviceBySlug, services } from "@/content/services";

export interface Enquiry {
  fullName: string;
  businessName: string;
  email: string;
  mobile: string;
  website?: string;
  industry: string;
  services: string[];
  requirements: string;
  budget: string;
  message?: string;
  experience: Experience;
  sourcePath?: string;
}

export type ValidationResult = { ok: true; data: Enquiry } | { ok: false; errors: Record<string, string> };

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateEnquiry(input: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};
  const data: Enquiry = {
    fullName: str(input.fullName, 120),
    businessName: str(input.businessName, 160),
    email: str(input.email, 200).toLowerCase(),
    mobile: str(input.mobile, 32),
    website: str(input.website, 300) || undefined,
    industry: str(input.industry, 80),
    services: Array.isArray(input.services)
      ? input.services.filter((s): s is string => typeof s === "string" && !!serviceBySlug(s)).slice(0, services.length)
      : [],
    requirements: str(input.requirements, 4000),
    budget: str(input.budget, 80),
    message: str(input.message, 4000) || undefined,
    experience: input.experience === "creative" ? "creative" : "business",
    sourcePath: str(input.sourcePath, 300) || undefined,
  };

  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (data.businessName.length < 2) errors.businessName = "Please enter your business name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.mobile.replace(/[^\d]/g, "").length < 8) errors.mobile = "Please enter a valid mobile number.";
  if (data.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+.*$/i.test(data.website)) errors.website = "That doesn't look like a web address.";
  if (!industries.includes(data.industry)) errors.industry = "Please choose your industry.";
  if (data.services.length === 0) errors.services = "Choose at least one service.";
  if (data.requirements.length < 10) errors.requirements = "Tell us a little about what you need.";
  if (!budgets.includes(data.budget)) errors.budget = "Please choose a budget range.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export async function saveEnquiry(e: Enquiry): Promise<{ id: string; stored: "supabase" | "local" }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/enquiries`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        full_name: e.fullName,
        business_name: e.businessName,
        email: e.email,
        mobile: e.mobile,
        website: e.website ?? null,
        industry: e.industry,
        services: e.services,
        requirements: e.requirements,
        budget: e.budget,
        message: e.message ?? null,
        experience: e.experience,
        source_path: e.sourcePath ?? null,
      }),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
    const [row] = (await res.json()) as { id: string }[];
    return { id: row.id, stored: "supabase" };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Enquiry storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  // Development fallback: append to .data/enquiries.jsonl
  const { mkdir, appendFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  const id = crypto.randomUUID();
  await appendFile(path.join(dir, "enquiries.jsonl"), JSON.stringify({ id, createdAt: new Date().toISOString(), ...e }) + "\n");
  return { id, stored: "local" };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function notifyTeam(e: Enquiry, id: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.KLLEZO_NOTIFY_EMAIL;
  if (!key || !to) return false;

  const serviceNames = e.services.map((s) => serviceBySlug(s)?.name ?? s).join(", ");
  const rows: [string, string | undefined][] = [
    ["Name", e.fullName],
    ["Business", e.businessName],
    ["Email", e.email],
    ["Mobile", e.mobile],
    ["Website", e.website],
    ["Industry", e.industry],
    ["Services", serviceNames],
    ["Budget", e.budget],
    ["Requirements", e.requirements],
    ["Message", e.message],
    ["Experience", e.experience],
    ["Page", e.sourcePath],
    ["Reference", id],
  ];
  const html = `<h2 style="font-family:Georgia,serif;color:#09453E">New Kllezo enquiry</h2><table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#687B75;vertical-align:top">${k}</td><td>${esc(v!).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.KLLEZO_FROM_EMAIL ?? "Kllezo Website <website@kllezo.com>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: e.email,
      subject: `New enquiry — ${e.businessName} (${serviceNames})`,
      html,
    }),
  });
  return res.ok;
}
