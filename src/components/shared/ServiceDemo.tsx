import type { DemoKind } from "@/content/services";
import s from "./ServiceDemo.module.css";

/* Illustrative interface demonstrations for each service.
   Themed by the parent experience via `tone`. They show how a
   system works, never performance figures. */

type Tone = "light" | "dark";

export default function ServiceDemo({ kind, tone = "light", className }: { kind: DemoKind; tone?: Tone; className?: string }) {
  const Demo = demos[kind];
  return (
    <figure className={`${s.demo} ${s[tone]} ${className ?? ""}`} aria-label={`Illustrative ${labels[kind]} interface`}>
      <Demo />
      <figcaption className={s.cap}>Illustrative interface · {labels[kind]}</figcaption>
    </figure>
  );
}

const labels: Record<DemoKind, string> = {
  calendar: "content calendar",
  brand: "personal brand profile",
  film: "edit timeline",
  ads: "creative testing board",
  browser: "website build",
  store: "storefront & checkout",
  funnel: "lead journey",
  chat: "AI texting agent",
  call: "AI voice agent",
};

const v = (i: number) => ({ ["--i" as string]: i });

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.window}>
      <div className={s.bar}>
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div className={s.body}>{children}</div>
    </div>
  );
}

function Calendar() {
  const posts: Record<number, [string, string]> = {
    1: ["Reel", "a"], 3: ["Carousel", "b"], 5: ["Story", "c"], 8: ["Reel", "a"], 9: ["Short", "a"], 11: ["Post", "b"],
    15: ["Reel", "a"], 17: ["Carousel", "b"], 18: ["Live", "c"], 22: ["Reel", "a"], 24: ["Short", "a"], 26: ["Story", "c"],
  };
  return (
    <Chrome title="content-calendar / this month">
      <div className={s.legend}>
        <span data-k="a">Education</span>
        <span data-k="b">Authority</span>
        <span data-k="c">Community</span>
      </div>
      <div className={s.cal}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <b key={i}>{d}</b>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} className={s.day}>
            <small>{i + 1}</small>
            {posts[i] && (
              <em data-k={posts[i][1]} style={v(i)}>
                {posts[i][0]}
              </em>
            )}
          </span>
        ))}
      </div>
    </Chrome>
  );
}

function Brand() {
  return (
    <Chrome title="personal-brand / positioning">
      <div className={s.brand}>
        <div className={s.profile}>
          <span className={s.avatar} />
          <div>
            <b>Founder name</b>
            <small>Helping [audience] achieve [outcome]</small>
          </div>
        </div>
        <div className={s.pillars}>
          {["Story", "Expertise", "Opinion", "Behind the scenes"].map((p, i) => (
            <span key={p} style={v(i)}>
              {p}
            </span>
          ))}
        </div>
        <div className={s.posts}>
          <span className={s.vid} style={v(0)}>
            <i className={s.play} />
            <small>Founder video</small>
          </span>
          <span className={s.quote} style={v(1)}>
            “The lesson nobody tells you about…”
          </span>
          <span className={s.vid} style={v(2)}>
            <i className={s.mic} />
            <small>Podcast clip</small>
          </span>
        </div>
      </div>
    </Chrome>
  );
}

