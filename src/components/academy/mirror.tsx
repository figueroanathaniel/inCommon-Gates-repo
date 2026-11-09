import { useState } from "react";
import type { FourPillars } from "@contracts/bazi";
import { ReadingGloss, censusLines, dayMasterOf, domainLines, godLines, seasonLines } from "@/lib/reading";
import { PillarChart } from "./pillars";
import { GhostButton, Rule } from "./chrome";

/**
 * 鑑 The Mirror's whole reading of a chart, spoken in the order of the
 * scrolls: the self named, the census taken, the pillars read in their
 * grounds, the court assembled. Used by the Mirror scroll and the Destiny Chart room.
 * One gloss keeper walks the whole reading, so a symbol named in the naming
 * of the self is kept in English when the court speaks it again.
 */
export function MirrorReading({
  pillars,
  label,
  compact = false,
}: {
  pillars: FourPillars;
  label: string;
  compact?: boolean;
}) {
  const [plain, setPlain] = useState(false);
  const gloss = new ReadingGloss(plain);
  const dm = dayMasterOf(pillars);
  const sections: { hanzi: string; english: string; lines: string[] }[] = [
    { hanzi: "主", english: "The Self is named", lines: seasonLines(pillars, gloss) },
    { hanzi: "衡", english: "The census is taken", lines: censusLines(pillars, gloss) },
    { hanzi: "宮", english: "The pillars are read in their grounds", lines: domainLines(pillars, gloss) },
    { hanzi: "朝", english: "The court is assembled", lines: godLines(pillars, gloss) },
  ];
  return (
    <div className="mt-10">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        <p className="font-gloss text-[12px] uppercase tracking-[0.22em] text-[var(--gilt)]">The reading</p>
        <GhostButton dark onClick={() => setPlain(!plain)} aria-pressed={plain}>
          {plain ? "With characters 顯字" : "English only 隱字"}
        </GhostButton>
      </div>
      <PillarChart pillars={pillars} dark caption={`${label}. Touch any pillar to hear its ground.`} />
      <p className="font-gloss mx-auto mt-8 max-w-2xl text-center text-[15px] italic leading-relaxed" style={{ color: "rgba(var(--txr),.65)" }}>
        The Day Master is {gloss.mark(dm.hanzi, dm.english)}. All that follows is spoken in relation to it.
      </p>
      {sections.map((s) => (
        <section key={s.hanzi} className="mx-auto mt-14 max-w-2xl">
          <div className="flex items-baseline gap-4">
            <span className="font-han text-[24px] font-bold text-[var(--tx)]">{s.hanzi}</span>
            <h3 className="font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">{s.english}</h3>
          </div>
          {s.lines.map((line, i) => (
            <p key={i} className="font-gloss mt-4 text-[16px] leading-[1.85] text-[rgba(var(--txr),.88)]">{line}</p>
          ))}
        </section>
      ))}
      {!compact ? (
        <>
          <Rule dark className="mx-auto mt-14 max-w-2xl" />
          <p className="font-gloss mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed" style={{ color: "rgba(var(--txr),.7)" }}>
            Here the reading stops, for the tradition knows where its jurisdiction ends. The ground is named,
            the season is named, the court is named. What a life makes of them belongs to the life, not to the page.
          </p>
        </>
      ) : null}
    </div>
  );
}
