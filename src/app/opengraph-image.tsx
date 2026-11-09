import { ImageResponse } from "next/og";

export const alt = "Kllezo — Content that attracts. Websites that convert. AI that closes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0B0B0B", color: "#FBF5E9", fontFamily: "Georgia, serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, borderRight: "1px solid rgba(200,162,90,0.3)" }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: "#C8A25A", fontFamily: "monospace" }}>KLLEZO</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 60, lineHeight: 1.05 }}>
            <span>Stop losing</span>
            <span style={{ display: "flex" }}>
              customers <span style={{ color: "#C8A25A", fontStyle: "italic", marginLeft: 16 }}>you already have.</span>
            </span>
          </div>
          <div style={{ fontSize: 22, color: "rgba(251,245,233,0.6)", fontFamily: "sans-serif" }}>Content that attracts. Websites that convert. AI that closes.</div>
        </div>
        <div style={{ width: 380, display: "flex", flexDirection: "column", background: "#FBF5E9", color: "#09453E", padding: 56, justifyContent: "flex-end" }}>
          <div style={{ fontSize: 18, letterSpacing: 4, fontFamily: "monospace" }}>CONTENT · WEB · AI</div>
          <div style={{ fontSize: 40, marginTop: 16, lineHeight: 1.1 }}>Hire one. Or let us run it all.</div>
        </div>
      </div>
    ),
    size,
  );
}
