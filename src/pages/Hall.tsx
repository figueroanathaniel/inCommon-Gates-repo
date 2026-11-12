import { Link } from "react-router";
import { LESSONS } from "@contracts/bazi";
import { Shell, Seal, Rule } from "@/components/academy/chrome";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";
import { numZh, useT, useZh } from "@/lib/lang";

/** 廳 The Hall: the scrolls in their order, with each reader's marks. */
export default function Hall() {
  const { isAuthenticated } = useAuth();
  const progress = api.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const done = new Set((progress.data ?? []).map((p) => p.lessonId));
  const stone = api.stone.useQuery();
  const zh = useZh();
  const t = useT();

  return (
    <Shell>
      <section className="py-16 min-[820px]:py-24">
        <div className="flex items-center gap-4">
          <Seal char="廳" size={44} />
          <div>
            {zh ? (
              <h1 className="font-han text-[34px] font-bold tracking-[0.15em] text-[var(--tx)]">講堂</h1>
            ) : (
              <h1 className="font-gloss text-[30px] font-semibold tracking-[0.06em] text-[var(--tx)]">The Hall of Scrolls</h1>
            )}
          </div>
        </div>
        <p className={(zh ? "font-han" : "font-gloss") + " mt-8 max-w-2xl text-[16px] leading-relaxed text-[rgba(var(--txr),.75)]"}>
          {t(
            "Nine scrolls hang in this hall, unrolled in the order the art unfolds in. Each is written in the characters of the one before it. A scroll you have read through carries the sage mark, and the register keeps your place among them.",
            "此堂懸卷九軸，依此術開展之序展開。每卷皆以前卷之字寫成。讀訖之卷留有記號，學籍記下你在其間之位。",
          )}
        </p>
        {stone.data ? (
          <p className={(zh ? "font-han" : "font-gloss") + " mt-4 max-w-2xl text-[15px] leading-relaxed text-[rgba(var(--txr),.66)]"}>
            {t("Your Nature stands inscribed, and the last scroll reads it whole.", "本命已銘，末卷通讀之。")}
          </p>
        ) : null}
      </section>

      <ol className="pb-24">
        {LESSONS.map((l, i) => {
          const read = done.has(l.id);
          return (
            <li key={l.id}>
              <Link
                to={`/scroll/${l.id}`}
                className="group flex min-h-[44px] items-center gap-5 border-t py-6 transition-colors duration-200 hover:bg-[rgba(var(--ac2r),.06)] min-[820px]:gap-8 min-[820px]:py-8"
                style={{ borderColor: "rgba(var(--ac2r),.28)" }}
                aria-label={zh ? `第${numZh(i + 1)}卷：${l.hanzi}。${l.titleZh}${read ? "，讀訖" : ""}` : `Scroll ${i + 1}: ${l.english}. ${l.title}${read ? ", read through" : ""}`}
              >
                <span className="font-gloss w-8 shrink-0 text-[13px] tracking-[0.2em] text-[rgba(var(--txr),.66)]">
                  {zh ? numZh(i + 1) : String(i + 1).padStart(2, "0")}
                </span>
                {zh ? (
                  <span className="font-han w-20 shrink-0 text-[30px] font-bold leading-none text-[var(--tx)] transition-colors duration-200 group-hover:text-gilt min-[820px]:text-[38px]">
                    {l.hanzi}
                  </span>
                ) : null}
                <span className="flex min-w-0 flex-1 flex-col">
                  {zh ? null : <span className="font-gloss text-[17px] font-semibold tracking-[0.04em] text-[var(--tx)] transition-colors duration-200 group-hover:text-gilt">{l.english}</span>}
                  <span className={(zh ? "font-han" : "font-gloss italic") + " mt-1 text-[15px] leading-snug text-[rgba(var(--txr),.65)]"}>
                    {zh ? l.titleZh : l.title}
                  </span>
                </span>
                <span
                  className={(zh ? "font-han" : "font-gloss uppercase") + " shrink-0 text-[12px] tracking-[0.18em]"}
                  style={{ color: read ? "var(--ok)" : "rgba(var(--txr),.66)" }}
                >
                  {read ? t("Read", "讀訖") : t("Unread", "未讀")}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <Rule className="mb-20" />
    </Shell>
  );
}
