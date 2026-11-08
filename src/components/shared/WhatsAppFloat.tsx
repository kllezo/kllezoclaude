"use client";

import { whatsappLink, type Experience } from "@/content/site";
import { WaIcon } from "./EnquiryForm";
import { track } from "@/lib/analytics";
import s from "./WhatsAppFloat.module.css";

export default function WhatsAppFloat({ exp }: { exp: Experience }) {
  const href = whatsappLink();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${s.fab} ${s[exp]}`}
      onClick={() => track("whatsapp_click", { location: "floating" })}
      aria-label="Chat with Kllezo on WhatsApp"
    >
      <WaIcon />
      <span>WhatsApp</span>
    </a>
  );
}
