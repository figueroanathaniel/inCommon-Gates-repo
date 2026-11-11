import { useState } from "react";
import type { FourPillars, Phase } from "@contracts/bazi";
import { BRANCHES, PHASES, STEMS, tenGodOf } from "@contracts/bazi";
import { ReadingGloss, pillarViews } from "@/lib/reading";
import { SEASON_STATES, natalSigns, seasonState, type Sign } from "@/lib/meet";
import { setChartPrefs, useChartPrefs } from "@/lib/prefs";
import { GhostButton, Rule } from "./chrome";
import { Meetings } from "./meetings";
import { litKey } from "@/lib/meet";

const PHASE_ORDER: Phase[] = ["wood", "fire", "earth", "metal", "water"];

/**
 * The chart, set in the old manner: four pillars in vertical writing,
 * the year at the right hand and the hour at the left, stem above branch.
 * The 44px floor does not bind inside [data-chart], but these columns
 * stand well above it regardless.
 *
 * A decade and a year may be laid beside the four (`incoming`), at the left
 * hand past the hour. Under the chart the reader may call up the hidden
 * stems, the Ten Gods and the season, all off until chosen, and pick one of
 * the five phases to see where it stands.
 */
export function PillarChart({
  pillars,
  dark = false,
  interactive = true,
  caption,
  incoming = [],
  meetings = false,
}: {
  pillars: FourPillars;
  dark?: boolean;
  interactive?: boolean;
  caption?: string;
  incoming?: Sign[];
  meetings?: boolean;
}) {
  const views = pillarViews(pillars);
  const prefs = useChartPrefs();
  const [open, setOpen] = useState<string | null>(null);
  const [plain, setPlain] = useState(false);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [lit, setLit] = useState<string[]>([]);
  const gloss = new ReadingGloss(plain);
  const inkColor = "var(--tx)";
  const subColor = "rgba(var(--txr),.7)";
  const line = dark ? "rgba(var(--txr),.22)" : "rgba(var(--txr),.18)";
  const day = STEMS[pillars.dayStem];
  const wide = incoming.length > 0;
  const signs = [...natalSigns(pillars), ...incoming];

  const selected = views.find((v) => v.key === open) ?? null;

  /* One character of a pillar: dimmed when another phase is picked, ringed when a meeting points at it. */
  const charStyle = (key: string, layer: "stem" | "branch", p: Phase) => ({
    opacity: phase && phase !== p ? 0.28 : 1,
    color: lit.includes(litKey(key, layer)) ? "var(--gilt)" : inkColor,
    transition: "opacity .2s, color .2s",
  });

  const column = (key: string, english: string, hanzi: string, stemIx: number, branchIx: number, isDay: boolean) => {
    const stem = STEMS[stemIx];
    const branch = BRANCHES[branchIx];
    const stemState = SEASON_STATES[seasonState(pillars.monthBranch, stem.phase)];
    const branchState = SEASON_STATES[seasonState(pillars.monthBranch, branch.phase)];
    const god = isDay ? null : tenGodOf(day, stem);
    return (
      <>
        <span className="font-gloss text-[11px] uppercase tracking-[0.12em] min-[820px]:tracking-[0.2em]" style={{ color: subColor }}>
          {english}
        </span>
        <span
          className="font-han mt-3 font-bold"
          style={{ writingMode: "vertical-rl", textOrientation: "upright", fontSize: wide ? "clamp(26px, 7vw, 56px)" : "clamp(32px, 9vw, 64px)", letterSpacing: "0.14em", lineHeight: 1 }}
        >
          <span style={charStyle(key, "stem", stem.phase)}>{stem.hanzi}</span>
          <span style={charStyle(key, "branch", branch.phase)}>{branch.hanzi}</span>
        </span>
        <span className="font-han mt-3 text-[13px] tracking-[0.25em]" style={{ color: "var(--gilt)" }}>
          {hanzi}
        </span>
        <span className="font-gloss mt-1 text-center text-[11px]" style={{ color: subColor }}>
          {branch.animal} · {PHASES[branch.phase].english}
        </span>
        {prefs.gods ? (
          <span data-row="gods" className="mt-3 flex flex-col items-center">
            <span className="font-han text-[13px]" style={{ color: "var(--gilt)" }}>{god ? god.hanzi : "日主"}</span>
            <span className="font-gloss text-center text-[10.5px] leading-snug" style={{ color: subColor }}>{god ? god.english : "Day Master"}</span>
          </span>
        ) : null}
        {prefs.season ? (
          <span
            data-row="season"
            className="font-han mt-3 text-center text-[13px] leading-relaxed"
            style={{ color: inkColor }}
            aria-label={`${PHASES[stem.phase].english} ${stemState.english}, ${PHASES[branch.phase].english} ${branchState.english}`}
          >
            <span className="block">{PHASES[stem.phase].hanzi}{stemState.hanzi}</span>
            <span className="block">{PHASES[branch.phase].hanzi}{branchState.hanzi}</span>
          </span>
        ) : null}
        {prefs.hidden ? (
          <span data-row="hidden" className="mt-3 flex flex-col items-center gap-[2px]" aria-label={`Hidden stems: ${branch.hiddenStems.map((h) => STEMS[h].english).join(", ")}`}>
            {branch.hiddenStems.map((h) => {
              const hs = STEMS[h];
              return (
                <span key={h} className="whitespace-nowrap" style={{ opacity: phase && phase !== hs.phase ? 0.28 : 1 }}>
                  <span className="font-han text-[15px] font-bold" style={{ color: inkColor }}>{hs.hanzi}</span>
                  {prefs.gods ? <span className="font-han ml-1 text-[11px]" style={{ color: "var(--gilt)" }}>{tenGodOf(day, hs).hanzi}</span> : null}
                </span>
              );
            })}
          </span>
        ) : null}
      </>
    );
  };

  const switches: { key: "hidden" | "gods" | "season"; hanzi: string; english: string }[] = [
    { key: "hidden", hanzi: "藏干", english: "Hidden Stems" },
    { key: "gods", hanzi: "十神", english: "Ten Gods" },
    { key: "season", hanzi: "旺相休囚死", english: "Season" },
  ];
  const baseCls =
    "flex min-w-0 flex-1 flex-col items-center border-y px-1 py-5 transition-colors duration-200 " + (wide ? "min-[820px]:min-w-[92px]" : "min-[820px]:min-w-[110px]");

  return (
    <div data-chart="pillars" className="w-full">
      <div
        dir="rtl"
        className={"mx-auto flex w-full items-stretch justify-center " + (wide ? "max-w-3xl gap-1 min-[820px]:gap-3" : "max-w-2xl gap-2 min-[820px]:gap-4")}
        role="group"
        aria-label={wide ? "The four pillars, year at the right, hour at the left, with what is laid beside them past the hour" : "The four pillars, year at the right, hour at the left"}
      >
        {views.map((v) => {
          const active = open === v.key;
          const body = column(v.key, v.english.replace(" Pillar", ""), v.hanzi, v.stem.index, v.branch.index, v.key === "day");
          const style = {
            borderColor: active ? "var(--gilt)" : line,
            background: active ? (dark ? "rgba(var(--ac2r),.12)" : "rgba(var(--ac2r),.10)") : "transparent",
            cursor: interactive ? "pointer" : "default",
          } as const;
          return interactive ? (
            <button
              key={v.key}
              type="button"
              aria-expanded={active}
              aria-label={`${v.english}: ${v.stem.english} ${v.branch.english}, ${v.branch.animal}`}
              onClick={() => setOpen(active ? null : v.key)}
              className={baseCls}
              style={style}
            >
              {body}
            </button>
          ) : (
            <div key={v.key} className={baseCls} style={style}>
              {body}
            </div>
          );
        })}
        {incoming.map((s, i) => (
          <div
            key={s.key}
            data-incoming={s.key}
            className={baseCls + (i === 0 ? " ms-2 min-[820px]:ms-4" : "")}
            style={{ borderColor: "var(--gilt)", borderStyle: "dashed", background: "rgba(var(--ac2r),.06)" }}
            aria-label={`${s.english}: ${STEMS[s.stem].english} ${BRANCHES[s.branch].english}, ${BRANCHES[s.branch].animal}`}
          >
            {column(s.key, s.english, s.hanzi, s.stem, s.branch, false)}
          </div>
        ))}
      </div>
      {caption ? (
        <p className="font-gloss mt-4 text-center text-[13px] italic" style={{ color: subColor }}>
          {caption}
        </p>
      ) : null}

      {interactive ? (
        <div data-chart-tools className="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {switches.map((w) => {
              const on = prefs[w.key];
              return (
                <button
                  key={w.key}
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => setChartPrefs({ [w.key]: !on })}
                  className="font-gloss min-h-[44px] border px-3 text-[13px] transition-colors duration-200"
                  style={{ borderColor: on ? "var(--gilt)" : line, color: inkColor, background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
                >
                  <span className="font-han mr-2">{w.hanzi}</span>{w.english}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Show where one phase stands">
            {PHASE_ORDER.map((p) => {
              const on = phase === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPhase(on ? null : p)}
                  className="font-gloss min-h-[44px] min-w-[44px] border px-3 text-[13px] transition-colors duration-200"
                  style={{ borderColor: on ? "var(--gilt)" : line, color: inkColor, background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
                >
                  <span className="font-han mr-2 font-bold">{PHASES[p].hanzi}</span>{PHASES[p].english}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {meetings ? <Meetings signs={signs} onLit={setLit} /> : null}

      {interactive && selected ? (
        <div
          className="mx-auto mt-8 max-w-2xl border px-6 py-6"
          style={{ borderColor: dark ? "rgba(var(--txr),.25)" : "rgba(var(--ac2r),.35)", background: "rgba(var(--sfr),.84)" }}
          role="region"
          aria-label={`Reading of the ${selected.english}`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-gloss text-[12px] uppercase tracking-[0.22em] text-[var(--gilt)]">Its ground</p>
            <GhostButton dark={dark} onClick={() => setPlain(!plain)} aria-pressed={plain}>
              {plain ? "With characters 顯字" : "English only 隱字"}
            </GhostButton>
          </div>
          <p className="font-gloss mt-4 text-[15px] leading-relaxed" style={{ color: inkColor }}>
            <span className="font-han font-semibold">
              {plain ? selected.stem.english : `${selected.stem.hanzi} ${selected.stem.english}`}
            </span>
            {" "}stands above: {selected.stem.quality}. Beneath it,{" "}
            <span className="font-han font-semibold">
              {plain ? selected.branch.english : `${selected.branch.hanzi} ${selected.branch.english}`}
            </span>, the{" "}
            {gloss.mark(selected.branch.animalHanzi, selected.branch.animal)}: {selected.branch.quality}.
          </p>
          <Rule dark={dark} className="my-4" />
          <p className="font-gloss text-[14px] leading-relaxed" style={{ color: subColor }}>
            This is the {selected.english.toLowerCase()}
            {plain ? "." : ` （${selected.hanzi}）.`} Its ground is {selected.domain}.
            {selected.god ? (
              <>
                {" "}Against the Day Master it sits as{" "}
                {plain ? selected.god.english : `${selected.god.english} （${selected.god.hanzi}）`}: {selected.god.reading}.
              </>
            ) : (
              <>
                {" "}Its stem is the Day Master
                {plain ? "." : " （日主）, the self from which every other sign in the chart takes its relation."}
              </>
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
}
