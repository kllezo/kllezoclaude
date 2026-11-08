import Image from "next/image";
import Lines from "@/components/creative/kit/Lines";
import WorkBrowser from "@/components/shared/WorkBrowser";
import { studioFrames } from "@/content/creativeMedia";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "/work",
  title: "Work",
  description: "Kllezo case studies in content, websites and AI — published only with results our clients have verified.",
});

const wall = [studioFrames[0], studioFrames[4], studioFrames[10], studioFrames[2], studioFrames[6], studioFrames[8]];

export default function CreativeWork() {
  return (
    <>
      <section className="cx-page-hero cx-wrap">
        <p className="cx-kicker" data-cx-fade>
          Work
        </p>
        <Lines as="h1" className="cx-display" lines={["Proof, not", <em key="p">promises.</em>]} />
        <p className="cx-page-lede" data-cx-fade="0.3">
          Case studies go up only with results our clients have verified — nothing estimated, nothing invented. Until then, here is the studio at work.
        </p>
      </section>
      <section className="cx-wrap cx-wall" aria-label="Studio frames">
        {wall.map((m, i) => (
          <figure key={m.src} className={`cx-wall-item cx-wall-${i}`} data-cx-clip>
            <Image src={m.src} alt={m.alt} width={m.w} height={m.h} sizes="(max-width: 760px) 92vw, 46vw" unoptimized data-cx-parallax="0.08" />
            <figcaption>{m.alt}</figcaption>
          </figure>
        ))}
      </section>
      <section className="cx-wrap cx-sv-block">
        <WorkBrowser exp="creative" />
      </section>
    </>
  );
}
