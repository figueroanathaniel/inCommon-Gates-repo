import type { FourPillars } from "@contracts/bazi";
import {
  phaseLines,
  phaseLinesZh,
  dayMasterOf,
  domainLines,
  domainLinesZh,
  godLines,
  godLinesZh,
  seasonLines,
  seasonLinesZh,
} from "@/lib/reading";
import { PillarChart } from "./pillars";
import type { Sign } from "@/lib/meet";
import { Rule } from "./chrome";
import { useZh } from "@/lib/lang";
import { useState } from "react";
import { closingAsk, takeAskTurn } from "@/content/sign-lines";
import { READ_FROM, RESTS, say } from "@/content/reading-turns";

/**
 * The Mirror's whole reading of a chart, spoken in the order of the scrolls:
 * the self named, the five phases gathered, the pillars read in their grounds, the
 * court assembled. Used by the Mirror scroll and the Destiny Chart room.
 * Read wholly in English or wholly in traditional Chinese, as the reader chose.
 */
export function MirrorReading({
  pillars,
  label,
  compact = false,
  incoming = [],
  meetings = false,
  turn,
}: {
  pillars: FourPillars;
  label: string;
  compact?: boolean;
  incoming?: Sign[];
  meetings?: boolean;
  /** The reading's turn, when the room has already taken one. */
  turn?: number;
}) {
  const zh = useZh();
  // Each time a reading is opened it turns once: its phrases and its closing
  // question are said a new way, and stay steady while it stays open.
  const [askTurn] = useState(() => turn ?? takeAskTurn());
  const dm = dayMasterOf(pillars);
  const sections: { key: string; title: string; lines: string[] }[] = zh
    ? [
        { key: "self", title: "主 · 自身之名", lines: seasonLinesZh(pillars) },
        { key: "phases", title: "衡 · 五行之數", lines: phaseLinesZh(pillars) },
        { key: "grounds", title: "宮 · 四柱所主", lines: domainLinesZh(pillars) },
        { key: "court", title: "朝 · 十神列朝", lines: godLinesZh(pillars) },
      ]
    : [
        { key: "self", title: "The Self is named", lines: seasonLines(pillars, undefined, askTurn) },
        { key: "phases", title: "The five phases gather", lines: phaseLines(pillars, undefined, askTurn) },
        { key: "grounds", title: "The pillars are read in their grounds", lines: domainLines(pillars, undefined, askTurn) },
        { key: "court", title: "The court is assembled", lines: godLines(pillars, undefined, askTurn) },
      ];
  const font = zh ? "font-han" : "font-gloss";
  return (
    <div className="mt-10">
      <p className={(zh ? "font-han text-[15px] tracking-[0.3em]" : "font-gloss text-[12px] uppercase tracking-[0.22em]") + " mx-auto max-w-2xl text-[var(--gilt)]"}>
        {zh ? "讀盤" : "The reading"}
      </p>
      <PillarChart
        pillars={pillars}
        dark
        incoming={incoming}
        meetings={meetings}
        caption={zh ? `${label}。點觸任一柱，以聞其所主。` : `${label}. Touch any pillar to hear its ground.`}
      />
      <p className={font + " mx-auto mt-8 max-w-2xl text-center text-[15px] italic leading-relaxed"} style={{ color: "rgba(var(--txr),.65)" }}>
        {zh ? `日主為${dm.hanzi}。以下所言，皆就此而論。` : say(READ_FROM, { dm: dm.english }, dm.yinyang, askTurn, 1)}
      </p>
      {sections.map((s) => (
        <section key={s.key} className="mx-auto mt-14 max-w-2xl">
          <h3 className={(zh ? "font-han text-[18px] font-bold tracking-[0.2em]" : "font-gloss text-[13px] uppercase tracking-[0.22em]") + " text-[var(--gilt)]"}>{s.title}</h3>
          {s.lines.map((line, i) => (
            <p key={i} className={font + " mt-4 text-[16px] leading-[1.85] text-[rgba(var(--txr),.88)]"}>{line}</p>
          ))}
        </section>
      ))}
      {!zh ? (
        <p data-closing-ask className="font-gloss mx-auto mt-14 max-w-2xl text-center text-[17px] italic leading-relaxed text-[rgba(var(--txr),.88)]">
          {closingAsk(pillars, askTurn)}
        </p>
      ) : null}
      {!compact ? (
        <>
          <Rule dark className="mx-auto mt-14 max-w-2xl" />
          <p className={font + " mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed"} style={{ color: "rgba(var(--txr),.7)" }}>
            {zh
              ? "讀盤至此而止，傳統自知其所轄之界。地已名，季已名，朝已名。一生如何用之，屬於那一生。"
              : say(RESTS, {}, dm.yinyang, askTurn, 2)}
          </p>
        </>
      ) : null}
    </div>
  );
}
