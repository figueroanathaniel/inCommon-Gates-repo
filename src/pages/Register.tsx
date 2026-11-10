import { LESSONS } from "@contracts/bazi";
import { Shell, Seal } from "@/components/academy/chrome";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";

/** 冊 The Register: the reader's name and marks, kept by the house. */
export default function Register() {
  const { user, isAuthenticated, isSignedIn } = useAuth();
  const progress = api.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });

  const done = new Set((progress.data ?? []).map((p) => p.lessonId));
  const readCount = done.size;

  return (
    <Shell>
      <section className="py-14 min-[820px]:py-20">
        <div className="flex items-center gap-4">
          <Seal char="冊" size={44} />
          <div>
            <h1 className="font-han text-[32px] font-bold tracking-[0.15em] text-[var(--tx)]">冊 · 學籍</h1>
            <p className="font-gloss text-[13px] uppercase tracking-[0.26em] text-[var(--gilt)]">The Register</p>
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <p className="font-gloss text-[16px] leading-relaxed text-[rgba(var(--txr),.8)]">
            {isSignedIn ? (
              <>The house holds the name <span className="font-semibold text-[var(--tx)]">{user?.name}</span>, from your inCommon account.</>
            ) : (
              <>A guest's marks are kept in this browser alone. Sign in to inCommon, and they are kept on your account.</>
            )}
            {readCount === 0
              ? " No scroll has yet been read through. The Prologue waits at the head of the hall."
              : readCount === LESSONS.length
                ? " Every scroll is read through. What the house kept is now yours to carry."
                : ` Of the nine scrolls, ${readCount} ${readCount === 1 ? "is" : "are"} read through. The rest wait in their order.`}
          </p>
          {(charts.data?.length ?? 0) > 0 ? (
            <p className="font-gloss mt-3 text-[14.5px] text-[rgba(var(--txr),.66)]">
              The Desk keeps {charts.data!.length} {charts.data!.length === 1 ? "chart" : "charts"} in your name.
            </p>
          ) : null}
        </div>

        <ol className="mt-12 max-w-2xl">
          {LESSONS.map((l, i) => {
            const read = done.has(l.id);
            return (
              <li
                key={l.id}
                className="flex min-h-[44px] items-center gap-4 border-t py-4"
                style={{ borderColor: "rgba(var(--ac2r),.25)" }}
              >
                <span className="font-gloss w-7 text-[12px] tracking-[0.2em] text-[rgba(var(--txr),.66)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-han w-12 text-[22px] font-bold text-[var(--tx)]">{l.hanzi}</span>
                <span className="font-gloss flex-1 text-[14px] uppercase tracking-[0.18em] text-[rgba(var(--txr),.65)]">{l.english}</span>
                <span className="font-gloss text-[12px] uppercase tracking-[0.16em]" style={{ color: read ? "var(--ok)" : "rgba(var(--txr),.66)" }}>
                  {read ? "讀訖" : "未讀"}
                </span>
              </li>
            );
          })}
        </ol>

      </section>
    </Shell>
  );
}
