import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { MirrorReading } from "@/components/academy/mirror";
import { api } from "@/providers/data";
import type { FourPillars } from "@contracts/bazi";
import { LuckRoad } from "@/components/academy/luck";
import { useTimes } from "@/lib/times";
import { useT, useZh } from "@/lib/lang";

/** The Destiny Chart (命盤) room: Your Nature, veiled or read. */
export default function Stone() {
  const stone = api.stone.useQuery();
  const times = useTimes(stone.data?.luck ?? null);
  const zh = useZh();
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";

  const pillars: FourPillars | null = stone.data
    ? {
        yearStem: stone.data.yearStem, yearBranch: stone.data.yearBranch,
        monthStem: stone.data.monthStem, monthBranch: stone.data.monthBranch,
        dayStem: stone.data.dayStem, dayBranch: stone.data.dayBranch,
        hourStem: stone.data.hourStem, hourBranch: stone.data.hourBranch,
      }
    : null;

  return (
    <Shell paper>
      <section className="py-14 min-[820px]:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Seal char="命" size={48} dark /></div>
          <h1 className={(zh ? "font-han font-black tracking-[0.12em]" : "font-gloss font-semibold tracking-[0.04em]") + " mt-6 text-[38px] text-[var(--tx)] min-[820px]:text-[46px]"}>{t("Your Nature", "命盤")}</h1>
          <p className={f + " mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed"} style={{ color: "rgba(var(--txr),.7)" }}>
            {t(
              "One true chart, set at the centre of the house: the same life read in every script the hall keeps, until the scripts become one reading.",
              "一張真盤，置於書院之中：同一生命，以堂中所藏諸卷之字讀之，直至諸卷合為一讀。",
            )}
          </p>
        </div>

        {stone.isLoading ? (
          <p className={f + " mt-16 text-center text-[15px] italic"} style={{ color: "rgba(var(--txr),.66)" }}>
            {t("The room is quiet while the Destiny Chart is sought.", "尋命盤之時，此室寂然。")}
          </p>
        ) : pillars && stone.data ? (
          <>
            {stone.data.note ? (
              <p className={f + " mx-auto mt-10 max-w-xl text-center text-[14.5px] italic leading-relaxed"} style={{ color: "rgba(var(--txr),.66)" }}>
                {t("Upon the pedestal is written: ", "座上書曰：")}{stone.data.note}
              </p>
            ) : null}
            <MirrorReading pillars={pillars} label={zh ? `命盤：${stone.data.labelZh}` : `The Destiny Chart: ${stone.data.label}`} incoming={stone.data.luck ? times.incoming : []} meetings />
            {stone.data.luck ? (
              <div className="mx-auto mt-14 max-w-3xl">
                <LuckRoad luck={stone.data.luck} dayStem={stone.data.dayStem} dark pillars={pillars} times={times} />
              </div>
            ) : null}
            <div className="mt-14 flex justify-center">
              <GhostButton to="/scroll/jian" dark>{t("Return to the Mirror scroll", "回鑑卷")}</GhostButton>
            </div>
          </>
        ) : (
          <div className="mx-auto mt-14 max-w-2xl">
            <div className="border px-8 py-14 text-center" style={{ borderColor: "rgba(var(--txr),.3)", background: "rgba(var(--sfr),.84)" }}>
              {zh ? <p className="font-han text-[60px] font-black leading-none" style={{ color: "rgba(var(--txr),.66)" }}>命</p> : null}
              <p className={f + (zh ? " mt-6" : "") + " text-[20px] font-bold text-[var(--tx)]"}>{t("The Destiny Chart is not yet laid out", "命盤未排")}</p>
              <p className={f + " mx-auto mt-4 max-w-md text-[15px] leading-relaxed"} style={{ color: "rgba(var(--txr),.7)" }}>
                {t(
                  "The house does not read a chart it does not hold, and it will not invent one. When the true chart is set here, every scroll will be found written upon it.",
                  "書院不讀未持之盤，亦不憑空造盤。真盤置於此時，諸卷皆可見書於其上。",
                )}
              </p>
            </div>
          </div>
        )}
      </section>
      <Rule dark className="mb-16" />
    </Shell>
  );
}
