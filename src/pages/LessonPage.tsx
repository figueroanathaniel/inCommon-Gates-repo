import { Link, useParams } from "react-router";
import { LESSONS, type FourPillars } from "@contracts/bazi";
import { Shell, Seal, Rule, JadeButton, GhostButton } from "@/components/academy/chrome";
import { StemsTable, BranchesTable, PhasesDiagram, GodsTable, JiaziCycle } from "@/components/academy/tables";
import { PillarChart } from "@/components/academy/pillars";
import { MirrorReading } from "@/components/academy/mirror";
import { LESSON_BODY } from "@/content/lessons";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";

function stoneToPillars(s: {
  yearStem: number; yearBranch: number; monthStem: number; monthBranch: number;
  dayStem: number; dayBranch: number; hourStem: number; hourBranch: number;
}): FourPillars {
  return {
    yearStem: s.yearStem, yearBranch: s.yearBranch, monthStem: s.monthStem, monthBranch: s.monthBranch,
    dayStem: s.dayStem, dayBranch: s.dayBranch, hourStem: s.hourStem, hourBranch: s.hourBranch,
  };
}

function TableFor({ kind }: { kind: NonNullable<(typeof LESSON_BODY)[string]["table"]> }) {
  switch (kind) {
    case "stems": return <StemsTable dark={false} />;
    case "branches": return <BranchesTable dark={false} />;
    case "phases": return <PhasesDiagram dark={false} />;
    case "gods": return <GodsTable dark={false} />;
    case "jiazi": return <JiaziCycle dark={false} />;
  }
}