function Film() {
  return (
    <Chrome title="edit / brand-film_v3">
      <div className={s.viewer}>
        <span className={s.frame} />
        <span className={s.tc}>00:00:14:08</span>
      </div>
      <div className={s.tracks}>
        {[
          ["V2", [[12, 18], [52, 14]]],
          ["V1", [[0, 30], [31, 22], [54, 26], [81, 19]]],
          ["A1", [[0, 100]]],
          ["FX", [[20, 8], [62, 10]]],
        ].map(([name, clips], r) => (
          <div key={name as string} className={s.track}>
            <b>{name as string}</b>
            <div>
              {(clips as number[][]).map(([l, w], i) => (
                <span key={i} data-r={r} style={{ left: `${l}%`, width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
        <i className={s.playhead} />
      </div>
    </Chrome>
  );
}

function Ads() {
  const items = ["Hook A · 9:16", "Hook B · 9:16", "Hook C · 1:1", "Demo · 9:16", "UGC · 4:5", "Offer · 1:1"];
  return (
    <Chrome title="creative-testing / batch">
      <div className={s.ads}>
        {items.map((it, i) => (
          <span key={it} className={s.ad} style={v(i)} data-tall={it.includes("9:16") || undefined}>
            <i />
            <small>{it}</small>
          </span>
        ))}
      </div>
    </Chrome>
  );
}

function Browser() {
  return (
    <Chrome title="yourbusiness.com">
      <div className={s.site}>
        <div className={s.siteNav}>
          <b />
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className={s.siteHero}>
          <span className={s.l1} />
          <span className={s.l2} />
          <span className={s.l3} />
          <span className={s.btn} />
        </div>
        <div className={s.siteCards}>
          <span style={v(0)} />
          <span style={v(1)} />
          <span style={v(2)} />
        </div>
      </div>
    </Chrome>
  );
}

function Store() {
  return (
    <Chrome title="store / checkout">
      <div className={s.store}>
        <div className={s.products}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={v(i)}>
              <i />
              <b />
              <small />
            </span>
          ))}
        </div>
        <div className={s.cart}>
          <b>Checkout</b>
          {["Cart", "Details", "Shipping", "Payment", "Confirmed"].map((st, i) => (
            <span key={st} style={v(i)}>
              <i />
              {st}
            </span>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function Funnel() {
  const steps = ["Ad click", "Landing page", "Qualification form", "WhatsApp", "Your CRM"];
  return (
    <Chrome title="lead-journey / live">
      <div className={s.funnel}>
        {steps.map((st, i) => (
          <div key={st} className={s.fstep} style={v(i)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <b>{st}</b>
          </div>
        ))}
        <i className={s.lead} />
      </div>
    </Chrome>
  );
}

function Chat() {
  const msgs: [string, string][] = [
    ["in", "Hi! Do you have a table for 4 this Saturday evening?"],
    ["out", "Hello! Yes — I have 7:30 pm or 8:45 pm available on Saturday. Which suits you?"],
    ["in", "7:30 please"],
    ["out", "Booked ✓ Table for 4, Sat 7:30 pm. I'll send a reminder on the day. Anything else?"],
  ];
  return (
    <div className={s.phone}>
      <div className={s.phoneTop}>
        <span className={s.agentDot} />
        <div>
          <b>Booking Agent</b>
          <small>typically replies instantly</small>
        </div>
      </div>
      <div className={s.thread}>
        {msgs.map(([dir, t], i) => (
          <p key={i} className={s[dir]} style={v(i)}>
            {t}
          </p>
        ))}
        <span className={s.typing} style={v(4)}>
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

function Call() {
  return (
    <div className={s.callWrap}>
      <div className={s.phone}>
        <div className={s.callHead}>
          <small>Inbound call</small>
          <b>AI Voice Agent</b>
          <span className={s.live}>● Live</span>
        </div>
        <div className={s.wave} aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} style={{ ["--i" as string]: i, ["--h" as string]: `${20 + ((i * 37) % 70)}%` }} />
          ))}
        </div>
        <div className={s.transcript}>
          <p style={v(0)}>
            <b>Caller</b> I&apos;d like to book a consultation.
          </p>
          <p style={v(1)}>
            <b>Agent</b> Of course. Is this for a new or existing account?
          </p>
          <p style={v(2)}>
            <b>Caller</b> New — for my clinic.
          </p>
        </div>
      </div>
      <div className={s.summary}>
        <b>Call summary</b>
        {["Intent: consultation", "Lead type: new business", "Qualified ✓", "Booked: Thu 11:00", "Routed to: sales team"].map((l, i) => (
          <span key={l} style={v(i)}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

const demos: Record<DemoKind, () => React.JSX.Element> = {
  calendar: Calendar,
  brand: Brand,
  film: Film,
  ads: Ads,
  browser: Browser,
  store: Store,
  funnel: Funnel,
  chat: Chat,
  call: Call,
};
