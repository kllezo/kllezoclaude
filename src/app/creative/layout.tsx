import type { Viewport } from "next";
import Nav from "@/components/creative/Nav";
import Footer from "@/components/creative/Footer";
import SmoothScroll from "@/components/creative/SmoothScroll";
import Arrival from "@/components/shared/Arrival";
import Reveal from "@/components/shared/Reveal";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import c from "@/components/creative/c.module.css";

export const viewport: Viewport = { themeColor: "#0B0B0B" };

export default function CreativeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`exp-creative ${c.exp}`}>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat exp="creative" />
      <SmoothScroll />
      <Arrival exp="creative" />
      <Reveal />
    </div>
  );
}
