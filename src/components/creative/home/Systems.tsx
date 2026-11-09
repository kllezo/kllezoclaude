import Link from "next/link";
import Image from "next/image";
import { orbs } from "@/content/creativeMedia";

/* What fixed each moment: the problem, struck through, and the system behind it. */
const ROWS = [
  { problem: "Posts nobody stops for", name: "Content Engine", line: "Stories people stop for.", orb: orbs.content, href: "/creative/services/content-growth" },
  { problem: "Visitors who leave in seconds", name: "Website Experiences", line: "Rooms people want to stay in.", orb: orbs.websites, href: "/creative/services/business-website" },
  { problem: "Messages nobody answers", name: "AI Texting Agents", line: "Every message, answered.", orb: orbs.texting, href: "/creative/services/ai-texting" },
  { problem: "Calls that go to voicemail", name: "AI Calling Agents", line: "A voice that never sleeps.", orb: orbs.calling, href: "/creative/services/ai-calling" },
];

export default function Systems() {
  return (
    <section className="cx-systems cx-wrap" aria-labelledby="sys-h">
      <p className="cx-kicker">Start with one</p>
      <h2 id="sys-h" className="cx-display-md" data-cx-fade>
        Fix one leak.
        <br />
        <em>Add the rest when you&apos;re ready.</em>
      </h2>
      <p className="cx-sys-note" data-cx-fade="0.1">
        Most clients start with a single service. Each one is built to connect to the next — so whenever you add another, the whole day gets better.
      </p>
      <ol className="cx-sys">
        {ROWS.map((r, i) => (
          <li key={r.name} data-cx-fade={i * 0.06}>
            <Link href={r.href} className="cx-sys-row" data-cursor="Open">
              <span className="cx-sys-n">0{i + 1}</span>
              <Image className="cx-sys-orb" src={r.orb.src} alt="" width={1024} height={1024} sizes="90px" unoptimized />
              <span className="cx-sys-problem">{r.problem}</span>
              <span className="cx-sys-name">{r.name}</span>
              <span className="cx-sys-line">{r.line}</span>
              <span className="cx-sys-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
