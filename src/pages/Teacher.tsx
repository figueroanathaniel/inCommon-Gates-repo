import { Link, useSearchParams } from "react-router";
import { LESSONS, PHASES, type FourPillars } from "@contracts/bazi";
import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { MirrorReading } from "@/components/academy/mirror";
import { PillarChart } from "@/components/academy/pillars";
import { LuckRoad, type LuckView } from "@/components/academy/luck";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { TIE_NAMES, crossSigns, crossTies, type Tie } from "@/lib/meet";
import { setTeacherRecord, useTeacherRecord } from "@/lib/teacher";
import { useTimes } from "@/lib/times";
import { useT, useZh } from "@/lib/lang";

interface Kept {
  id: number;
  label: string;
  yearStem: number; yearBranch: number; monthStem: number; monthBranch: number;
  dayStem: number; dayBranch: number; hourStem: number; hourBranch: number;
  luck?: LuckView | null;
}

const pillarsOf = (c: Kept): FourPillars => ({
  yearStem: c.yearStem, yearBranch: c.yearBranch, monthStem: c.monthStem, monthBranch: c.monthBranch,
  dayStem: c.dayStem, dayBranch: c.dayBranch, hourStem: c.hourStem, hourBranch: c.hourBranch,
});

const sub = "rgba(var(--txr),.7)";
const line = "rgba(var(--txr),.22)";

/**
 * 師 The Teacher's Table: a teacher sets one student's chart on the table,
 * reads it whole, lays their own beside it, and keeps what has been taught.
 * Every chart here is one the Desk already keeps. Nothing leaves the device.
 */
