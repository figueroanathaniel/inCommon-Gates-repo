import type { FourPillars } from "@contracts/bazi";
import {
  censusLines,
  censusLinesZh,
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

/**
 * The Mirror's whole reading of a chart, spoken in the order of the scrolls:
 * the self named, the census taken, the pillars read in their grounds, the
 * court assembled. Used by the Mirror scroll and the Destiny Chart room.
 * Read wholly in English or wholly in traditional Chinese, as the reader chose.
 */
export function MirrorReading({
  pillars,
  label,
  compact = false,
  incoming = [],
  meetings = false,
}: {
  pillars: FourPillars;
  label: string;
  compact?: boolean;
  incoming?: Sign[];
  meetings?: boolean;
}) {
  const zh = useZh();
  const dm = dayMasterOf(pillars);
  const sections: { key: string; title: string; lines: string[] }[] = zh
    ? [
        { key: "self", title: "主 · 自身之名", lines: seasonLinesZh(pillars) },
        { key: "census", title: "衡 · 五行之數", lines: censusLinesZh(pillars) },
        { key: "grounds", title: "宮 · 四柱所主", lines: domainLinesZh(pillars) },
        { key: "court", title: "朝 · 十神列朝", lines: godLinesZh(pillars) },
      ]
    : [
        { key: "self", title: "The Self is named", lines: seasonLines(pillars) },
        { key: "census", title: "The census is taken", lines: censusLines(pillars) },
        { key: "grounds", title: "The pillars are read in their grounds", lines: domainLines(pillars) },
        { key: "court", title: "The court is assembled", lines: godLines(pillars) },
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
        {zh ? `日主為${dm.hanzi}。以下所言，皆就此而論。` : `The Day Master is ${dm.english}. Everything after this is said in relation to it.`}
      </p>
      {sections.map((s) => (
        <section key={s.key} className="mx-auto mt-14 max-w-2xl">
          <h3 className={(zh ? "font-han text-[18px] font-bold tracking-[0.2em]" : "font-gloss text-[13px] uppercase tracking-[0.22em]") + " text-[var(--gilt)]"}>{s.title}</h3>
          {s.lines.map((line, i) => (
            <p key={i} className={font + " mt-4 text-[16px] leading-[1.85] text-[rgba(var(--txr),.88)]"}>{line}</p>
          ))}
        </section>
      ))}
      {!compact ? (
        <>
          <Rule dark className="mx-auto mt-14 max-w-2xl" />
          <p className={font + " mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed"} style={{ color: "rgba(var(--txr),.7)" }}>
            {zh
              ? "讀盤至此而止，傳統自知其所轄之界。地已名，季已名，朝已名。一生如何用之，屬於那一生。"
              : "Here the reading rests. The ground is named, the season is named and the court is named. What a life makes of them belongs to the life."}
          </p>
        </>
      ) : null}
    </div>
  );
}
