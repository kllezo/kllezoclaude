import OriginalShell from "@/components/creative/OriginalShell";
import WorkBrowser from "@/components/shared/WorkBrowser";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/work",
  title: "Work",
  description: "Kllezo case studies in content, websites and AI — published only with results our clients have verified.",
});

export default function CreativeWork() {
  return (
    <OriginalShell back={{ href: "/creative", label: "Back To Universe" }}>
      <div className="landing-hero">
        <div className="hero-subtitle">Work</div>
        <h1 className="hero-title">Selected Work</h1>
        <p className="hero-desc">Each case study is published with the results our clients have verified — nothing estimated, nothing invented.</p>
      </div>
      <div className="kz-page kz-page-wide">
        <WorkBrowser exp="creative" />
      </div>
    </OriginalShell>
  );
}
