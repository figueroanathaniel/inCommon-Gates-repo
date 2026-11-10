import { useState } from "react";
import { Shell, Seal, Rule, JadeButton } from "@/components/academy/chrome";
import { PillarChart } from "@/components/academy/pillars";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { ZoneField } from "@/components/academy/zone-field";
import { LuckRoad } from "@/components/academy/luck";
import { deviceZone, zoneFrom, zoneLabel } from "@/lib/zones";

/** 案 The Desk: where a reader casts their own pillars and keeps them. */
export default function Desk() {
  const { isAuthenticated } = useAuth();
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });
  const cast = api.cast.useMutation();
  const remove = api.removeChart.useMutation();
  const setSex = api.setChartSex.useMutation();

  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState(() => zoneLabel(deviceZone()));
  const [placeTried, setPlaceTried] = useState(false);
  const [wants, setWants] = useState<number | null>(null);
  const zone = zoneFrom(place);

  const field =
    "font-gloss min-h-[44px] w-full border bg-transparent px-3 text-[15px] text-[var(--tx)] placeholder:text-[rgba(var(--txr),.66)]";
  const border = { borderColor: "rgba(var(--txr),.3)" } as const;

  const submit = () => {
    if (!date || !time) return;
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    if (!y || !m || !d) return;
    setPlaceTried(true);
    if (!zone) return;
    cast.mutate({ label: label.trim() || "A private chart", year: y, month: m, day: d, hour: h, minute: min, zone, sex: null });
  };

  const mine = charts.data ?? [];

  return (
    <Shell>
      <section className="py-14 min-[820px]:py-20">
        <div className="flex items-center gap-4">
          <Seal char="案" size={44} />
          <div>
            <h1 className="font-han text-[32px] font-bold tracking-[0.15em] text-[var(--tx)]">案 · 書桌</h1>
            <p className="font-gloss text-[13px] uppercase tracking-[0.26em] text-[var(--gilt)]">The Desk</p>
          </div>
        </div>
        <p className="font-gloss mt-7 max-w-2xl text-[15.5px] leading-relaxed text-[rgba(var(--txr),.72)]">
          Here you may cast the pillars of any moment you have leave to read. The Desk keeps six charts at most,
          for whoever keeps a hundred charts reads none of them. What you cast here is yours alone;
          the scrolls in the hall remain the same for every ear.
        </p>

        {/* The casting slip */}
        <div className="mt-10 max-w-xl border px-6 py-8 min-[820px]:px-10" style={{ borderColor: "rgba(var(--ac2r),.35)", background: "rgba(var(--sfr),.84)" }}>
          <h2 className="font-han text-[19px] font-bold text-[var(--tx)]">排八字 · Cast the eight characters</h2>
          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em] text-[rgba(var(--txr),.66)]">A name for the chart</span>
              <input className={field} style={border} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} placeholder="My own chart" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em] text-[rgba(var(--txr),.66)]">Day of birth</span>
                <input type="date" className={field} style={border} value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="block">
                <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em] text-[rgba(var(--txr),.66)]">Hour of birth</span>
                <input type="time" className={field} style={border} value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
            </div>
            <ZoneField value={place} onChange={setPlace} invalid={placeTried && !zone} fieldClass={field} border={border} />
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <JadeButton onClick={submit} disabled={!date || cast.isPending}>Cast the pillars</JadeButton>
              {cast.error ? <p className="font-gloss text-[13.5px]" style={{ color: "var(--warn)" }} role="alert">{cast.error.message}</p> : null}
            </div>
            <p className="font-gloss text-[12.5px] italic leading-relaxed" style={{ color: "rgba(var(--txr),.66)" }}>
              The year turns at 立春, near the fourth of February; the months turn at the solar terms;
              the days turn in the unbroken sixty-day round. The hour is read in the twelve double hours.
            </p>
          </div>
        </div>

        {/* What the Desk keeps */}
        <div className="mt-16">
          <Rule className="mb-10" />
          {charts.isLoading ? (
            <p className="font-gloss text-[15px] italic text-[rgba(var(--txr),.66)]">The desk is being tidied.</p>
          ) : mine.length === 0 ? (
            <p className="font-gloss text-[15px] italic text-[rgba(var(--txr),.66)]">
              The Desk is bare. Cast your own pillars above, and they will be kept here between visits.
            </p>
          ) : (
            <div className="grid gap-12">
              {mine.map((c) => (
                <div key={c.id} className="border px-5 py-8 min-[820px]:px-8" style={{ borderColor: "rgba(var(--ac2r),.3)", background: "rgba(var(--sfr),.84)" }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-han text-[20px] font-bold text-[var(--tx)]">{c.label}</h3>
                    <span className="font-gloss text-[12.5px] text-[rgba(var(--txr),.66)]">
                      born {c.birthYear}-{String(c.birthMonth).padStart(2, "0")}-{String(c.birthDay).padStart(2, "0")}, {String(c.birthHour).padStart(2, "0")}:{String(c.birthMinute).padStart(2, "0")}
                      {c.birthZone ? `, ${zoneLabel(c.birthZone)}` : ", Beijing time"}
                    </span>
                  </div>
                  <div className="mt-6">
                    <PillarChart
                      pillars={{
                        yearStem: c.yearStem, yearBranch: c.yearBranch, monthStem: c.monthStem, monthBranch: c.monthBranch,
                        dayStem: c.dayStem, dayBranch: c.dayBranch, hourStem: c.hourStem, hourBranch: c.hourBranch,
                      }}
                    />
                  </div>
                  <div className="mt-8">
                    {c.luck ? (
                      <LuckRoad luck={c.luck} dayStem={c.dayStem} />
                    ) : c.birthZone && wants !== c.id ? (
                      <button
                        type="button"
                        onClick={() => setWants(c.id)}
                        className="font-gloss min-h-[44px] border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)]"
                        style={{ borderColor: "rgba(var(--txr),.3)" }}
                      >
                        <span className="font-han mr-2">命盤</span>Lay out my Destiny Chart
                      </button>
                    ) : c.birthZone ? (
                      <div>
                        <h4 className="font-han text-[17px] font-bold text-[var(--tx)]">命盤 · Your Destiny Chart</h4>
                        <p className="font-gloss mt-2 text-[14px] leading-relaxed text-[rgba(var(--txr),.65)]">
                          Its decades run forward or backward by the sex at birth. Say which, and they are laid out here.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(["m", "f"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              disabled={setSex.isPending}
                              onClick={() => setSex.mutate({ id: c.id, sex: v })}
                              className="font-gloss min-h-[44px] border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)]"
                              style={{ borderColor: "rgba(var(--txr),.3)" }}
                            >
                              <span className="font-han mr-2">{v === "m" ? "男" : "女"}</span>{v === "m" ? "Male" : "Female"}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="font-gloss text-[14px] italic leading-relaxed text-[rgba(var(--txr),.66)]">
                        This chart was cast before the Desk asked where the birth happened. Cast it again to lay out its Destiny Chart.
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove.mutate({ id: c.id })}
                      className="font-gloss min-h-[44px] px-4 text-[12.5px] uppercase tracking-[0.16em] transition-opacity duration-200 hover:opacity-75"
                      style={{ color: "var(--warn)" }}
                      aria-label={`Burn the chart ${c.label} from the Desk`}
                    >
                      Burn this chart 焚
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
