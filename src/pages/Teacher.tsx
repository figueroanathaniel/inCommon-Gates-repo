import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { LESSONS, PHASES, STEMS, tenGodOf, type FourPillars } from "@contracts/bazi";
import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { MirrorReading } from "@/components/academy/mirror";
import { PillarChart } from "@/components/academy/pillars";
import { LuckRoad, type LuckView } from "@/components/academy/luck";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { TIE_NAMES, crossSigns, crossTies, type Tie } from "@/lib/meet";
import { setTeacherRecord, useTeacherRecord } from "@/lib/teacher";
import { useTimes } from "@/lib/times";
import { useZh } from "@/lib/lang";

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
 * The charts are the ones the Desk keeps, and the ones a student has shared
 * by a code. The teacher's marks and notes never leave the device.
 */
export default function Teacher() {
  const { user, isAuthenticated, isSignedIn } = useAuth();
  const zh = useZh();
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });
  const [params, setParams] = useSearchParams();
  const mine = (charts.data ?? []) as Kept[];
  const shares = api.shares.useQuery(undefined, { enabled: isSignedIn });
  const sharing = isSignedIn && shares.data?.on === true;
  const held = sharing ? (shares.data?.held ?? []) : [];
  const shared = held.map((h) => h.chart as Kept);

  const num = (k: string) => {
    const v = Number(params.get(k));
    return Number.isInteger(v) && v > 0 ? v : null;
  };
  const student = [...mine, ...shared].find((c) => c.id === num("student")) ?? null;
  const from = student ? (held.find((h) => h.chart.id === student.id) ?? null) : null;
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
  const pickCls = "font-gloss min-h-[44px] border px-4 text-[14px] transition-colors duration-200";

  return (
    <Shell paper>
      <section className="py-14 min-[820px]:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Seal char="師" size={48} dark /></div>
          <h1 className="font-han mt-6 text-[38px] font-black tracking-[0.12em] text-[var(--tx)] min-[820px]:text-[46px]">
            <span data-en>The Teacher's Table</span><span data-zh>師席</span>
          </h1>
          <p data-en className="font-gloss mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed" style={{ color: sub }}>
            Set a student's chart on the table and read it whole. Lay your own beside it,
            mark the scrolls the two of you have sat with, and keep your notes for the next sitting.
          </p>
        </div>

        {charts.isLoading ? (
          <p className="font-gloss mt-16 text-center text-[15px] italic" style={{ color: sub }}>The table is being cleared.</p>
        ) : mine.length + shared.length === 0 ? (
          <>
          <div className="mx-auto mt-14 max-w-2xl border px-8 py-12 text-center" style={{ borderColor: "rgba(var(--txr),.3)", background: "rgba(var(--sfr),.84)" }}>
            <p className="font-han text-[20px] font-bold text-[var(--tx)]">案上無盤</p>
            <p data-en className="font-gloss mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: sub }}>
              The table reads the charts the Desk keeps. Cast your student's pillars there, with their leave, and they can be set here.
            </p>
            <div className="mt-8 flex justify-center"><GhostButton to="/desk" dark><span className="font-han">案</span><span data-en>Go to the Desk</span></GhostButton></div>
          </div>
          {sharing ? <div className="mx-auto mt-10 max-w-2xl"><TakeCode zh={zh} onTaken={(id) => choose("student", id)} known={[]} /></div> : null}
          </>
        ) : (
          <>
            <div className="mx-auto mt-12 grid max-w-2xl gap-8">
              <div role="radiogroup" aria-label={zh ? "學生" : "The student"}>
                <h2 className="font-han text-[19px] font-bold text-[var(--tx)]">生<span data-en className="font-gloss ml-3 text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">The student</span></h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mine.map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={student?.id === c.id} onClick={() => choose("student", c.id)} className={pickCls} style={pick(student?.id === c.id)}>
                      {c.label}
                    </button>
                  ))}
                  {shared.map((c) => (
                    <button
                      key={c.id} type="button" role="radio" aria-checked={student?.id === c.id} onClick={() => choose("student", c.id)} className={pickCls} style={pick(student?.id === c.id)}
                      aria-label={zh ? `${c.label} 呈` : `${c.label}, shared with you`}
                    >
                      <span className="font-han mr-2" style={{ color: "var(--gilt)" }}>呈</span>{c.label}
                    </button>
                  ))}
                </div>
                {sharing ? <TakeCode zh={zh} onTaken={(id) => choose("student", id)} known={shared.map((c) => c.id)} /> : null}
              </div>
              {student && mine.filter((c) => c.id !== student.id).length > 0 ? (
                <div role="radiogroup" aria-label={zh ? "老師" : "The teacher"}>
                  <h2 className="font-han text-[19px] font-bold text-[var(--tx)]">師<span data-en className="font-gloss ml-3 text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">The teacher</span></h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" role="radio" aria-checked={!teacher} onClick={() => choose("teacher", null)} className={pickCls} style={pick(!teacher)}>
                      <span className="font-han">無</span><span data-en className="ml-2">No chart</span>
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
              <Sitting
                key={student.id} who={user?.id != null ? String(user.id) : null} student={student} teacher={teacher} zh={zh}
                shareId={from?.shareId ?? null} read={from?.read ?? null} onGone={() => choose("student", null)}
              />
            ) : null}
          </>
        )}
      </section>
      <Rule dark className="mb-16" />
    </Shell>
  );
}

