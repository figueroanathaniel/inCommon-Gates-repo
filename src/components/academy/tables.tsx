import { BRANCHES, PHASES, STEMS, TEN_GODS, type Phase } from "@contracts/bazi";
import { numZh, useZh } from "@/lib/lang";

const PHASE_ORDER: Phase[] = ["wood", "fire", "earth", "metal", "water"];

/** The table of the ten stems, set like a page from a thread-bound book. */
export function StemsTable({ dark = true }: { dark?: boolean }) {
  const zh = useZh();
  const line = dark ? "rgba(var(--txr),.16)" : "rgba(var(--txr),.18)";
  const ink = "var(--tx)";
  const sub = dark ? "rgba(var(--txr),.6)" : "rgba(var(--txr),.62)";
  const th = (zh ? "font-han text-[14px] tracking-[0.2em]" : "font-gloss text-[12px] uppercase tracking-[0.18em]");
  const td = zh ? "font-han" : "font-gloss";
  const heads = zh ? ["干", "五行", "陰陽", "其象"] : ["Name", "Phase", "Breath", "Quality"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className={th} style={{ color: "var(--gilt)" }}>
            {heads.map((h, i) => (
              <th key={h} className={"border-b py-3 font-medium" + (i < heads.length - 1 ? " pr-4" : "")} style={{ borderColor: line }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STEMS.map((s) => (
            <tr key={s.index}>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className={zh ? "font-han text-[26px] font-semibold" : "font-gloss text-[18px] font-semibold"} style={{ color: ink }}>{zh ? s.hanzi : s.english}</span>
              </td>
              <td className={td + " border-b py-3 pr-4 text-[15px]"} style={{ borderColor: line, color: ink }}>
                {zh ? PHASES[s.phase].hanzi : PHASES[s.phase].english}
              </td>
              <td className={td + " border-b py-3 pr-4 text-[15px]"} style={{ borderColor: line, color: ink }}>
                {zh ? (s.yinyang === "yang" ? "陽" : "陰") : s.yinyang === "yang" ? "Yang" : "Yin"}
              </td>
              <td className={td + " border-b py-3 text-[14px] leading-snug"} style={{ borderColor: line, color: sub }}>
                {zh ? s.qualityZh : s.quality}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The table of the twelve branches. */
export function BranchesTable({ dark = true }: { dark?: boolean }) {
  const zh = useZh();
  const line = dark ? "rgba(var(--txr),.16)" : "rgba(var(--txr),.18)";
  const ink = "var(--tx)";
  const sub = dark ? "rgba(var(--txr),.6)" : "rgba(var(--txr),.62)";
  const th = (zh ? "font-han text-[14px] tracking-[0.2em]" : "font-gloss text-[12px] uppercase tracking-[0.18em]");
  const td = zh ? "font-han" : "font-gloss";
  const heads = zh ? ["支", "生肖", "五行", "時辰", "藏干"] : ["Name", "Creature", "Phase", "Hours", "Hidden stems"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr className={th} style={{ color: "var(--gilt)" }}>
            {heads.map((h, i) => (
              <th key={h} className={"border-b py-3 font-medium" + (i < heads.length - 1 ? " pr-4" : "")} style={{ borderColor: line }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BRANCHES.map((b) => (
            <tr key={b.index}>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className={zh ? "font-han text-[26px] font-semibold" : "font-gloss text-[18px] font-semibold"} style={{ color: ink }}>{zh ? b.hanzi : b.english}</span>
              </td>
              <td className={td + " border-b py-3 pr-4 text-[15px]"} style={{ borderColor: line, color: ink }}>
                {zh ? b.animalHanzi : b.animal}
              </td>
              <td className={td + " border-b py-3 pr-4 text-[15px]"} style={{ borderColor: line, color: ink }}>
                {zh ? PHASES[b.phase].hanzi : PHASES[b.phase].english}
              </td>
              <td className={td + " border-b py-3 pr-4 text-[13px]"} style={{ borderColor: line, color: sub }}>
                {zh ? b.hoursZh : b.hours}
              </td>
              <td className={td + " border-b py-3 text-[14px]"} style={{ borderColor: line, color: "var(--gilt)" }}>
                {b.hiddenStems.map((i) => (zh ? STEMS[i].hanzi : STEMS[i].english)).join(zh ? " " : ", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The two rounds drawn as one figure: the generating ring around the outside,
 * the overcoming star within. Drawn in ink; no picture could say it better.
 */
export function PhasesDiagram({ dark = true }: { dark?: boolean }) {
  const zh = useZh();
  const ink = dark ? "var(--tx)" : "var(--tx)";
  const gilt = "var(--gilt)";
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = 118;
  const pts = PHASE_ORDER.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  // generating: wood -> fire -> earth -> metal -> water -> wood (pentagon edge order)
  const genPairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
  // overcoming star: wood -> earth -> water -> fire -> metal -> wood
  const starOrder = [0, 2, 4, 1, 3, 0];
  const starPts = starOrder.map((i) => pts[i]);

  return (
    <figure data-chart="phases" className="mx-auto w-full max-w-[360px]" aria-label={zh ? "五行相生之環與相剋之星" : "The generating ring and the overcoming star of the five phases"}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" role="img">
        {genPairs.map(([a, b], i) => (
          <line
            key={`g${i}`}
            x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y}
            stroke={gilt} strokeWidth={1.2} opacity={0.9}
            markerEnd="url(#arrowGen)"
          />
        ))}
        {starPts.slice(0, -1).map((p, i) => (
          <line
            key={`s${i}`}
            x1={p.x} y1={p.y} x2={starPts[i + 1].x} y2={starPts[i + 1].y}
            stroke={ink} strokeWidth={0.7} opacity={0.4} strokeDasharray="3 4"
          />
        ))}
        <defs>
          <marker id="arrowGen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1.5 L9 5 L0 8.5" fill="none" stroke={gilt} strokeWidth="1.4" />
          </marker>
        </defs>
        {PHASE_ORDER.map((ph, i) => (
          <g key={ph}>
            <circle cx={pts[i].x} cy={pts[i].y} r={34} fill="var(--bg)" stroke={gilt} strokeWidth={1} />
            {zh ? (
              <text x={pts[i].x} y={pts[i].y} textAnchor="middle" dominantBaseline="central" fill={ink} fontSize={28} className="font-han" fontWeight={700}>
                {PHASES[ph].hanzi}
              </text>
            ) : (
              <text x={pts[i].x} y={pts[i].y} textAnchor="middle" dominantBaseline="central" fill={ink} fontSize={13} fontWeight={700} letterSpacing={1.2}>
                {PHASES[ph].english.toUpperCase()}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className={(zh ? "font-han" : "font-gloss italic") + " mt-4 text-center text-[13px]"} style={{ color: "rgba(var(--txr),.66)" }}>
        {zh ? "金色之環為相生，內中淡星為相剋。" : "The gilt ring is the generating round; the pale star within is the overcoming round."}
      </figcaption>
    </figure>
  );
}

/** The court of the ten gods, set out for study. */
export function GodsTable({ dark = true }: { dark?: boolean }) {
  const zh = useZh();
  const line = dark ? "rgba(var(--txr),.16)" : "rgba(var(--txr),.18)";
  const ink = dark ? "var(--tx)" : "var(--tx)";
  const sub = dark ? "rgba(var(--txr),.6)" : "rgba(var(--txr),.62)";
  const rows = [
    ["same phase, same breath", "同我，同性", TEN_GODS.companion],
    ["same phase, opposite breath", "同我，異性", TEN_GODS.robwealth],
    ["the self generates, same breath", "我生，同性", TEN_GODS.eatinggod],
    ["the self generates, opposite breath", "我生，異性", TEN_GODS.hurtingofficer],
    ["the self overcomes, same breath", "我剋，同性", TEN_GODS.indirectwealth],
    ["the self overcomes, opposite breath", "我剋，異性", TEN_GODS.directwealth],
    ["overcomes the self, same breath", "剋我，同性", TEN_GODS.sevenkillings],
    ["overcomes the self, opposite breath", "剋我，異性", TEN_GODS.directofficer],
    ["generates the self, same breath", "生我，同性", TEN_GODS.indirectresource],
    ["generates the self, opposite breath", "生我，異性", TEN_GODS.directresource],
  ] as const;
  const td = zh ? "font-han" : "font-gloss";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className={zh ? "font-han text-[14px] tracking-[0.2em]" : "font-gloss text-[12px] uppercase tracking-[0.18em]"} style={{ color: "var(--gilt)" }}>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>{zh ? "與日主之關係" : "Relation to the Day Master"}</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>{zh ? "十神" : "God"}</th>
            <th className="border-b py-3 font-medium" style={{ borderColor: line }}>{zh ? "其義" : "Reading"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([rel, relZh, g]) => (
            <tr key={g.hanzi}>
              <td className={td + " border-b py-3 pr-4 text-[14px]"} style={{ borderColor: line, color: sub }}>{zh ? relZh : rel}</td>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                {zh ? (
                  <span className="font-han text-[20px] font-semibold" style={{ color: ink }}>{g.hanzi}</span>
                ) : (
                  <span className="font-gloss text-[15px] font-semibold" style={{ color: "var(--gilt)" }}>{g.english}</span>
                )}
              </td>
              <td className={td + " border-b py-3 text-[14px] leading-snug"} style={{ borderColor: line, color: sub }}>{zh ? g.readingZh : g.reading}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The sixty pairs of the sexagenary round, written in their order. */
export function JiaziCycle({ dark = true }: { dark?: boolean }) {
  const zh = useZh();
  const line = dark ? "rgba(var(--txr),.14)" : "rgba(var(--txr),.16)";
  const ink = dark ? "rgba(var(--txr),.85)" : "rgba(var(--txr),.85)";
  const cells = Array.from({ length: 60 }, (_, i) => ({
    n: i + 1,
    stem: zh ? STEMS[i % 10].hanzi : STEMS[i % 10].english,
    branch: zh ? BRANCHES[i % 12].hanzi : BRANCHES[i % 12].english,
  }));
  return (
    <div className="grid grid-cols-5 gap-px min-[820px]:grid-cols-10" data-chart="jiazi" role="list" aria-label={zh ? "六十甲子，依序" : "The sixty Jiazi pairs in their order"}>
      {cells.map((c) => (
        <div key={c.n} role="listitem" className="flex flex-col items-center border px-1 py-2" style={{ borderColor: line }}>
          {zh ? (
            <span className="font-han text-[18px] font-semibold leading-snug" style={{ color: ink }}>
              {c.stem}{c.branch}
            </span>
          ) : (
            <span className="font-gloss text-center text-[12.5px] font-semibold leading-snug" style={{ color: ink }}>
              {c.stem} {c.branch}
            </span>
          )}
          <span className={(zh ? "font-han" : "font-gloss") + " text-[10px]"} style={{ color: "var(--gilt)" }}>{zh ? numZh(c.n) : c.n}</span>
        </div>
      ))}
    </div>
  );
}
