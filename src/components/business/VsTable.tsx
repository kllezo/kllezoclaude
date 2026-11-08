import { IconCheck, IconX } from "./icons";
import s from "./VsTable.module.css";

/* Why Kllezo, scannable: the usual setup against ours, row by row. */
const ROWS = [
  { k: "Who you work with", them: "3+ separate vendors", us: "One team, one plan" },
  { k: "Content", them: "Posts with no plan", us: "A monthly content system" },
  { k: "Website", them: "A digital brochure", us: "Built to convert" },
  { k: "Replying to enquiries", them: "When someone's free", us: "In seconds, 24/7" },
  { k: "After-hours calls", them: "Voicemail", us: "Answered and booked" },
  { k: "Reporting", them: "Likes and impressions", us: "Numbers agreed up front" },
];

export default function VsTable() {
  return (
    <div className={s.table} role="table" aria-label="The usual setup compared with Kllezo">
      <div className={s.head} role="row">
        <span role="columnheader" />
        <span role="columnheader" className={s.them}>
          The usual setup
        </span>
        <span role="columnheader" className={s.us}>
          With Kllezo
        </span>
      </div>
      {ROWS.map((r, i) => (
        <div key={r.k} className={s.row} role="row" data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
          <span role="rowheader" className={s.k}>
            {r.k}
          </span>
          <span role="cell" className={s.them}>
            <i className={s.x}>
              <IconX size={14} />
            </i>
            {r.them}
          </span>
          <span role="cell" className={s.us}>
            <i className={s.ok}>
              <IconCheck size={14} />
            </i>
            <b>{r.us}</b>
          </span>
        </div>
      ))}
    </div>
  );
}
