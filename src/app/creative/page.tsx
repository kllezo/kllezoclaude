import Link from "next/link";
import { CreativeHero, FilmStrip, FloatingBrowsers, Manifesto, Rise, ServiceIndex, VoiceScene } from "@/components/creative/Scenes";
import Still from "@/components/creative/Still";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import c from "@/components/creative/c.module.css";
import s from "./home.module.css";

export const metadata = pageMeta({
  exp: "creative",
  path: "",
  title: "Content that attracts. Websites that convert. AI that closes.",
  description:
    "The Creative world of Kllezo: cinematic content, immersive websites and AI that speaks for your brand — for luxury, hospitality, lifestyle and personal brands that want to be desired.",
});

export default function CreativeHome() {
  return (
    <>
      <CreativeHero />

      <section className={c.section}>
        <div className={c.wrap}>
          <span className={c.kicker}>Prologue</span>
          <div className={s.manifesto}>
            <Manifesto
              text="Growth doesn't come from doing more. It comes from doing the right things — beautifully. We make brands people stop for, stay with, and remember."
              highlight={["right", "beautifully", "remember"]}
            />
          </div>
        </div>
      </section>

      <FilmStrip />
      <FloatingBrowsers />
      <VoiceScene />

      <section className={c.section}>
        <div className={c.wrap}>
          <Rise className={s.indexHead}>
            <span className={c.kicker}>The index</span>
            <h2 className={c.h2}>
              Nine crafts. <span className={c.italic}>One studio.</span>
            </h2>
          </Rise>
          <ServiceIndex />
        </div>
      </section>

      <section className={s.belief}>
        <Still mood="gold" ratio="auto" className={s.beliefStill} />
        <div className={s.beliefCopy}>
          <Rise>
            <span className={c.kicker}>The feeling, and the system</span>
            <p className={s.beliefText}>
              We sell the feeling. Underneath it, we build the system — so the attention you earn turns into <em>enquiries, bookings and customers.</em>
            </p>
            <div className={c.actions}>
              <Link href="/creative/contact" className={c.btn}>
                Begin a project →
              </Link>
              <Link href="/business" className={c.btnLine}>
                See the system view
              </Link>
            </div>
          </Rise>
        </div>
      </section>

      <section className={`${c.section} ${s.closing}`}>
        <div className={c.wrap}>
          <Rise>
            <p className={s.closingText}>{site.closing}</p>
          </Rise>
        </div>
      </section>
    </>
  );
}