/**
 * 受符 Take up a student's code. The student made it at their Desk and handed
 * it over; entering it here puts their chart on this table until either of
 * the two ends it.
 */
function TakeCode({ zh, onTaken, known }: { zh: boolean; onTaken: (chartId: number) => void; known: number[] }) {
  const [code, setCode] = useState("");
  const shares = api.shares.useQuery();
  const take = api.takeShare.useMutation({
    onSuccess: () => {
      setCode("");
      void shares.refetch().then((r) => {
        const fresh = (r.data?.held ?? []).find((h) => !known.includes(h.chart.id));
        if (fresh) onTaken(fresh.chart.id);
      });
    },
  });
  return (
    <form
      className="mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) take.mutate({ code });
      }}
    >
      <label className="block">
        <span className="font-han text-[16px] font-bold text-[var(--tx)]">受符</span>
        <span data-en className="font-gloss ml-3 text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">A student's code</span>
        <span className="mt-3 flex flex-wrap items-center gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={24}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-label={zh ? "學生之符" : "A student's code"}
            placeholder="ABCDE FGHJK"
            className="font-mono block h-[48px] w-[15rem] min-w-0 max-w-full rounded-none border bg-transparent px-3 text-[17px] uppercase tracking-[0.12em] text-[var(--tx)] placeholder:text-[rgba(var(--txr),.45)]"
            style={{ borderColor: "rgba(var(--txr),.3)" }}
          />
          <button type="submit" disabled={take.isPending || !code.trim()} className="font-gloss min-h-[48px] border px-4 text-[14px] text-[var(--tx)] transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.16)] disabled:opacity-50" style={{ borderColor: line }}>
            <span className="font-han mr-2">受</span><span data-en>Take it up</span><span data-zh>受之</span>
          </button>
        </span>
      </label>
      {take.error ? <p className="font-gloss mt-3 text-[13.5px]" style={{ color: "var(--warn)" }} role="alert">{take.error.message}</p> : null}
    </form>
  );
}

