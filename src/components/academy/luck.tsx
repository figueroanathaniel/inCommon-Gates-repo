import { useId } from "react";
import { yearsOf, type Times } from "@/lib/times";
import { STEMS, BRANCHES, tenGodOf, type FourPillars } from "@contracts/bazi";
import { TIE_NAMES, kindsAgainst, yearPillar } from "@/lib/meet";

export type Sex = "m" | "f";

export interface LuckView {
  forward: boolean;
  start: { years: number; months: number; days: number; hours: number };
  current: number | null;
  decades: { stem: number; branch: number; ageYears: number; ageMonths: number; from?: string }[];
}

const age = (y: number, m: number) => (m ? `${y} y ${m} m` : `${y} y`);

/**
 * Sex at birth, asked only because it sets which way the luck pillars run.
 * Three answers: male, female, or left unsaid, in which case the decades
 * are not laid out. `dark` means dark ink on paper.
 */
export function SexField({ value, onChange, dark = false }: { value: Sex | null; onChange: (v: Sex | null) => void; dark?: boolean }) {
  const id = useId();
  const sub = "rgba(var(--txr),.7)";
  const ink = dark ? "var(--tx)" : "var(--tx)";
  const line = dark ? "rgba(var(--txr),.35)" : "rgba(var(--txr),.3)";
  const opts: { v: Sex | null; han: string; en: string }[] = [
    { v: "m", han: "男", en: "Male" },
    { v: "f", han: "女", en: "Female" },
    { v: null, han: "", en: "Leave unsaid" },
  ];
  return (
    <div role="radiogroup" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: sub }}>
        Sex at birth, which sets the way the luck pillars run
      </span>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = value === o.v;
          return (
            <button
              key={o.en}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.v)}
              className="font-gloss min-h-[44px] border px-4 text-[14px] transition-colors duration-200"
              style={{ borderColor: on ? "var(--gilt)" : line, color: ink, background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
            >
              {o.han ? <span className="font-han mr-2">{o.han}</span> : null}
              {o.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 大運, the decades laid out from the month pillar. Each column is a stem over
 * a branch, the age it opens at, the god its stem bears to the Day Master,
 * and, where the birth may be shown, the day it opens. Given the birth and
 * the reader's choice (`pillars`, `times`), a decade can be laid beside the
 * four, its years open under it, and each carries the marks of how it meets
 * the birth.
 */
export function LuckRoad({ luck, dayStem, dark = false, pillars, times }: { luck: LuckView; dayStem: number; dark?: boolean; pillars?: FourPillars; times?: Times }) {
  const ink = "var(--tx)";
  const sub = "rgba(var(--txr),.7)";
  const line = dark ? "rgba(var(--txr),.22)" : "rgba(var(--txr),.18)";
  const dm = STEMS[dayStem];
  const s = luck.start;
  const marks = (stem: number, branch: number) => (pillars ? kindsAgainst(pillars, stem, branch) : []);
  const years = times && times.decade !== null ? yearsOf(luck, times.decade, times.open) : [];
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-han text-[17px] font-bold" style={{ color: ink }}>大運 · The Luck Pillars</h4>
        <span className="font-gloss text-[12.5px]" style={{ color: sub }}>
          {luck.forward ? "Forward" : "Backward"} from the month pillar, the first opening at {age(s.years, s.months)}
          {s.days ? ` ${s.days} d` : ""}
        </span>
      </div>
      <ol
        className="mt-4 grid grid-cols-4 gap-2 min-[820px]:grid-cols-8"
        aria-label={`The luck pillars, running ${luck.forward ? "forward" : "backward"}`}
      >
        {luck.decades.map((d, i) => {
          const stem = STEMS[d.stem];
          const branch = BRANCHES[d.branch];
          const god = tenGodOf(dm, stem);
          const now = luck.current === i;
          const picked = times?.decade === i;
          const met = marks(d.stem, d.branch);
          const label = `From age ${age(d.ageYears, d.ageMonths)}${d.from ? `, ${d.from}` : ""}: ${stem.english} ${branch.english}, ${branch.animal}, ${god.english}${now ? ", the decade open now" : ""}${met.length ? `. Meets the birth: ${met.map((k) => TIE_NAMES[k].english).join(", ")}` : ""}`;
          const body = (
            <>
              <span className="font-gloss text-[11px] tabular-nums" style={{ color: sub }}>{age(d.ageYears, d.ageMonths)}</span>
              <span className="font-han mt-2 text-[24px] font-bold leading-tight min-[820px]:text-[26px]" style={{ color: ink }}>{stem.hanzi}</span>
              <span className="font-han text-[24px] font-bold leading-tight min-[820px]:text-[26px]" style={{ color: ink }}>{branch.hanzi}</span>
              <span className="font-han mt-2 text-[12px]" style={{ color: "var(--gilt)" }}>{god.hanzi}</span>
              <span className="font-gloss text-center text-[10.5px] leading-snug" style={{ color: sub }}>{god.english}</span>
              <span className="font-gloss mt-1 text-center text-[10.5px] leading-snug" style={{ color: sub }}>{branch.animal}</span>
              {d.from ? <span className="font-gloss mt-1 text-[10.5px] tabular-nums" style={{ color: sub }}>{d.from.slice(0, 4)}</span> : null}
              {pillars ? (
                <span data-marks className="font-han mt-1 min-h-[16px] text-[11.5px] tracking-[0.1em]" style={{ color: "var(--gilt)" }} aria-hidden="true">
                  {met.map((k) => TIE_NAMES[k].hanzi).join(" ")}
                </span>
              ) : null}
            </>
          );
          const cls = "flex h-full w-full min-w-0 flex-col items-center border px-1 py-3 transition-colors duration-200";
          const style = {
            borderColor: picked || now ? "var(--gilt)" : line,
            borderStyle: picked && !now ? "dashed" : "solid",
            background: picked ? "rgba(var(--ac2r),.18)" : now ? "rgba(var(--ac2r),.12)" : "transparent",
          } as const;
          return (
            <li key={i} aria-current={now ? "step" : undefined} className="min-w-0">
              {times ? (
                <button type="button" aria-pressed={picked} aria-label={label} onClick={() => times.setDecade(picked ? null : i)} className={cls} style={style}>
                  {body}
                </button>
              ) : (
                <div aria-label={label} className={cls} style={style}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      {times && years.length ? (
        <div className="mt-6">
          <h4 className="font-han text-[17px] font-bold" style={{ color: ink }}>流年 · The Years</h4>
          <ol className="mt-3 grid grid-cols-5 gap-2 min-[820px]:grid-cols-10" aria-label="The years of this decade">
            {years.map((y) => {
              const yp = yearPillar(y);
              const picked = times.year === y;
              const now = times.open === y;
              const met = marks(yp.stem, yp.branch);
              return (
                <li key={y} aria-current={now ? "step" : undefined} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={picked}
                    aria-label={`${y}: ${STEMS[yp.stem].english} ${BRANCHES[yp.branch].english}, ${BRANCHES[yp.branch].animal}${now ? ", the year open now" : ""}${met.length ? `. Meets the birth: ${met.map((k) => TIE_NAMES[k].english).join(", ")}` : ""}`}
                    onClick={() => times.setYear(picked ? null : y)}
                    className="flex h-full min-h-[44px] w-full min-w-0 flex-col items-center border px-1 py-2 transition-colors duration-200"
                    style={{
                      borderColor: picked || now ? "var(--gilt)" : line,
                      borderStyle: picked && !now ? "dashed" : "solid",
                      background: picked ? "rgba(var(--ac2r),.18)" : "transparent",
                    }}
                  >
                    <span className="font-gloss text-[11px] tabular-nums" style={{ color: sub }}>{y}</span>
                    <span className="font-han mt-1 text-[18px] font-bold leading-tight" style={{ color: ink }}>{STEMS[yp.stem].hanzi}{BRANCHES[yp.branch].hanzi}</span>
                    <span data-marks className="font-han mt-1 min-h-[16px] text-[11.5px] tracking-[0.1em]" style={{ color: "var(--gilt)" }} aria-hidden="true">
                      {met.map((k) => TIE_NAMES[k].hanzi).join(" ")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
