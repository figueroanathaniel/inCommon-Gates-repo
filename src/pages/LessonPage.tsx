import { Link, useParams } from "react-router";
import { LESSONS, type FourPillars } from "@contracts/bazi";
import { Shell, Seal, Rule, JadeButton, GhostButton } from "@/components/academy/chrome";
import { StemsTable, BranchesTable, PhasesDiagram, GodsTable, JiaziCycle } from "@/components/academy/tables";
import { PillarChart } from "@/components/academy/pillars";
import { MirrorReading } from "@/components/academy/mirror";
import { LESSON_BODY } from "@/content/lessons";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { useT, useZh } from "@/lib/lang";

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
  const zh = useZh();
  const t = useT();

  if (!meta || !body) {
    return (
      <Shell paper>
        <section className="py-24 text-center">
          <p className={zh ? "font-han text-[24px] font-bold" : "font-gloss text-[24px] font-bold"}>{t("No such scroll", "無此卷")}</p>
          <p className="font-gloss mt-3 text-[15px] italic" style={{ color: "rgba(var(--txr),.65)" }}>
            {t("No such scroll hangs in the hall.", "廳中未懸此卷。")}
          </p>
          <div className="mt-8 flex justify-center"><GhostButton to="/hall" dark>{t("Return to the Hall", "回廳")}</GhostButton></div>
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
          <div className="flex items-center justify-end">
            <Seal char={meta.hanzi.charAt(0)} size={40} dark />
          </div>
          {zh ? (
            <h1 className="font-han mt-8 text-[44px] font-black leading-tight tracking-[0.1em] text-[var(--tx)] min-[820px]:text-[56px]">
              {meta.hanzi}
            </h1>
          ) : (
            <h1 className="font-gloss mt-8 text-[38px] font-semibold leading-tight tracking-[0.04em] text-[var(--tx)] min-[820px]:text-[48px]">
              {meta.english}
            </h1>
          )}
          <p className={(zh ? "font-han" : "font-gloss") + " mt-3 text-[16px] italic"} style={{ color: "rgba(var(--txr),.65)" }}>{zh ? meta.titleZh : meta.title}</p>
          <blockquote className="mt-10 border-l-2 pl-6" style={{ borderColor: "var(--gilt)" }}>
            <p className={(zh ? "font-han text-[19px]" : "font-gloss text-[18px] italic") + " font-semibold leading-relaxed text-[var(--tx)]"}>{zh ? body.epigraphZh : body.epigraphEn}</p>
            <cite className={(zh ? "font-han" : "font-gloss") + " mt-3 block text-[13.5px] not-italic leading-relaxed"} style={{ color: "rgba(var(--txr),.66)" }}>
              {zh ? body.sourceZh : body.sourceEn}
            </cite>
          </blockquote>
        </header>

        {/* The scroll's body */}
        <div className="mx-auto mt-12 max-w-2xl">
          {(zh ? body.paragraphsZh : body.paragraphs).map((p, i) => (
            <p key={i} className={(zh ? "font-han" : "font-gloss") + " mt-6 text-[17px] leading-[1.9] text-[rgba(var(--txr),.9)]"}>{p}</p>
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
            <MirrorReading pillars={inscribed} label={zh ? stone.data!.labelZh : stone.data!.label} />
          ) : (
            <div className="mx-auto mt-14 max-w-2xl border px-8 py-12 text-center" style={{ borderColor: "rgba(var(--txr),.25)", background: "rgba(var(--sfr),.84)" }}>
              <p className={(zh ? "font-han" : "font-gloss") + " text-[26px] font-bold text-[var(--tx)]"}>{t("The Destiny Chart is not yet laid out", "命盤未排")}</p>
              <p className="font-gloss mt-4 text-[15.5px] leading-relaxed" style={{ color: "rgba(var(--txr),.7)" }}>
                {t(
                  "Once the chart is laid out, this scroll reads it whole, aloud, in the order of the scrolls you have unrolled.",
                  "命盤排定之日，此卷便依你所展諸卷之序，通篇讀之。",
                )}
              </p>
            </div>
          )
        ) : (
          <div className="mx-auto mt-14 max-w-2xl border-t pt-10" style={{ borderColor: "rgba(var(--ac2r),.45)" }}>
            <div className="flex items-baseline gap-4">
              {zh ? <span className="font-han text-[22px] font-bold text-[var(--tx)]">鑑</span> : null}
              <h2 className={zh ? "font-han text-[16px] tracking-[0.2em] text-[var(--gilt)]" : "font-gloss text-[13px] uppercase tracking-[0.22em] text-[var(--gilt)]"}>{t("The turn of the Destiny Chart", "命盤之輪")}</h2>
            </div>
            <p className={(zh ? "font-han" : "font-gloss") + " mt-5 text-[16px] leading-[1.85] text-[rgba(var(--txr),.85)]"}>{zh ? body.stoneTurnZh : body.stoneTurn}</p>
            {showStoneChart ? (
              <div className="mt-8">
                <PillarChart pillars={inscribed} dark caption={t(`Your Nature · ${stone.data!.label}`, `本命：${stone.data!.labelZh}`)} />
              </div>
            ) : inscribed ? (
              <p className="font-gloss mt-5 text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
                {t("The Destiny Chart has a room of its own, for when you want to look longer.", "若欲久觀，請往命盤本室。")}
              </p>
            ) : (
              <p className="font-gloss mt-5 text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>
                {t("The Destiny Chart is not laid out yet. This scroll keeps its promise on the day it is.", "命盤未排。此卷所許，待排定之日自當兌現。")}
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
                  <p className={(zh ? "font-han tracking-[0.2em]" : "font-gloss tracking-[0.08em]") + " text-[15px]"} style={{ color: "var(--ok)" }}>{t("This scroll is read through", "讀訖")}</p>
                  <GhostButton dark onClick={() => unmark.mutate({ lessonId: meta.id })}>{t("Lift the mark", "去其記")}</GhostButton>
                </>
              ) : (
                <JadeButton onClick={() => mark.mutate({ lessonId: meta.id })} disabled={mark.isPending}>
                  {t("Mark this scroll as read", "記為讀訖")}
                </JadeButton>
              )
            ) : (
              <p className="font-gloss text-[14.5px] italic" style={{ color: "rgba(var(--txr),.66)" }}>{t("The house is opening.", "書院正在開門。")}</p>
            )}
          </div>
          <nav className="mt-12 flex items-stretch justify-between gap-4" aria-label={t("Neighbouring scrolls", "相鄰之卷")}>
            {prev ? (
              <Link to={`/scroll/${prev.id}`} className="flex min-h-[44px] flex-1 flex-col border px-4 py-3 transition-colors duration-200 hover:border-gilt" style={{ borderColor: "rgba(var(--txr),.25)" }}>
                <span className={(zh ? "font-han" : "font-gloss uppercase") + " text-[11px] tracking-[0.2em]"} style={{ color: "rgba(var(--txr),.66)" }}>{t("The scroll before", "前卷")}</span>
                <span className={(zh ? "font-han" : "font-gloss") + " mt-1 text-[18px] font-semibold text-[var(--tx)]"}>{zh ? prev.hanzi : prev.english}</span>
              </Link>
            ) : <span className="flex-1" />}
            {next ? (
              <Link to={`/scroll/${next.id}`} className="flex min-h-[44px] flex-1 flex-col items-end border px-4 py-3 text-right transition-colors duration-200 hover:border-gilt" style={{ borderColor: "rgba(var(--txr),.25)" }}>
                <span className={(zh ? "font-han" : "font-gloss uppercase") + " text-[11px] tracking-[0.2em]"} style={{ color: "rgba(var(--txr),.66)" }}>{t("The scroll after", "後卷")}</span>
                <span className={(zh ? "font-han" : "font-gloss") + " mt-1 text-[18px] font-semibold text-[var(--tx)]"}>{zh ? next.hanzi : next.english}</span>
              </Link>
            ) : <span className="flex-1" />}
          </nav>
        </div>
      </article>
    </Shell>
  );
}