function Sitting({ who, student, teacher, zh, shareId, read, onGone }: {
  who: string | null; student: Kept; teacher: Kept | null; zh: boolean;
  /** Set when the student shared this chart by a code. */
  shareId: number | null;
  /** The scrolls the student has marked as read, when they share them. */
  read: string[] | null;
  onGone: () => void;
}) {
  const letGo = api.endShare.useMutation({ onSuccess: onGone });
  const hasRead = new Set(read ?? []);
  const pillars = pillarsOf(student);
  const times = useTimes(student.luck ?? null);
  const record = useTeacherRecord(who, student.id);
  const taught = new Set(record.taught);

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
          <span className="font-han text-[24px] font-bold text-[var(--tx)]">課</span>
          <h2 data-en className="font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">What has been taught</h2>
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
                  className="font-han flex h-[44px] w-[44px] shrink-0 items-center justify-center border text-[18px] font-bold transition-colors duration-200"
                  style={{ borderColor: on ? "var(--gilt)" : line, color: on ? "var(--gilt)" : "transparent", background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
                >
                  授
                </button>
                <span className="min-w-0 flex-1">
                  <span className="font-han text-[17px] font-bold text-[var(--tx)]">{l.hanzi}</span>
                  <span data-en className="font-gloss ml-3 text-[14px]" style={{ color: sub }}>{l.english}</span>
                  {hasRead.has(l.id) ? (
                    <span className="ml-3 whitespace-nowrap" data-student-read>
                      <span className="font-han text-[14px] font-bold" style={{ color: "var(--gilt)" }}>已讀</span>
                      <span data-en className="font-gloss ml-2 text-[12.5px]" style={{ color: sub }}>read by the student</span>
                    </span>
                  ) : null}
                </span>
                <Link
                  to={`/scroll/${l.id}`}
                  className="font-gloss inline-flex min-h-[44px] items-center px-3 text-[12.5px] uppercase tracking-[0.16em] underline-offset-4 hover:underline"
                  style={{ color: "var(--tx)" }}
                  aria-label={zh ? `開卷 ${l.hanzi}` : `Open the scroll ${l.english}`}
                >
                  <span className="font-han">開卷</span><span data-en className="ml-2">Open</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-2xl">
        <div className="flex items-baseline gap-4">
          <span className="font-han text-[24px] font-bold text-[var(--tx)]">記</span>
          <h2 data-en className="font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">The teacher's notes</h2>
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
        <p data-en className="font-gloss mt-3 text-[12.5px] italic leading-relaxed" style={{ color: sub }}>
          Kept on this device with the chart, and burned with it.
        </p>
      </section>

      {shareId !== null ? (
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <button
            type="button"
            disabled={letGo.isPending}
            onClick={() => letGo.mutate({ id: shareId, chartId: student.id })}
            className="font-gloss min-h-[44px] px-4 text-[12.5px] uppercase tracking-[0.16em] transition-opacity duration-200 hover:opacity-75"
            style={{ color: "var(--warn)" }}
            aria-label={zh ? `還 ${student.label}` : `Let the chart ${student.label} go from the table`}
          >
            <span data-en>Let this chart go</span> <span className="font-han">還</span>
          </button>
          {letGo.error ? <p className="font-gloss mt-2 text-[13.5px]" style={{ color: "var(--warn)" }} role="alert">{letGo.error.message}</p> : null}
        </div>
      ) : null}

      <div className="mt-14 flex justify-center">
        <GhostButton to="/desk" dark><span className="font-han">案</span><span data-en>Return to the Desk</span></GhostButton>
      </div>
    </>
  );
}

const tieText = (t: Tie, zh: boolean) =>
  zh ? (t.phase ? PHASES[t.phase].hanzi : "") : `${TIE_NAMES[t.kind].english}${t.phase ? `, ${PHASES[t.phase].english}` : ""}`;

/** 師生合參: the teacher's four pillars beside the student's, and every meeting that takes a sign from each. */
function Between({ teacher, student, zh }: { teacher: Kept; student: Kept; zh: boolean }) {
  const tp = pillarsOf(teacher);
  const sp = pillarsOf(student);
  const signs = crossSigns(tp, sp);
  const all = [...signs.teacher, ...signs.student];
  const ties = crossTies(tp, sp);
  const name = (key: string) => all.find((s) => s.key === key);
  const tDay = STEMS[teacher.dayStem];
  const sDay = STEMS[student.dayStem];
  // Read from both sides: what the student's Day Master is to the teacher's, and the other way.
  const gods = [
    { key: "t", from: zh ? "師" : "The teacher's", own: tDay, to: zh ? "生" : "the student's", other: sDay, god: tenGodOf(tDay, sDay) },
    { key: "s", from: zh ? "生" : "The student's", own: sDay, to: zh ? "師" : "the teacher's", other: tDay, god: tenGodOf(sDay, tDay) },
  ];

  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <div className="flex items-baseline gap-4">
        <span className="font-han text-[24px] font-bold text-[var(--tx)]">師生</span>
        <h2 data-en className="font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">Where the two charts meet</h2>
      </div>
      <div className="mt-6 grid gap-8">
        <PillarChart pillars={tp} dark interactive={false} caption={zh ? `師 ${teacher.label}` : `The teacher: ${teacher.label}`} />
        <PillarChart pillars={sp} dark interactive={false} caption={zh ? `生 ${student.label}` : `The student: ${student.label}`} />
      </div>
      <div className="mt-8">
        <h3 className="font-han text-[17px] font-bold text-[var(--tx)]">日主十神<span data-en className="font-gloss ml-3 text-[12.5px] uppercase tracking-[0.2em] text-[var(--gilt)]">Each Day Master to the other</span></h3>
        <ul className="mt-3 grid gap-1" aria-label={zh ? "日主十神" : "The ten god each Day Master is to the other"}>
          {gods.map((g) => (
            <li key={g.key} className="flex min-h-[44px] flex-wrap items-baseline gap-x-2 gap-y-1 border-b px-2 py-2" style={{ borderColor: line }} data-day-god={g.god.key}>
              <span className={zh ? "font-han text-[14px]" : "font-gloss text-[14px]"} style={{ color: sub }}>{g.from}</span>
              <span className="font-han text-[17px] font-bold text-[var(--tx)]">{g.own.hanzi}</span>
              <span className={zh ? "font-han text-[14px]" : "font-gloss text-[14px]"} style={{ color: sub }}>{zh ? `視${g.to}` : `reads ${g.to}`}</span>
              <span className="font-han text-[17px] font-bold text-[var(--tx)]">{g.other.hanzi}</span>
              <span className={zh ? "font-han text-[14px]" : "font-gloss text-[14px]"} style={{ color: sub }}>{zh ? "為" : "as"}</span>
              <span className="font-han text-[17px] font-bold" style={{ color: "var(--gilt)" }}>{g.god.hanzi}</span>
              <span data-en className="font-gloss text-[14px] text-[var(--tx)]">{g.god.english}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/scroll/shishen"
          className="font-gloss mt-1 inline-flex min-h-[44px] items-center text-[12.5px] uppercase tracking-[0.16em] underline-offset-4 hover:underline"
          style={{ color: "var(--tx)" }}
        >
          <span className="font-han">十神</span><span data-en className="ml-2">The Ten Gods scroll</span>
        </Link>
      </div>
      {ties.length === 0 ? (
        <p className={zh ? "font-han mt-6 text-[14px]" : "font-gloss mt-6 text-[14px] italic"} style={{ color: sub }}>
          {zh ? "無合沖刑害" : "No sign of one chart meets a sign of the other."}
        </p>
      ) : (
        <ul className="mt-6 grid gap-1" aria-label={zh ? "師生合沖刑害" : "The meetings between the two charts"}>
          {ties.map((t, i) => (
            <li key={i} className="flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-1 border-b px-2 py-2" style={{ borderColor: line }}>
              <span className="font-han text-[17px] font-bold" style={{ color: "var(--gilt)" }}>{TIE_NAMES[t.kind].hanzi}</span>
              <span className={zh ? "font-han text-[14px]" : "font-gloss text-[13.5px]"} style={{ color: "var(--tx)" }}>{tieText(t, zh)}</span>
              <span className="ml-auto flex flex-wrap items-baseline gap-x-3">
                {t.members.map((m, k) => {
                  const s = name(m.sign);
                  return (
                    <span key={k} className="whitespace-nowrap">
                      <span className="font-han text-[17px] font-bold" style={{ color: "var(--tx)" }}>{m.char}</span>
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
