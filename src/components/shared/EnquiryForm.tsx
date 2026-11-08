"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { budgets, industries, whatsappLink, type Experience } from "@/content/site";
import { divisions, services } from "@/content/services";
import { track } from "@/lib/analytics";
import s from "./EnquiryForm.module.css";

/* The shared enquiry flow. Both experiences post to the same
   /api/enquiries endpoint; only the styling differs (variant). */

type Errors = Record<string, string>;

export default function EnquiryForm({ exp }: { exp: Experience }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const preselected = (params.get("service") ?? "").split(",").filter((x) => services.some((sv) => sv.slug === x));
  const [selected, setSelected] = useState<string[]>(preselected);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);
  const wa = whatsappLink();

  const toggle = (slug: string) => setSelected((cur) => (cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { ...Object.fromEntries(fd.entries()), services: selected, experience: exp, sourcePath: pathname };
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.errors ?? {});
        setMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        const first = Object.keys(json.errors ?? {})[0];
        if (first) document.getElementById(`f-${first}`)?.focus();
        return;
      }
      setStatus("done");
      track("enquiry_submitted", { services: selected.join(","), budget: String(body.budget ?? "") });
      window.scrollTo({ top: (document.getElementById("enquiry")?.offsetTop ?? 0) - 80, behavior: "smooth" });
    } catch {
      setMessage("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={`${s.form} ${s[exp]} ${s.done}`} role="status" id="enquiry">
        <span className={s.check} aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" />
            <path d="M14 24.5l6.5 6.5L34 17.5" />
          </svg>
        </span>
        <h3 className={s.doneTitle}>Thank you — your enquiry is with us.</h3>
        <p className={s.doneText}>
          The Kllezo team has been notified and will reply within one business day with next steps for your strategy call.
        </p>
        {wa && (
          <a className={s.wa} href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "enquiry_confirmation" })}>
            <WaIcon /> Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <span className={s.err} id={`e-${k}`}>
        {errors[k]}
      </span>
    ) : null;
  const a = (k: string) => ({ id: `f-${k}`, name: k, "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <form
      id="enquiry"
      className={`${s.form} ${s[exp]}`}
      onSubmit={submit}
      noValidate
      onFocus={() => {
        if (!started) {
          setStarted(true);
          track("enquiry_started");
        }
      }}
    >
      <div className={s.row}>
        <label className={s.field}>
          <span>Full name</span>
          <input {...a("fullName")} autoComplete="name" required />
          {err("fullName")}
        </label>
        <label className={s.field}>
          <span>Business name</span>
          <input {...a("businessName")} autoComplete="organization" required />
          {err("businessName")}
        </label>
      </div>
      <div className={s.row}>
        <label className={s.field}>
          <span>Email</span>
          <input {...a("email")} type="email" autoComplete="email" inputMode="email" required />
          {err("email")}
        </label>
        <label className={s.field}>
          <span>Mobile number</span>
          <input {...a("mobile")} type="tel" autoComplete="tel" inputMode="tel" required />
          {err("mobile")}
        </label>
      </div>
      <div className={s.row}>
        <label className={s.field}>
          <span>
            Website <em>optional</em>
          </span>
          <input {...a("website")} type="url" inputMode="url" placeholder="yourbusiness.com" />
          {err("website")}
        </label>
        <label className={s.field}>
          <span>Industry</span>
          <select {...a("industry")} defaultValue="" required>
            <option value="" disabled>
              Choose your industry
            </option>
            {industries.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
          {err("industry")}
        </label>
      </div>

      <fieldset className={s.services} aria-describedby={errors.services ? "e-services" : undefined}>
        <legend>
          Services you&apos;re interested in <em>choose any</em>
        </legend>
        {divisions.map((d) => (
          <div key={d.id} className={s.group}>
            <span className={s.groupName}>{d.name}</span>
            <div className={s.chips}>
              {services
                .filter((sv) => sv.division === d.id)
                .map((sv) => (
                  <label key={sv.slug} className={s.chip} data-on={selected.includes(sv.slug) || undefined}>
                    <input type="checkbox" checked={selected.includes(sv.slug)} onChange={() => toggle(sv.slug)} id={sv.slug === services[0].slug ? "f-services" : undefined} />
                    <span>{sv.name}</span>
                  </label>
                ))}
            </div>
          </div>
        ))}
        {err("services")}
      </fieldset>

      <label className={s.field}>
        <span>Business requirements</span>
        <textarea {...a("requirements")} rows={4} placeholder="What are you trying to achieve? What's not working today?" required />
        {err("requirements")}
      </label>

      <fieldset className={s.budget}>
        <legend>Budget range</legend>
        <div className={s.chips}>
          {budgets.map((b, i) => (
            <label key={b} className={s.chip}>
              <input type="radio" name="budget" value={b} id={i === 0 ? "f-budget" : undefined} />
              <span>{b}</span>
            </label>
          ))}
        </div>
        {err("budget")}
      </fieldset>

      <label className={s.field}>
        <span>
          Additional message <em>optional</em>
        </span>
        <textarea {...a("message")} rows={3} />
      </label>

      {/* Honeypot — hidden from people and assistive tech */}
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className={s.hp} aria-hidden="true" />

      {status === "error" && (
        <p className={s.formErr} role="alert">
          {message}
        </p>
      )}

      <div className={s.actions}>
        <button type="submit" className={s.submit} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : exp === "creative" ? "Begin the conversation" : "Book my strategy call"}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 9h12M10 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {wa && (
          <a className={s.waInline} href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "enquiry_form" })}>
            <WaIcon /> Prefer WhatsApp?
          </a>
        )}
      </div>
      <p className={s.privacy}>We only use your details to respond to your enquiry.</p>
    </form>
  );
}

export function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.2-.2-.4-.3Z"
      />
    </svg>
  );
}
