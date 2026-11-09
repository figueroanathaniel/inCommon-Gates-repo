import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { MirrorReading } from "@/components/academy/mirror";
import { api } from "@/providers/data";
import type { FourPillars } from "@contracts/bazi";
import { LuckRoad } from "@/components/academy/luck";

/** The Destiny Chart (命盤) room: Your Nature, veiled or read. */
export default function Stone() {
  const stone = api.stone.useQuery();

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
          <h1 className="font-han mt-6 text-[38px] font-black tracking-[0.12em] text-[var(--tx)] min-[820px]:text-[46px]">Your Nature</h1>
          <p className="font-gloss mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed" style={{ color: "rgba(var(--txr),.7)" }}>
            One true chart, set at the centre of the house as the stone was set in the desert:
            the same life read in every script the hall keeps, until the scripts become one reading.
          </p>
        </div>

        {stone.isLoading ? (
          <p className="font-gloss mt-16 text-center text-[15px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
            The room is quiet while the Destiny Chart is sought.
          </p>
        ) : pillars && stone.data ? (
          <>
            {stone.data.note ? (
              <p className="font-gloss mx-auto mt-10 max-w-xl text-center text-[14.5px] italic leading-relaxed" style={{ color: "rgba(var(--txr),.66)" }}>
                Upon the pedestal is written: {stone.data.note}
              </p>
            ) : null}
            <MirrorReading pillars={pillars} label={`The Destiny Chart: ${stone.data.label}`} />
            {stone.data.luck ? (
              <div className="mx-auto mt-14 max-w-3xl">
                <LuckRoad luck={stone.data.luck} dayStem={stone.data.dayStem} dark />
              </div>
            ) : null}
            <div className="mt-14 flex justify-center">
              <GhostButton to="/scroll/jian" dark>Return to the Mirror scroll</GhostButton>
            </div>
          </>
        ) : (
          <div className="mx-auto mt-14 max-w-2xl">
            <div className="border px-8 py-14 text-center" style={{ borderColor: "rgba(var(--txr),.3)", background: "rgba(var(--sfr),.84)" }}>
              <p className="font-han text-[60px] font-black leading-none" style={{ color: "rgba(var(--txr),.66)" }}>命</p>
              <p className="font-han mt-6 text-[20px] font-bold text-[var(--tx)]">命盤未排</p>
              <p className="font-gloss mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(var(--txr),.7)" }}>
                The Destiny Chart is not yet laid out. The house does not read a chart it does not hold, and it will not invent one.
                When the true chart is set here, every scroll will be found written upon it.
              </p>
            </div>
          </div>
        )}
      </section>
      <Rule dark className="mb-16" />
    </Shell>
  );
}
