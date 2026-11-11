import { useState } from "react";
import { Link } from "react-router";
import { Shell, Seal, Rule, JadeButton } from "@/components/academy/chrome";
import { PillarChart } from "@/components/academy/pillars";
import type { FourPillars } from "@contracts/bazi";
import { useAuth } from "@/hooks/useAuth";
import { api, type Offer } from "@/providers/data";
import { showCode } from "@/lib/share";
import { ZoneField } from "@/components/academy/zone-field";
import { LuckRoad, type LuckView } from "@/components/academy/luck";
import { useTimes } from "@/lib/times";
import { deviceZone, zoneFrom, zoneLabel } from "@/lib/zones";
import { useErr, useT, useZh } from "@/lib/lang";

/** 案 The Desk: where a reader casts their own pillars and keeps them. */
export default function Desk() {
  const { isAuthenticated, isSignedIn } = useAuth();
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });
  const cast = api.cast.useMutation();
  const remove = api.removeChart.useMutation();
  const setSex = api.setChartSex.useMutation();
  const shares = api.shares.useQuery(undefined, { enabled: isSignedIn });
  const sharing = isSignedIn && shares.data?.on === true;

  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState(() => zoneLabel(deviceZone()));
  const [placeTried, setPlaceTried] = useState(false);
  const [wants, setWants] = useState<number | null>(null);
  const zone = zoneFrom(place);
  const zh = useZh();
  const t = useT();
  const err = useErr();
  const f = zh ? "font-han" : "font-gloss";
  const lab = (zh ? "font-han tracking-[0.18em]" : "font-gloss uppercase tracking-[0.18em]") + " mb-1 block text-[12px] text-[rgba(var(--txr),.66)]";

  const field =
    "font-gloss block h-[48px] w-full min-w-0 appearance-none rounded-none border bg-transparent px-3 text-left text-[16px] leading-[48px] text-[var(--tx)] placeholder:text-[rgba(var(--txr),.66)] [&::-webkit-date-and-time-value]:text-left [&::-webkit-date-and-time-value]:min-h-[1.2em] [&::-webkit-datetime-edit]:p-0";
  const border = { borderColor: "rgba(var(--txr),.3)" } as const;

  const submit = () => {
    if (!date || !time) return;
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    if (!y || !m || !d) return;
    setPlaceTried(true);
    if (!zone) return;
    cast.mutate({ label: label.trim() || t("A private chart", "私盤"), year: y, month: m, day: d, hour: h, minute: min, zone, sex: null });
  };

  const mine = charts.data ?? [];

  return (
    <Shell>
      <section className="py-14 min-[820px]:py-20">
        <div className="flex items-center gap-4">
          <Seal char="案" size={44} />
          <div>
            {zh ? (
              <h1 className="font-han text-[32px] font-bold tracking-[0.15em] text-[var(--tx)]">案 · 書桌</h1>
            ) : (
              <h1 className="font-gloss text-[30px] font-semibold tracking-[0.06em] text-[var(--tx)]">The Desk</h1>
            )}
          </div>
        </div>
        <p className={f + " mt-7 max-w-2xl text-[15.5px] leading-relaxed text-[rgba(var(--txr),.72)]"}>
          {t(
            "Here you can cast the pillars of any moment you have leave to read. The Desk keeps twenty four charts at most, because whoever keeps a hundred charts reads none of them. What you cast here is yours alone. The scrolls in the hall stay the same for everyone.",
            "凡你有權一讀之時刻，皆可在此排其四柱。書桌至多存二十四張命盤，因存百盤者一盤也不讀。你在此所排，唯你所有；堂中諸卷，對每一位聽者皆同。",
          )}
        </p>

        {/* The casting slip */}
        <div className="mt-10 max-w-xl border px-6 py-8 min-[820px]:px-10" style={{ borderColor: "rgba(var(--ac2r),.35)", background: "rgba(var(--sfr),.84)" }}>
          <h2 className={f + " text-[19px] font-bold text-[var(--tx)]"}>{t("Cast the eight characters", "排八字")}</h2>
          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className={lab}>{t("A name for the chart", "命盤之名")}</span>
              <input className={field} style={border} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} placeholder={t("My own chart", "我的命盤")} />
            </label>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
              <label className="block">
                <span className={lab}>{t("Day of birth", "生日")}</span>
                <input type="date" className={field} style={border} value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="block">
                <span className={lab}>{t("Hour of birth", "生時")}</span>
                <input type="time" className={field} style={border} value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
            </div>
            <ZoneField value={place} onChange={setPlace} invalid={placeTried && !zone} fieldClass={field} border={border} />
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <JadeButton onClick={submit} disabled={!date || cast.isPending}>{t("Cast the pillars", "排四柱")}</JadeButton>
              {cast.error ? <p className="font-gloss text-[13.5px]" style={{ color: "var(--warn)" }} role="alert">{err(cast.error.message)}</p> : null}
            </div>
            <p className={f + " text-[12.5px] italic leading-relaxed"} style={{ color: "rgba(var(--txr),.66)" }}>
              {t(
                "The year turns at the Beginning of Spring, near the fourth of February. The months turn at the solar terms, and the days turn in the unbroken round of sixty. The hour is read in the twelve double hours.",
                "年於立春而轉，約在二月四日前後；月於節氣而轉；日循六十甲子不斷而轉。時以十二時辰而讀。",
              )}
            </p>
          </div>
        </div>

        {/* What the Desk keeps */}
        <div className="mt-16">
          <Rule className="mb-10" />
          {charts.isLoading ? (
            <p className={f + " text-[15px] italic text-[rgba(var(--txr),.66)]"}>{t("The desk is being tidied.", "書桌整理中。")}</p>
          ) : mine.length === 0 ? (
            <p className={f + " text-[15px] italic text-[rgba(var(--txr),.66)]"}>
              {t("The Desk is bare. Cast your own pillars above, and it keeps them here between visits.", "書桌空著。在上方排你的四柱，便會存於此處，來訪之間不失。")}
            </p>
          ) : (
            <div className="grid gap-12">
              {mine.map((c) => (
                <div key={c.id} className="min-w-0 border px-5 py-8 min-[820px]:px-8" style={{ borderColor: "rgba(var(--ac2r),.3)", background: "rgba(var(--sfr),.84)" }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className={f + " text-[20px] font-bold text-[var(--tx)]"}>{c.label}</h3>
                    <span className={f + " text-[12.5px] text-[rgba(var(--txr),.66)]"}>
                      {zh
                        ? `生於${c.birthYear}年${c.birthMonth}月${c.birthDay}日 ${String(c.birthHour).padStart(2, "0")}:${String(c.birthMinute).padStart(2, "0")}，${c.birthZone ? zoneLabel(c.birthZone) : "北京時間"}`
                        : `born ${c.birthYear}-${String(c.birthMonth).padStart(2, "0")}-${String(c.birthDay).padStart(2, "0")}, ${String(c.birthHour).padStart(2, "0")}:${String(c.birthMinute).padStart(2, "0")}${c.birthZone ? `, ${zoneLabel(c.birthZone)}` : ", Beijing time"}`}
                    </span>
                  </div>
                  <DeskChart
                    pillars={{
                      yearStem: c.yearStem, yearBranch: c.yearBranch, monthStem: c.monthStem, monthBranch: c.monthBranch,
                      dayStem: c.dayStem, dayBranch: c.dayBranch, hourStem: c.hourStem, hourBranch: c.hourBranch,
                    }}
                    luck={c.luck ?? null}
                  />
                  <div className={c.luck ? "hidden" : "mt-8"}>
                    {c.luck ? null : c.birthZone && wants !== c.id ? (
                      <button
                        type="button"
                        onClick={() => setWants(c.id)}
                        className="font-gloss min-h-[44px] border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)]"
                        style={{ borderColor: "rgba(var(--txr),.3)" }}
                      >
                        {t("Lay out my Destiny Chart", "排我的命盤")}
                      </button>
                    ) : c.birthZone ? (
                      <div>
                        <h4 className={f + " text-[17px] font-bold text-[var(--tx)]"}>{t("Your Destiny Chart", "你的命盤")}</h4>
                        <p className={f + " mt-2 text-[14px] leading-relaxed text-[rgba(var(--txr),.65)]"}>
                          {t("Its decades run forward or backward by the sex at birth. Say which, and they are laid out here.", "大運依出生之性別順行或逆行。說明是哪一種，便在此排出。")}
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
                              {zh ? <span className="font-han">{v === "m" ? "男" : "女"}</span> : v === "m" ? "Male" : "Female"}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className={f + " text-[14px] italic leading-relaxed text-[rgba(var(--txr),.66)]"}>
                        {t("This chart was cast before the Desk asked where the birth happened. Cast it again to lay out its Destiny Chart.", "此盤排於書桌詢問出生之地以前。重排一次，便可排出其命盤。")}
                      </p>
                    )}
                  </div>
                  {sharing ? (
                    <ShareWithTeacher chartId={c.id} label={c.label} offers={(shares.data?.offers ?? []).filter((o) => o.chartId === c.id)} />
                  ) : null}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/teacher?student=${c.id}`}
                      className="font-gloss inline-flex min-h-[44px] items-center border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)]"
                      style={{ borderColor: "rgba(var(--txr),.3)" }}
                    >
                      {t("Read as a teacher", "師席")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove.mutate({ id: c.id })}
                      className="font-gloss min-h-[44px] px-4 text-[12.5px] uppercase tracking-[0.16em] transition-opacity duration-200 hover:opacity-75"
                      style={{ color: "var(--warn)" }}
                      aria-label={zh ? `自書桌焚去命盤 ${c.label}` : `Burn the chart ${c.label} from the Desk`}
                    >
                      {t("Burn this chart", "焚此盤")}
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

/** One kept chart with whatever the reader lays beside it: its own decade and year, and how they meet the birth. */
function DeskChart({ pillars, luck }: { pillars: FourPillars; luck: LuckView | null }) {
  const times = useTimes(luck);
  return (
    <>
      <div className="mt-6">
        <PillarChart pillars={pillars} incoming={luck ? times.incoming : []} meetings />
      </div>
      {luck ? (
        <div className="mt-8">
          <LuckRoad luck={luck} dayStem={pillars.dayStem} pillars={pillars} times={times} />
        </div>
      ) : null}
    </>
  );
}

const day = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "long" });
};

/**
 * 呈師 Share one chart with a teacher. The Desk makes a code; the student hands
 * it over themselves. Nothing is shared until a teacher takes the code up, and
 * the student can end it here whenever they like.
 */
function ShareWithTeacher({ chartId, label, offers }: { chartId: number; label: string; offers: Offer[] }) {
  const [open, setOpen] = useState(offers.length > 0);
  const offer = api.offerShare.useMutation();
  const setProgress = api.setShareProgress.useMutation();
  const end = api.endShare.useMutation();
  const quiet = "rgba(var(--txr),.72)";
  const edge = { borderColor: "rgba(var(--txr),.3)" } as const;
  const zh = useZh();
  const t = useT();
  const err = useErr();
  const f = zh ? "font-han" : "font-gloss";
  const btn = f + " min-h-[44px] border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)] disabled:opacity-50";
  const panel = `share-${chartId}`;

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: "rgba(var(--txr),.18)" }}>
      <button type="button" className={btn} style={edge} aria-expanded={open} aria-controls={panel} onClick={() => setOpen(!open)}>
        {t("Share with a teacher", "呈於師")}
      </button>
      {open ? (
        <div id={panel} className="mt-5 grid gap-5">
          <p className={f + " max-w-xl text-[14px] leading-relaxed"} style={{ color: quiet }}>
            {t(
              "The Desk makes a code for you to hand to your teacher. A teacher who enters it at their table can read this chart. They see its name, the day, hour and place of birth as kept here, the sex if you gave it, and the eight characters. They cannot change it, and they see nothing else of yours. You can end the share here at any time.",
              "書桌為你立一符，由你親手交予老師。老師在其席上輸入此符，便可讀此盤：盤名，此處所存之生日、時辰與出生地，你若填過的性別，以及八字。老師不能更改此盤，也看不到你其餘之物。你隨時可在此收回。",
            )}
          </p>
          {offers.length > 0 ? (
            <ul className="grid gap-3" aria-label={zh ? `${label} 之呈` : `Shares of ${label}`}>
              {offers.map((o) => {
                const spent = !o.taken && new Date(o.expiresAt).getTime() < Date.now();
                return (
                  <li key={o.id} className="border px-4 py-4" style={edge}>
                    {o.taken ? (
                      <p className={f + " text-[14.5px] text-[var(--tx)]"}>{t("A teacher holds this chart.", "已有老師受此盤。")}</p>
                    ) : spent ? (
                      <p className={f + " text-[14.5px] text-[var(--tx)]"}>{t("This code was not taken up within seven days and no longer opens anything.", "此符七日內無人受之，已不能開啟任何盤。")}</p>
                    ) : (
                      <p className={f + " text-[14.5px] text-[var(--tx)]"}>
                        <span className="select-all font-mono text-[18px] tracking-[0.14em]" data-share-code>{showCode(o.code ?? "")}</span>
                        <span className="ml-3 text-[13px]" style={{ color: quiet }}>{zh ? `有效至 ${day(o.expiresAt)}` : `good until ${day(o.expiresAt)}`}</span>
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {spent ? null : (
                        <label className={f + " inline-flex min-h-[44px] cursor-pointer items-center gap-3 text-[14px] text-[var(--tx)]"}>
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[var(--gilt)]"
                            checked={o.withProgress}
                            disabled={setProgress.isPending}
                            onChange={(e) => setProgress.mutate({ id: o.id, on: e.target.checked })}
                          />
                          {t("Also show the scrolls I have marked as read", "並示我已讀之卷")}
                        </label>
                      )}
                      <button
                        type="button"
                        disabled={end.isPending}
                        onClick={() => end.mutate({ id: o.id })}
                        className={(zh ? "font-han" : "font-gloss uppercase") + " min-h-[44px] px-2 text-[12.5px] tracking-[0.16em] transition-opacity duration-200 hover:opacity-75"}
                        style={{ color: "var(--warn)" }}
                        aria-label={zh ? (o.taken ? `收回 ${label} 之呈` : `撤去 ${label} 之符`) : o.taken ? `End this share of ${label}` : `Withdraw this code for ${label}`}
                      >
                        {o.taken ? t("End this share", "收回此呈") : t("Withdraw", "撤符")}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button type="button" className={btn} style={edge} disabled={offer.isPending} onClick={() => offer.mutate({ chartId, withProgress: false })}>
              {t("Make a code", "立符")}
            </button>
          </div>
          {offer.error || end.error || setProgress.error ? (
            <p className={f + " text-[13.5px]"} style={{ color: "var(--warn)" }} role="alert">{err((offer.error ?? end.error ?? setProgress.error)?.message ?? "")}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
