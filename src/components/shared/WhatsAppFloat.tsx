"use client";

import { whatsappLink } from "@/content/site";
import { WaIcon } from "./EnquiryForm";
import { track } from "@/lib/analytics";
import s from "./WhatsAppFloat.module.css";

export default function WhatsAppFloat() {
  const href = whatsappLink();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${s.fab} ${s.business}`}
      onClick={() => track("whatsapp_click", { location: "floating" })}
      aria-label="Chat with Kllezo on WhatsApp"
    >
      <WaIcon />
      <span>WhatsApp</span>
    </a>
  );
}
