import { Link } from "react-router";
import { LESSONS } from "@contracts/bazi";
import { Shell, Seal, Rule } from "@/components/academy/chrome";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/providers/data";

/** 廳 The Hall: the scrolls in their order, with each reader's marks. */
export default function Hall() {
  const { isAuthenticated } = useAuth();
  const progress = api.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const done = new Set((progress.data ?? []).map((p) => p.lessonId));
  const stone = api.stone.useQuery();

  return (
    <Shell>
      <section className="py-16 min-[820px]:py-24">
        <div className="flex items-center gap-4">
          <Seal char="廳" size={44} />
          <div>
            <h1 className="font-han text-[34px] font-bold tracking-[0.15em] text-[var(--tx)]">講堂</h1>
            <p className="font-gloss text-[13px] uppercase tracking-[0.26em] text-[var(--gilt)]">The Hall of Scrolls</p>
          </div>
        </div>
        <p className="font-gloss mt-8 max-w-2xl text-[16px] leading-relaxed text-[rgba(var(--txr),.75)]">
          Nine scrolls hang in this hall, and they are unrolled in one order, the order in which the art unfolds.
          None is withheld, and none can be stepped past, for each is written in the characters of the one before it.
          {" A scroll once read through carries the sage mark, and the register keeps your place among them."}
        </p>
        {stone.data ? (
          <p className="font-gloss mt-4 max-w-2xl text-[15px] leading-relaxed text-[rgba(var(--txr),.66)]">
            Your Nature stands inscribed, and the last scroll reads it whole.
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
                aria-label={`Scroll ${i + 1}: ${l.hanzi}, ${l.english}. ${l.title}${read ? ", read through" : ""}`}
              >
                <span className="font-gloss w-8 shrink-0 text-[13px] tracking-[0.2em] text-[rgba(var(--txr),.66)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-han w-14 shrink-0 text-[30px] font-bold leading-none text-[var(--tx)] transition-colors duration-200 group-hover:text-gilt min-[820px]:text-[38px]">
                  {l.hanzi}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-gloss text-[15px] uppercase tracking-[0.2em] text-[var(--gilt)]">{l.english}</span>
                  <span className="font-gloss mt-1 text-[15px] italic leading-snug text-[rgba(var(--txr),.65)]">
                    {l.title}
                  </span>
                </span>
                <span
                  className="font-gloss shrink-0 text-[12px] uppercase tracking-[0.18em]"
                  style={{ color: read ? "var(--ok)" : "rgba(var(--txr),.66)" }}
                >
                  {read ? "讀訖 read" : "未讀"}
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
