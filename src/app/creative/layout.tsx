import type { Viewport } from "next";
import Arrival from "@/components/shared/Arrival";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";

/* The Creative experience is the original Kllezo website (kllezo-v3), restored.
   Its pages bring their own original headers, so this layout only adds the
   shared pieces: the arrival hand-off and the WhatsApp contact. */
export const viewport: Viewport = { themeColor: "#050608" };

export default function CreativeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="exp-creative">
      <div id="main">{children}</div>
      <WhatsAppFloat exp="creative" />
      <Arrival exp="creative" />
    </div>
  );
}
