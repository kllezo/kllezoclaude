import type { Viewport } from "next";
import Arrival from "@/components/shared/Arrival";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import Nav from "@/components/creative/kit/Nav";
import Footer from "@/components/creative/kit/Footer";
import Cursor from "@/components/creative/kit/Cursor";
import Motion from "@/components/creative/kit/Motion";
import "@/components/creative/kit/creative.css";

/* Kllezo Creative — "Molten". Dark, editorial, cinematic; one motion system
   (kit/Motion) owns scrolling and every scroll-linked animation. */
export const viewport: Viewport = { themeColor: "#070A09" };

export default function CreativeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cx exp-creative">
      {/* Reveal targets start hidden (see creative.css); without JavaScript, show everything. */}
      <noscript>
        <style>{`.cx [data-cx-fade]{opacity:1!important;visibility:visible!important}.cx .cx-line>span{transform:none!important}.cx [data-cx-clip]{clip-path:none!important}`}</style>
      </noscript>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <Cursor />
      <Motion />
      <WhatsAppFloat exp="creative" />
      <Arrival exp="creative" />
    </div>
  );
}
