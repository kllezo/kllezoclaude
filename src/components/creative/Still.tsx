import Timecode from "@/components/entry/Timecode";
import s from "./Still.module.css";

/* A cinematic frame plate. Until real footage is supplied it renders
   an art-directed colour study (layered light, horizon, grain).
   Pass `video` (a /public path) to play muted looping footage instead —
   drop files in /public/media and reference them from the page. */

export type Mood = "dusk" | "noir" | "ember" | "tide" | "velvet" | "gold";

export default function Still({
  mood,
  caption,
  video,
  poster,
  ratio = "2.39 / 1",
  live = false,
  className,
}: {
  mood: Mood;
  caption?: string;
  video?: string;
  poster?: string;
  ratio?: string;
  live?: boolean;
  className?: string;
}) {
  return (
    <figure className={`${s.still} ${s[mood]} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      {video ? (
        <video className={s.video} src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      ) : (
        <div className={s.plate} aria-hidden="true">
          <span className={s.sky} />
          <span className={s.sun} />
          <span className={s.horizon} />
          <span className={s.subject} />
          <span className={s.flare} />
        </div>
      )}
      <span className={s.vignette} aria-hidden="true" />
      {(caption || live) && (
        <figcaption className={s.meta}>
          {caption && <span>{caption}</span>}
          {live && <Timecode className={s.tc} />}
        </figcaption>
      )}
    </figure>
  );
}
