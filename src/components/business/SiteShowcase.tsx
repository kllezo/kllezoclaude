import Image from "next/image";
import { websites } from "@/content/creativeMedia";
import s from "./SiteShowcase.module.css";

/* Real Kllezo website builds in browser frames. Hover (or focus) a frame and the
   page scrolls inside it, top to bottom — the whole site, not a cropped hero. */
const SITES = [
  { m: websites[0], label: "Hospitality", url: "stays.example" },
  { m: websites[1], label: "Restaurant", url: "dining.example" },
  { m: websites[3], label: "Automotive", url: "motors.example" },
];

export default function SiteShowcase() {
  return (
    <ul className={s.grid}>
      {SITES.map((x, i) => (
        <li key={x.label} className={s.item} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
          <div className={s.frame} tabIndex={0} aria-label={`${x.label} website — hover to scroll the full page`}>
            <div className={s.bar}>
              <i />
              <i />
              <i />
              <span>{x.url}</span>
            </div>
            <div className={s.view}>
              <Image src={x.m.src} alt={x.m.alt} width={x.m.w} height={x.m.h} sizes="(max-width: 900px) 90vw, 30vw" unoptimized />
            </div>
          </div>
          <p className={s.cap}>
            <b>{x.label}</b> <span>Hover to scroll the full page</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
