import WorkBrowser from "@/components/shared/WorkBrowser";
import Still from "@/components/creative/Still";
import { Rise } from "@/components/creative/Scenes";
import { pageMeta } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import p from "../pages.module.css";

export const metadata = pageMeta({
  exp: "creative",
  path: "/work",
  title: "Work",
  description: "Selected Kllezo work in content, personal branding, film, websites, e-commerce, lead generation and AI.",
});

export default function CreativeWork() {
  return (
    <>
      <section className={p.hero}>
        <div className={c.wrap}>
          <span className={c.kicker} data-arrive-item>
            Work
          </span>
          <h1 className={c.display} data-arrive-item>
            The <span className={c.italic}>reel.</span>
          </h1>
          <p className={`${c.body} ${p.lede}`} data-arrive-item>
            Each story is told in full — the brand, the problem, the idea, the making, and only the results our clients have verified.
          </p>
        </div>
      </section>
      <section className={p.strip} aria-hidden="true">
        <Still mood="dusk" ratio="16 / 9" />
        <Still mood="tide" ratio="16 / 9" />
        <Still mood="ember" ratio="16 / 9" />
      </section>
      <section className={c.section}>
        <div className={c.wrap}>
          <Rise>
            <WorkBrowser exp="creative" />
          </Rise>
        </div>
      </section>
    </>
  );
}