export default function Teacher() {
  const { user, isAuthenticated } = useAuth();
  const zh = useZh();
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });
  const [params, setParams] = useSearchParams();
  const mine = (charts.data ?? []) as Kept[];

  const num = (k: string) => {
    const v = Number(params.get(k));
    return Number.isInteger(v) && v > 0 ? v : null;
  };
  const student = mine.find((c) => c.id === num("student")) ?? null;
  const teacher = mine.find((c) => c.id === num("teacher") && c.id !== student?.id) ?? null;

  const choose = (k: "student" | "teacher", id: number | null) => {
    const next = new URLSearchParams(params);
    if (id === null) next.delete(k);
    else next.set(k, String(id));
    if (k === "student" && id !== null && next.get("teacher") === String(id)) next.delete("teacher");
    setParams(next, { replace: true });
  };

  const pick = (on: boolean) =>
    ({ borderColor: on ? "var(--gilt)" : line, color: "var(--tx)", background: on ? "rgba(var(--ac2r),.16)" : "transparent" }) as const;
  const pickCls = f + " min-h-[44px] border px-4 text-[14px] transition-colors duration-200";

  return (
    <Shell paper>
      <section className="py-14 min-[820px]:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Seal char="師" size={48} dark /></div>
          <h1 className={(zh ? "font-han font-black tracking-[0.12em]" : "font-gloss font-semibold tracking-[0.04em]") + " mt-6 text-[38px] text-[var(--tx)] min-[820px]:text-[46px]"}>
            {t("The Teacher's Table", "師席")}
          </h1>
          <p className={f + " mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed"} style={{ color: sub }}>
            {t(
              "Set a student's chart on the table and read it whole. Lay your own beside it, mark the scrolls the two of you have sat with, and keep your notes for the next sitting.",
              "將學生之盤置於席上，通讀之。把你自己的盤置於其旁，記下你們二人同讀過的卷，並存下筆記，以待下一次相坐。",
            )}
          </p>
        </div>

        {charts.isLoading ? (
          <p className={f + " mt-16 text-center text-[15px] italic"} style={{ color: sub }}>{t("The table is being cleared.", "席上正在收拾。")}</p>
        ) : mine.length === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl border px-8 py-12 text-center" style={{ borderColor: "rgba(var(--txr),.3)", background: "rgba(var(--sfr),.84)" }}>
            <p className={f + " text-[20px] font-bold text-[var(--tx)]"}>{t("The Desk holds no chart", "案上無盤")}</p>
            <p className={f + " mx-auto mt-4 max-w-md text-[15px] leading-relaxed"} style={{ color: sub }}>
              {t(
                "The table reads the charts the Desk keeps. Cast your student's pillars there, with their leave, and they can be set here.",
                "師席所讀，即書桌所存之盤。經學生同意，在書桌排其四柱，便可置於此席。",
              )}
            </p>
            <div className="mt-8 flex justify-center"><GhostButton to="/desk" dark>{t("Go to the Desk", "往書桌")}</GhostButton></div>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-12 grid max-w-2xl gap-8">
              <div role="radiogroup" aria-label={zh ? "學生" : "The student"}>
                <h2 className={f + " text-[19px] font-bold text-[var(--tx)]"}>{t("The student", "生")}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mine.map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={student?.id === c.id} onClick={() => choose("student", c.id)} className={pickCls} style={pick(student?.id === c.id)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {student && mine.length > 1 ? (
                <div role="radiogroup" aria-label={zh ? "老師" : "The teacher"}>
                  <h2 className={f + " text-[19px] font-bold text-[var(--tx)]"}>{t("The teacher", "師")}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" role="radio" aria-checked={!teacher} onClick={() => choose("teacher", null)} className={pickCls} style={pick(!teacher)}>
                      {t("No chart", "無")}
                    </button>
                    {mine.filter((c) => c.id !== student.id).map((c) => (
                      <button key={c.id} type="button" role="radio" aria-checked={teacher?.id === c.id} onClick={() => choose("teacher", c.id)} className={pickCls} style={pick(teacher?.id === c.id)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {student ? (
              <Sitting key={student.id} who={user?.id != null ? String(user.id) : null} student={student} teacher={teacher} zh={zh} />
            ) : null}
          </>
        )}
      </section>
      <Rule dark className="mb-16" />
    </Shell>
  );
}

function Sitting({ who, student, teacher, zh }: { who: string | null; student: Kept; teacher: Kept | null; zh: boolean }) {
  const pillars = pillarsOf(student);
  const times = useTimes(student.luck ?? null);
  const record = useTeacherRecord(who, student.id);
  const taught = new Set(record.taught);
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";

  const toggle = (id: string) => {
    if (!who) return;
    const next = new Set(taught);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setTeacherRecord(who, student.id, { taught: LESSONS.map((l) => l.id as string).filter((l) => next.has(l)) });
  };

  return (
    <>
      <MirrorReading pillars={pillars} label={student.label} incoming={student.luck ? times.incoming : []} meetings />
      {student.luck ? (
        <div className="mx-auto mt-14 max-w-3xl">
          <LuckRoad luck={student.luck} dayStem={student.dayStem} dark pillars={pillars} times={times} />
        </div>
      ) : null}

      {teacher ? <Between teacher={teacher} student={student} zh={zh} /> : null}

      <section className="mx-auto mt-16 max-w-2xl">
        <div className="flex items-baseline gap-4">
          <h2 className={f + " text-[22px] font-bold text-[var(--tx)]"}>{t("What has been taught", "已授之課")}</h2>
        </div>
        <ul className="mt-5 grid gap-1">
          {LESSONS.map((l) => {
            const on = taught.has(l.id);
            return (
              <li key={l.id} className="flex min-h-[48px] items-center gap-3 border-b" style={{ borderColor: line }}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={zh ? `${l.hanzi} 已授` : `${l.english}, taught`}
                  onClick={() => toggle(l.id)}
                  className={f + " flex h-[44px] w-[44px] shrink-0 items-center justify-center border text-[18px] font-bold transition-colors duration-200"}
                  style={{ borderColor: on ? "var(--gilt)" : line, color: on ? "var(--gilt)" : "transparent", background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
                >
                  {zh ? "授" : "✓"}
                </button>
                <span className="min-w-0 flex-1">
                  {zh ? (
                    <span className="font-han text-[17px] font-bold text-[var(--tx)]">{l.hanzi}</span>
                  ) : (
                    <span className="font-gloss text-[16px] font-semibold text-[var(--tx)]">{l.english}</span>
                  )}
                </span>
                <Link
                  to={`/scroll/${l.id}`}
                  className={(zh ? "font-han" : "font-gloss uppercase") + " inline-flex min-h-[44px] items-center px-3 text-[12.5px] tracking-[0.16em] underline-offset-4 hover:underline"}
                  style={{ color: "var(--tx)" }}
                  aria-label={zh ? `開卷 ${l.hanzi}` : `Open the scroll ${l.english}`}
                >
                  {t("Open", "開卷")}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-2xl">
        <div className="flex items-baseline gap-4">
          <h2 className={f + " text-[22px] font-bold text-[var(--tx)]"}>{t("The teacher's notes", "師記")}</h2>
        </div>
        <textarea
          value={record.notes}
          onChange={(e) => who && setTeacherRecord(who, student.id, { notes: e.target.value.slice(0, 20000) })}
          rows={8}
          maxLength={20000}
          aria-label={zh ? "師記" : `Notes on ${student.label}`}
          className="font-gloss mt-5 block w-full min-w-0 rounded-none border bg-transparent px-4 py-3 text-[16px] leading-[1.7] text-[var(--tx)]"
          style={{ borderColor: "rgba(var(--txr),.3)" }}
        />
        <p className={f + " mt-3 text-[12.5px] italic leading-relaxed"} style={{ color: sub }}>
          {t("Kept on this device with the chart, and burned with it.", "與此盤一同存於本裝置，亦與之一同焚去。")}
        </p>
      </section>

      <div className="mt-14 flex justify-center">
        <GhostButton to="/desk" dark>{t("Return to the Desk", "回書桌")}</GhostButton>
      </div>
    </>
  );
}

const tieText = (t: Tie, zh: boolean) =>
  zh ? `${TIE_NAMES[t.kind].hanzi}${t.phase ? PHASES[t.phase].hanzi : ""}` : `${TIE_NAMES[t.kind].english}${t.phase ? `, ${PHASES[t.phase].english}` : ""}`;

/** 師生合參: the teacher's four pillars beside the student's, and every meeting that takes a sign from each. */
function Between({ teacher, student, zh }: { teacher: Kept; student: Kept; zh: boolean }) {
  const tp = pillarsOf(teacher);
  const sp = pillarsOf(student);
  const signs = crossSigns(tp, sp);
  const all = [...signs.teacher, ...signs.student];
  const ties = crossTies(tp, sp);
  const name = (key: string) => all.find((s) => s.key === key);

  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <div className="flex items-baseline gap-4">
        <h2 className={(zh ? "font-han" : "font-gloss") + " text-[22px] font-bold text-[var(--tx)]"}>{zh ? "師生合參" : "Where the two charts meet"}</h2>
      </div>
      <div className="mt-6 grid gap-8">
        <PillarChart pillars={tp} dark interactive={false} caption={zh ? `師 ${teacher.label}` : `The teacher: ${teacher.label}`} />
        <PillarChart pillars={sp} dark interactive={false} caption={zh ? `生 ${student.label}` : `The student: ${student.label}`} />
      </div>
      {ties.length === 0 ? (
        <p className={zh ? "font-han mt-6 text-[14px]" : "font-gloss mt-6 text-[14px] italic"} style={{ color: sub }}>
          {zh ? "無合沖刑害" : "No sign of one chart meets a sign of the other."}
        </p>
      ) : (
        <ul className="mt-6 grid gap-1" aria-label={zh ? "師生合沖刑害" : "The meetings between the two charts"}>
          {ties.map((t, i) => (
            <li key={i} className="flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-1 border-b px-2 py-2" style={{ borderColor: line }}>
              <span className={(zh ? "font-han text-[17px] font-bold" : "font-gloss text-[14px] font-semibold")} style={{ color: "var(--gilt)" }}>{tieText(t, zh)}</span>
              <span className="ml-auto flex flex-wrap items-baseline gap-x-3">
                {t.members.map((m, k) => {
                  const s = name(m.sign);
                  return (
                    <span key={k} className="whitespace-nowrap">
                      <span className={(zh ? "font-han text-[17px]" : "font-gloss text-[15px]") + " font-bold"} style={{ color: "var(--tx)" }}>{zh ? m.char : m.en}</span>
                      <span className={(zh ? "font-han" : "font-gloss") + " ml-1 text-[12px]"} style={{ color: sub }}>{zh ? s?.hanzi : s?.english}</span>
                    </span>
                  );
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
