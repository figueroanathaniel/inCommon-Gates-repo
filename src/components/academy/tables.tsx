import { BRANCHES, PHASES, STEMS, TEN_GODS, type Phase } from "@contracts/bazi";

const PHASE_ORDER: Phase[] = ["wood", "fire", "earth", "metal", "water"];

/** The table of the ten stems, set like a page from a thread-bound book. */
export function StemsTable({ dark = true }: { dark?: boolean }) {
  const line = dark ? "rgba(250,248,245,.16)" : "rgba(34,31,26,.18)";
  const ink = dark ? "#faf8f5" : "#221f1a";
  const sub = dark ? "rgba(250,248,245,.6)" : "rgba(34,31,26,.62)";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="font-gloss text-[12px] uppercase tracking-[0.18em]" style={{ color: "#968155" }}>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Sign</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Name</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Phase</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Breath</th>
            <th className="border-b py-3 font-medium" style={{ borderColor: line }}>Quality</th>
          </tr>
        </thead>
        <tbody>
          {STEMS.map((s) => (
            <tr key={s.index}>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[26px] font-semibold" style={{ color: ink }}>{s.hanzi}</span>
              </td>
              <td className="font-gloss border-b py-3 pr-4 text-[15px]" style={{ borderColor: line, color: ink }}>
                {s.english} <span style={{ color: sub }}>{s.pinyin}</span>
              </td>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[15px]" style={{ color: ink }}>{PHASES[s.phase].hanzi}</span>{" "}
                <span className="font-gloss text-[14px]" style={{ color: sub }}>{PHASES[s.phase].english}</span>
              </td>
              <td className="font-han border-b py-3 pr-4 text-[15px]" style={{ borderColor: line, color: ink }}>
                {s.yinyang === "yang" ? "陽" : "陰"}
              </td>
              <td className="font-gloss border-b py-3 text-[14px] leading-snug" style={{ borderColor: line, color: sub }}>
                {s.quality}
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
  const line = dark ? "rgba(250,248,245,.16)" : "rgba(34,31,26,.18)";
  const ink = dark ? "#faf8f5" : "#221f1a";
  const sub = dark ? "rgba(250,248,245,.6)" : "rgba(34,31,26,.62)";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="font-gloss text-[12px] uppercase tracking-[0.18em]" style={{ color: "#968155" }}>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Sign</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Name</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Creature</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Phase</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Hours</th>
            <th className="border-b py-3 font-medium" style={{ borderColor: line }}>Hidden stems</th>
          </tr>
        </thead>
        <tbody>
          {BRANCHES.map((b) => (
            <tr key={b.index}>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[26px] font-semibold" style={{ color: ink }}>{b.hanzi}</span>
              </td>
              <td className="font-gloss border-b py-3 pr-4 text-[15px]" style={{ borderColor: line, color: ink }}>
                {b.english} <span style={{ color: sub }}>{b.pinyin}</span>
              </td>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[15px]" style={{ color: ink }}>{b.animalHanzi}</span>{" "}
                <span className="font-gloss text-[14px]" style={{ color: sub }}>{b.animal}</span>
              </td>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[15px]" style={{ color: ink }}>{PHASES[b.phase].hanzi}</span>
              </td>
              <td className="font-gloss border-b py-3 pr-4 text-[13px]" style={{ borderColor: line, color: sub }}>
                {b.hours}
              </td>
              <td className="border-b py-3" style={{ borderColor: line }}>
                <span className="font-han text-[16px] tracking-[0.2em]" style={{ color: "#968155" }}>
                  {b.hiddenStems.map((i) => STEMS[i].hanzi).join(" ")}
                </span>
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
  const ink = dark ? "#faf8f5" : "#221f1a";
  const gilt = "#968155";
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
    <figure data-chart="phases" className="mx-auto w-full max-w-[360px]" aria-label="The generating ring and the overcoming star of the five phases">
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
            <circle cx={pts[i].x} cy={pts[i].y} r={34} fill={dark ? "#1d1d24" : "#f2ecdc"} stroke={gilt} strokeWidth={1} />
            <text x={pts[i].x} y={pts[i].y - 2} textAnchor="middle" dominantBaseline="central" fill={ink} fontSize={26} className="font-han" fontWeight={700}>
              {PHASES[ph].hanzi}
            </text>
            <text x={pts[i].x} y={pts[i].y + 18} textAnchor="middle" dominantBaseline="central" fill={gilt} fontSize={9.5} letterSpacing={1.5} style={{ textTransform: "uppercase" }}>
              {PHASES[ph].english.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="font-gloss mt-4 text-center text-[13px] italic" style={{ color: dark ? "rgba(250,248,245,.6)" : "rgba(34,31,26,.6)" }}>
        The gilt ring is 相生, the generating round; the pale star within is 相剋, the overcoming round.
      </figcaption>
    </figure>
  );
}

/** The court of the ten gods, set out for study. */
export function GodsTable({ dark = true }: { dark?: boolean }) {
  const line = dark ? "rgba(250,248,245,.16)" : "rgba(34,31,26,.18)";
  const ink = dark ? "#faf8f5" : "#221f1a";
  const sub = dark ? "rgba(250,248,245,.6)" : "rgba(34,31,26,.62)";
  const rows = [
    ["same phase, same breath", TEN_GODS.companion],
    ["same phase, opposite breath", TEN_GODS.robwealth],
    ["the self generates, same breath", TEN_GODS.eatinggod],
    ["the self generates, opposite breath", TEN_GODS.hurtingofficer],
    ["the self overcomes, same breath", TEN_GODS.indirectwealth],
    ["the self overcomes, opposite breath", TEN_GODS.directwealth],
    ["overcomes the self, same breath", TEN_GODS.sevenkillings],
    ["overcomes the self, opposite breath", TEN_GODS.directofficer],
    ["generates the self, same breath", TEN_GODS.indirectresource],
    ["generates the self, opposite breath", TEN_GODS.directresource],
  ] as const;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="font-gloss text-[12px] uppercase tracking-[0.18em]" style={{ color: "#968155" }}>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>Relation to the Day Master</th>
            <th className="border-b py-3 pr-4 font-medium" style={{ borderColor: line }}>God</th>
            <th className="border-b py-3 font-medium" style={{ borderColor: line }}>Reading</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([rel, g]) => (
            <tr key={g.hanzi}>
              <td className="font-gloss border-b py-3 pr-4 text-[14px]" style={{ borderColor: line, color: sub }}>{rel}</td>
              <td className="border-b py-3 pr-4" style={{ borderColor: line }}>
                <span className="font-han text-[20px] font-semibold" style={{ color: ink }}>{g.hanzi}</span>{" "}
                <span className="font-gloss text-[14px]" style={{ color: "#968155" }}>{g.english}</span>
              </td>
              <td className="font-gloss border-b py-3 text-[14px] leading-snug" style={{ borderColor: line, color: sub }}>{g.reading}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The sixty pairs of the sexagenary round, written in their order. */
export function JiaziCycle({ dark = true }: { dark?: boolean }) {
  const line = dark ? "rgba(250,248,245,.14)" : "rgba(34,31,26,.16)";
  const ink = dark ? "rgba(250,248,245,.85)" : "rgba(34,31,26,.85)";
  const cells = Array.from({ length: 60 }, (_, i) => ({
    n: i + 1,
    stem: STEMS[i % 10].hanzi,
    branch: BRANCHES[i % 12].hanzi,
  }));
  return (
    <div className="grid grid-cols-5 gap-px min-[820px]:grid-cols-10" data-chart="jiazi" role="list" aria-label="The sixty Jiazi pairs in their order">
      {cells.map((c) => (
        <div key={c.n} role="listitem" className="flex flex-col items-center border px-1 py-2" style={{ borderColor: line }}>
          <span className="font-han text-[18px] font-semibold leading-snug" style={{ color: ink }}>
            {c.stem}{c.branch}
          </span>
          <span className="font-gloss text-[10px]" style={{ color: "#968155" }}>{c.n}</span>
        </div>
      ))}
    </div>
  );
}