/** The Mirror's whole reading is kept in components/academy/mirror.tsx. */

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const meta = LESSONS.find((l) => l.id === lessonId);
  const body = lessonId ? LESSON_BODY[lessonId] : undefined;
  const { isAuthenticated } = useAuth();
  const progress = api.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const stone = api.stone.useQuery();
  const mark = api.markRead.useMutation();
  const unmark = api.unmarkRead.useMutation();

  if (!meta || !body) {
    return (
      <Shell paper>
        <section className="py-24 text-center">
          <p className="font-han text-[24px] font-bold">無此卷</p>
          <p className="font-gloss mt-3 text-[15px] italic" style={{ color: "rgba(var(--txr),.65)" }}>
            No such scroll hangs in the hall.
          </p>
          <div className="mt-8 flex justify-center"><GhostButton to="/hall" dark>Return to the Hall</GhostButton></div>
        </section>
      </Shell>
    );
  }

  const read = (progress.data ?? []).some((p) => p.lessonId === meta.id);
  const idx = LESSONS.findIndex((l) => l.id === meta.id);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;
  const inscribed = stone.data ? stoneToPillars(stone.data) : null;
  const isMirror = meta.id === "jian";
  const showStoneChart = inscribed && (meta.id === "sizhu" || meta.id === "shishen" || meta.id === "dayun");

  return (
    <Shell paper>
      <article className="py-14 min-[820px]:py-20">
        {/* The scroll's head */}
        <header className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <span className="font-gloss text-[12px] uppercase tracking-[0.26em]" style={{ color: "rgba(var(--txr),.66)" }}>
              Scroll {String(meta.order + 1).padStart(2, "0")} of {String(LESSONS.length).padStart(2, "0")}
            </span>
            <Seal char={meta.hanzi.charAt(0)} size={40} dark />
          </div>
          <h1 className="font-han mt-8 text-[44px] font-black leading-tight tracking-[0.1em] text-[var(--tx)] min-[820px]:text-[56px]">
            {meta.hanzi}
          </h1>
          <p className="font-gloss mt-2 text-[15px] uppercase tracking-[0.28em] text-[var(--gilt)]">{meta.english}</p>
          <p className="font-gloss mt-3 text-[16px] italic" style={{ color: "rgba(var(--txr),.65)" }}>{meta.title}</p>
          <blockquote className="mt-10 border-l-2 pl-6" style={{ borderColor: "var(--gilt)" }}>
            <p className="font-han text-[19px] font-semibold leading-relaxed text-[var(--tx)]">{body.epigraph}</p>
            <cite className="font-gloss mt-3 block text-[13.5px] not-italic leading-relaxed" style={{ color: "rgba(var(--txr),.66)" }}>
              {body.epigraphSource}
            </cite>
          </blockquote>
        </header>

        {/* The scroll's body */}
        <div className="mx-auto mt-12 max-w-2xl">
          {body.paragraphs.map((p, i) => (
            <p key={i} className="font-gloss mt-6 text-[17px] leading-[1.9] text-[rgba(var(--txr),.9)]">{p}</p>
          ))}
        </div>

        {body.table ? (
          <div className="mx-auto mt-14 max-w-3xl">
            <Rule dark className="mb-10" />
            <TableFor kind={body.table} />
          </div>
        ) : null}

        {/* Your Nature enters the scroll */}
        {isMirror ? (
          inscribed ? (
            <MirrorReading pillars={inscribed} label={stone.data!.label} />
          ) : (
            <div className="mx-auto mt-14 max-w-2xl border px-8 py-12 text-center" style={{ borderColor: "rgba(var(--txr),.25)", background: "rgba(var(--sfr),.84)" }}>
              <p className="font-han text-[26px] font-bold text-[var(--tx)]">命盤未排</p>
              <p className="font-gloss mt-4 text-[15.5px] leading-relaxed" style={{ color: "rgba(var(--txr),.7)" }}>
                The Destiny Chart is not yet laid out, and the house does not read a chart it does not hold.
                When it is laid out, this scroll will read it whole, aloud, in the order of the scrolls you have unrolled.
              </p>
            </div>
          )
        ) : (
          <div className="mx-auto mt-14 max-w-2xl border-t pt-10" style={{ borderColor: "rgba(var(--ac2r),.45)" }}>
            <div className="flex items-baseline gap-4">
              <span className="font-han text-[22px] font-bold text-[var(--tx)]">鑑</span>
              <h2 className="font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]">The turn of the Destiny Chart</h2>
            </div>
            <p className="font-gloss mt-5 text-[16px] leading-[1.85] text-[rgba(var(--txr),.85)]">{body.stoneTurn}</p>
            {showStoneChart ? (
              <div className="mt-8">
                <PillarChart pillars={inscribed} dark caption={`Your Nature: ${stone.data!.label}`} />
              </div>
            ) : inscribed ? (
              <p className="font-gloss mt-5 text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
                Stand before the Destiny Chart itself in its own room when you wish to look longer.
              </p>
            ) : (
              <p className="font-gloss mt-5 text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
                The Destiny Chart is not yet laid out. What this scroll promises, it will keep on the day it is laid out.
              </p>
            )}
          </div>
        )}

        {/* The mark and the doors */}
        <div className="mx-auto mt-16 max-w-2xl">
          <Rule dark />
          <div className="mt-10 flex flex-col items-center gap-4">
            {isAuthenticated ? (
              read ? (
                <>
                  <p className="font-han text-[15px] tracking-[0.2em]" style={{ color: "var(--ok)" }}>讀訖 · this scroll is read through</p>
                  <GhostButton dark onClick={() => unmark.mutate({ lessonId: meta.id })}>Lift the mark</GhostButton>
                </>
              ) : (
                <JadeButton onClick={() => mark.mutate({ lessonId: meta.id })} disabled={mark.isPending}>
                  Mark this scroll as read 讀訖
                </JadeButton>
              )
            ) : (
              <p className="font-gloss text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
                <Link to="/login" className="underline underline-offset-4 hover:text-gilt">Sign in</Link>, and the house will keep your marks as it keeps every reader's.
              </p>
            )}
          </div>
          <nav className="mt-12 flex items-stretch justify-between gap-4" aria-label="Neighbouring scrolls">
            {prev ? (
              <Link to={`/scroll/${prev.id}`} className="flex min-h-[44px] flex-1 flex-col border px-4 py-3 transition-colors duration-200 hover:border-gilt" style={{ borderColor: "rgba(var(--txr),.25)" }}>
                <span className="font-gloss text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--txr),.66)" }}>The scroll before</span>
                <span className="font-han mt-1 text-[18px] font-semibold text-[var(--tx)]">{prev.hanzi} <span className="font-gloss text-[13px] font-normal" style={{ color: "rgba(var(--txr),.66)" }}>{prev.english}</span></span>
              </Link>
            ) : <span className="flex-1" />}
            {next ? (
              <Link to={`/scroll/${next.id}`} className="flex min-h-[44px] flex-1 flex-col items-end border px-4 py-3 text-right transition-colors duration-200 hover:border-gilt" style={{ borderColor: "rgba(var(--txr),.25)" }}>
                <span className="font-gloss text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--txr),.66)" }}>The scroll after</span>
                <span className="font-han mt-1 text-[18px] font-semibold text-[var(--tx)]">{next.hanzi} <span className="font-gloss text-[13px] font-normal" style={{ color: "rgba(var(--txr),.66)" }}>{next.english}</span></span>
              </Link>
            ) : <span className="flex-1" />}
          </nav>
        </div>
      </article>
    </Shell>
  );
}
