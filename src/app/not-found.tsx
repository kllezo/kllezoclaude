import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <main
      id="main"
      className="entry"
      style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24, background: "#0B0B0B", color: "#FBF5E9" }}
    >
      <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
        <Logo size={30} />
        <h1 style={{ fontFamily: "var(--f-serif)", fontWeight: 400, fontSize: "clamp(40px, 7vw, 88px)", lineHeight: 1 }}>
          This frame <em style={{ color: "#C8A25A" }}>doesn&apos;t exist.</em>
        </h1>
        <p style={{ color: "rgba(251,245,233,0.6)" }}>Choose where you&apos;d like to go next.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/creative" style={{ padding: "14px 22px", background: "#C8A25A", color: "#0B0B0B", fontWeight: 600 }}>
            Creative experience
          </Link>
          <Link href="/business" style={{ padding: "14px 22px", background: "#FBF5E9", color: "#09453E", fontWeight: 600, borderRadius: 999 }}>
            Business experience
          </Link>
        </div>
      </div>
    </main>
  );
}
