import { useId } from "react";
import { STEMS, BRANCHES, tenGodOf } from "@contracts/bazi";

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
  const sub = dark ? "rgba(34,31,26,.6)" : "rgba(250,248,245,.55)";
  const ink = dark ? "#221f1a" : "#faf8f5";
  const line = dark ? "rgba(34,31,26,.35)" : "rgba(250,248,245,.3)";
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
              style={{ borderColor: on ? "#968155" : line, color: ink, background: on ? "rgba(150,129,85,.16)" : "transparent" }}
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
 * and, where the birth may be shown, the day it opens.
 */
export function LuckRoad({ luck, dayStem, dark = false }: { luck: LuckView; dayStem: number; dark?: boolean }) {
  const ink = dark ? "#221f1a" : "#faf8f5";
  const sub = dark ? "rgba(34,31,26,.62)" : "rgba(250,248,245,.62)";
  const line = dark ? "rgba(34,31,26,.22)" : "rgba(250,248,245,.18)";
  const dm = STEMS[dayStem];
  const s = luck.start;
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
          return (
            <li
              key={i}
              aria-current={now ? "step" : undefined}
              aria-label={`From age ${age(d.ageYears, d.ageMonths)}${d.from ? `, ${d.from}` : ""}: ${stem.english} ${branch.english}, ${branch.animal}, ${god.english}${now ? ", the decade open now" : ""}`}
              className="flex min-w-0 flex-col items-center border px-1 py-3"
              style={{ borderColor: now ? "#968155" : line, background: now ? "rgba(150,129,85,.12)" : "transparent" }}
            >
              <span className="font-gloss text-[11px] tabular-nums" style={{ color: sub }}>{age(d.ageYears, d.ageMonths)}</span>
              <span className="font-han mt-2 text-[24px] font-bold leading-tight min-[820px]:text-[26px]" style={{ color: ink }}>{stem.hanzi}</span>
              <span className="font-han text-[24px] font-bold leading-tight min-[820px]:text-[26px]" style={{ color: ink }}>{branch.hanzi}</span>
              <span className="font-han mt-2 text-[12px]" style={{ color: "#968155" }}>{god.hanzi}</span>
              <span className="font-gloss text-center text-[10.5px] leading-snug" style={{ color: sub }}>{god.english}</span>
              <span className="font-gloss mt-1 text-center text-[10.5px] leading-snug" style={{ color: sub }}>{branch.animal}</span>
              {d.from ? <span className="font-gloss mt-1 text-[10.5px] tabular-nums" style={{ color: sub }}>{d.from.slice(0, 4)}</span> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
