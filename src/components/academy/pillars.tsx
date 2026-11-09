import { useState } from "react";
import type { FourPillars } from "@contracts/bazi";
import { PHASES } from "@contracts/bazi";
import { ReadingGloss, pillarViews } from "@/lib/reading";
import { GhostButton, Rule } from "./chrome";

/**
 * The chart, set in the old manner: four pillars in vertical writing,
 * the year at the right hand and the hour at the left, stem above branch.
 * The 44px floor does not bind inside [data-chart], but these columns
 * stand well above it regardless.
 */
export function PillarChart({
  pillars,
  dark = false,
  interactive = true,
  caption,
}: {
  pillars: FourPillars;
  dark?: boolean;
  interactive?: boolean;
  caption?: string;
}) {
  const views = pillarViews(pillars);
  const [open, setOpen] = useState<string | null>(null);
  const [plain, setPlain] = useState(false);
  const gloss = new ReadingGloss(plain);
  const inkColor = dark ? "#221f1a" : "#faf8f5";
  const subColor = dark ? "rgba(34,31,26,.6)" : "rgba(250,248,245,.6)";

  const selected = views.find((v) => v.key === open) ?? null;

  return (
    <div data-chart="pillars" className="w-full">
      <div
        dir="rtl"
        className="mx-auto flex w-full max-w-2xl items-stretch justify-center gap-2 min-[820px]:gap-4"
        role="group"
        aria-label="The four pillars, year at the right, hour at the left"
      >
        {views.map((v) => {
          const active = open === v.key;
          const body = (
            <>
              <span className="font-gloss text-[11px] uppercase tracking-[0.12em] min-[820px]:tracking-[0.2em]" style={{ color: subColor }}>
                {v.english.replace(" Pillar", "")}
              </span>
              <span
                className="font-han mt-3 font-bold"
                style={{ writingMode: "vertical-rl", textOrientation: "upright", fontSize: "clamp(32px, 9vw, 64px)", color: inkColor, letterSpacing: "0.14em", lineHeight: 1 }}
              >
                {v.stem.hanzi}{v.branch.hanzi}
              </span>
              <span className="font-han mt-3 text-[13px] tracking-[0.25em]" style={{ color: "#968155" }}>
                {v.hanzi}
              </span>
              <span className="font-gloss mt-1 text-center text-[11px]" style={{ color: subColor }}>
                {v.branch.animal} · {PHASES[v.branch.phase].english}
              </span>
            </>
          );
          const baseCls =
            "flex min-w-0 flex-1 flex-col items-center border-y px-1 py-5 transition-colors duration-200 min-[820px]:min-w-[110px]";
          const style = {
            borderColor: active ? "#968155" : dark ? "rgba(34,31,26,.22)" : "rgba(250,248,245,.18)",
            background: active ? (dark ? "rgba(150,129,85,.12)" : "rgba(150,129,85,.10)") : "transparent",
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
      </div>
      {caption ? (
        <p className="font-gloss mt-4 text-center text-[13px] italic" style={{ color: subColor }}>
          {caption}
        </p>
      ) : null}

      {interactive && selected ? (
        <div
          className="mx-auto mt-8 max-w-2xl border px-6 py-6"
          style={{ borderColor: dark ? "rgba(34,31,26,.25)" : "rgba(150,129,85,.35)", background: dark ? "rgba(255,255,255,.35)" : "rgba(29,29,36,.6)" }}
          role="region"
          aria-label={`Reading of the ${selected.english}`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-gloss text-[12px] uppercase tracking-[0.22em] text-[#968155]">Its ground</p>
            <GhostButton dark={dark} onClick={() => setPlain(!plain)} aria-pressed={plain}>
              {plain ? "Show the characters 顯字" : "Translate to English 英譯"}
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
