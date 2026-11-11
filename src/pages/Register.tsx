import { LESSONS } from "@contracts/bazi";
import { Shell, Seal } from "@/components/academy/chrome";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { numZh, useT, useZh } from "@/lib/lang";

/** 冊 The Register: the reader's name and marks, kept by the house. */
export default function Register() {
  const { user, isAuthenticated, isSignedIn } = useAuth();
  const progress = api.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });

  const done = new Set((progress.data ?? []).map((p) => p.lessonId));
  const readCount = done.size;
  const zh = useZh();
  const t = useT();
  const nCharts = charts.data?.length ?? 0;

  return (
    <Shell>
      <section className="py-14 min-[820px]:py-20">
        <div className="flex items-center gap-4">
          <Seal char="冊" size={44} />
          <div>
            {zh ? (
              <h1 className="font-han text-[32px] font-bold tracking-[0.15em] text-[var(--tx)]">冊 · 學籍</h1>
            ) : (
              <h1 className="font-gloss text-[30px] font-semibold tracking-[0.06em] text-[var(--tx)]">The Register</h1>
            )}
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <p className={(zh ? "font-han" : "font-gloss") + " text-[16px] leading-relaxed text-[rgba(var(--txr),.8)]"}>
            {isSignedIn ? (
              zh ? (
                <>書院記下 <span className="font-semibold text-[var(--tx)]">{user?.name}</span> 之名，出自你的 inCommon 帳戶。</>
              ) : (
                <>The house holds the name <span className="font-semibold text-[var(--tx)]">{user?.name}</span>, from your inCommon account.</>
              )
            ) : (
              t(
                "A guest's marks are kept in this browser alone. Sign in to inCommon, and they are kept on your account.",
                "訪客之記只存於此瀏覽器。登入 inCommon，便存於你的帳戶。",
              )
            )}
            {readCount === 0
              ? t(" No scroll has yet been read through. The Prologue waits at the head of the hall.", "尚無一卷讀訖。緣起之卷候於堂首。")
              : readCount === LESSONS.length
                ? t(" Every scroll is read through. What the house kept is now yours to carry.", "諸卷皆已讀訖。書院所藏，今由你攜帶。")
                : zh
                  ? `九卷之中，已讀訖${numZh(readCount)}卷。其餘依序以待。`
                  : ` Of the nine scrolls, ${readCount} ${readCount === 1 ? "is" : "are"} read through. The rest wait in their order.`}
          </p>
          {nCharts > 0 ? (
            <p className={(zh ? "font-han" : "font-gloss") + " mt-3 text-[14.5px] text-[rgba(var(--txr),.66)]"}>
              {zh ? `書桌以你之名存命盤${numZh(nCharts)}張。` : `The Desk keeps ${nCharts} ${nCharts === 1 ? "chart" : "charts"} in your name.`}
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
                <span className={(zh ? "font-han" : "font-gloss") + " w-7 text-[12px] tracking-[0.2em] text-[rgba(var(--txr),.66)]"}>{zh ? numZh(i + 1) : String(i + 1).padStart(2, "0")}</span>
                {zh ? (
                  <span className="font-han flex-1 text-[22px] font-bold text-[var(--tx)]">{l.hanzi}</span>
                ) : (
                  <span className="font-gloss flex-1 text-[15px] font-semibold text-[var(--tx)]">{l.english}</span>
                )}
                <span className={(zh ? "font-han" : "font-gloss uppercase") + " text-[12px] tracking-[0.16em]"} style={{ color: read ? "var(--ok)" : "rgba(var(--txr),.66)" }}>
                  {read ? t("Read", "讀訖") : t("Unread", "未讀")}
                </span>
              </li>
            );
          })}
        </ol>

      </section>
    </Shell>
  );
}
