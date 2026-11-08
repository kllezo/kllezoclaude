import Link from "next/link";
import { serviceBySlug } from "@/content/services";
import s from "./ProblemFiles.module.css";

/* From problem to solved — four case files. Each opens with the problem in the
   customer's own words, explains why it keeps happening, then shows the system we
   build, how it runs and what changes. All copy comes from the service catalogue. */

const FILES = ["content-growth", "business-website", "ai-texting", "ai-calling"];

export default function ProblemFiles() {
  return (
    <div className={s.files}>
      {FILES.map((slug, i) => {
        const sv = serviceBySlug(slug)!;
        return (
          <article key={slug} className={s.file} aria-labelledby={`pf-${slug}`}>
            <div className={s.problem}>
              <div className={s.problemInner}>
                <span className={s.num}>
                  Problem {String(i + 1).padStart(2, "0")} <i>/ {String(FILES.length).padStart(2, "0")}</i>
                </span>
                <h3 id={`pf-${slug}`} className={s.quote}>
                  &ldquo;{sv.problems[0]}.&rdquo;
                </h3>
                <ul className={s.also}>
                  {sv.problems.slice(1, 4).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={s.body}>
              <section className={s.block} data-reveal>
                <span className={s.k}>Why it keeps happening</span>
                <p className={s.why}>{sv.whyItFails}</p>
              </section>

              <section className={`${s.block} ${s.solution}`} data-reveal>
                <span className={s.k}>How we solve it</span>
                <p className={s.solName}>{sv.name}</p>
                <p className={s.solText}>{sv.summary}</p>
              </section>

              <section className={s.block} data-reveal>
                <span className={s.k}>How it works</span>
                <ol className={s.flow}>
                  {sv.workflow.slice(0, 4).map((w, k) => (
                    <li key={w.title}>
                      <span>{k + 1}</span>
                      <b>{w.title}</b>
                      <p>{w.detail}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className={`${s.block} ${s.outcome}`} data-reveal>
                <span className={s.k}>What changes</span>
                <ul className={s.outcomes}>
                  {sv.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <Link href={`/business/services/${sv.slug}`} className={s.more}>
                  See the {sv.name} →
                </Link>
              </section>
            </div>
          </article>
        );
      })}
    </div>
  );
}
