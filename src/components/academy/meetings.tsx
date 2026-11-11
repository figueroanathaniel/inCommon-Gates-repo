import { PHASES } from "@contracts/bazi";
import { TIE_NAMES, litKey, tiesAmong, type Sign, type Tie } from "@/lib/meet";
import { setChartPrefs, useChartPrefs } from "@/lib/prefs";
import { useZh } from "@/lib/lang";

const tieLabelZh = (t: Tie) => `${TIE_NAMES[t.kind].hanzi}${t.phase ? PHASES[t.phase].hanzi : ""}`;
const SHORT: Record<string, string> = { combine: "Combine", clash: "Clash", harm: "Harm", punish: "Punish", harmony: "Trio" };
const tieLabel = (t: Tie) => `${TIE_NAMES[t.kind].english}${t.phase ? `, ${PHASES[t.phase].english}` : ""}`;

/**
 * The Meetings (合沖刑害), every meeting among the signs on the table: the four of the birth
 * and whatever decade and year are laid beside them. A list or a grid, as the
 * reader keeps it. Pointing at a meeting lights its characters in the chart.
 */
export function Meetings({ signs, onLit }: { signs: Sign[]; onLit?: (keys: string[]) => void }) {
  const prefs = useChartPrefs();
  const zh = useZh();
  const label = zh ? tieLabelZh : tieLabel;
  const ties = tiesAmong(signs);
  const ink = "var(--tx)";
  const sub = "rgba(var(--txr),.7)";
  const line = "rgba(var(--txr),.2)";
  const name = (key: string) => signs.find((s) => s.key === key);
  const light = (t: Tie | null) => onLit?.(t ? t.members.map((m) => litKey(m.sign, t.layer)) : []);

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className={(zh ? "font-han" : "font-gloss") + " text-[17px] font-bold"} style={{ color: ink }}>{zh ? "合沖刑害" : "The Meetings"}</h4>
        <div role="radiogroup" aria-label={zh ? "列法" : "How the meetings are laid out"} className="flex gap-2">
          {(["list", "grid"] as const).map((v) => {
            const on = prefs.table === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setChartPrefs({ table: v })}
                className="font-gloss min-h-[44px] min-w-[64px] border px-3 text-[13px] transition-colors duration-200"
                style={{ borderColor: on ? "var(--gilt)" : line, color: ink, background: on ? "rgba(var(--ac2r),.16)" : "transparent" }}
              >
                {zh ? <span className="font-han">{v === "list" ? "列" : "表"}</span> : v === "list" ? "List" : "Grid"}
              </button>
            );
          })}
        </div>
      </div>

      {ties.length === 0 ? (
        <p className={zh ? "font-han mt-4 text-[14px]" : "font-gloss mt-4 text-[14px] italic"} style={{ color: sub }}>{zh ? "無合沖刑害" : "None among these signs."}</p>
      ) : prefs.table === "list" ? (
        <ul className="mt-4 grid gap-1">
          {ties.map((t, i) => (
            <li
              key={i}
              tabIndex={0}
              onMouseEnter={() => light(t)}
              onMouseLeave={() => light(null)}
              onFocus={() => light(t)}
              onBlur={() => light(null)}
              className="flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-1 border-b px-2 py-2 outline-none focus-visible:bg-[rgba(var(--ac2r),.12)]"
              style={{ borderColor: line }}
            >
              {zh ? (
                <>
                  <span className="font-han text-[17px] font-bold" style={{ color: "var(--gilt)" }}>{TIE_NAMES[t.kind].hanzi}</span>
                  {t.phase ? <span className="font-han text-[14px]" style={{ color: ink }}>{PHASES[t.phase].hanzi}</span> : null}
                </>
              ) : (
                <span className="font-gloss text-[14px] font-semibold" style={{ color: "var(--gilt)" }}>{tieLabel(t)}</span>
              )}
              <span className="ml-auto flex flex-wrap items-baseline gap-x-3">
                {t.members.map((m, k) => {
                  const s = name(m.sign);
                  return (
                    <span key={k} className="whitespace-nowrap">
                      <span className={(zh ? "font-han text-[17px]" : "font-gloss text-[15px]") + " font-bold"} style={{ color: ink }}>{zh ? m.char : m.en}</span>
                      <span className={(zh ? "font-han" : "font-gloss") + " ml-1 text-[12px]"} style={{ color: sub }}>{zh ? s?.hanzi : s?.english}</span>
                    </span>
                  );
                })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-center" aria-label={zh ? "合沖刑害表" : "The meetings, sign against sign"}>
            <thead>
              <tr>
                <td />
                {signs.map((s) => (
                  <th key={s.key} scope="col" className="px-1 pb-2 font-normal">
                    <span className={(zh ? "font-han text-[14px]" : "font-gloss text-[11.5px]") + " block"} style={{ color: "var(--gilt)" }}>{zh ? s.hanzi : s.english}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signs.map((r, ri) => (
                <tr key={r.key}>
                  <th scope="row" className="pr-2 text-right font-normal">
                    <span className={zh ? "font-han text-[14px]" : "font-gloss text-[11.5px]"} style={{ color: "var(--gilt)" }}>{zh ? r.hanzi : r.english}</span>
                  </th>
                  {signs.map((c, ci) => {
                    const here = ci > ri
                      ? ties.filter((t) => t.members.length === 2 && t.members[0].sign === r.key && t.members[1].sign === c.key)
                      : [];
                    const text = here.map((t) => (zh ? `${t.layer === "stem" ? "天干" : "地支"}${tieLabelZh(t)}` : `${t.layer === "stem" ? "stems" : "branches"} ${tieLabel(t)}`)).join(zh ? "，" : "; ");
                    return (
                      <td
                        key={c.key}
                        className="h-[52px] min-w-[52px] border align-middle"
                        style={{ borderColor: line, background: ci <= ri ? "rgba(var(--txr),.04)" : "transparent" }}
                        aria-label={ci > ri ? (zh ? `${r.hanzi}${c.hanzi} ${text || "無"}` : `${r.english} and ${c.english}: ${text || "none"}`) : undefined}
                        onMouseEnter={() => onLit?.(here.flatMap((t) => t.members.map((m) => litKey(m.sign, t.layer))))}
                        onMouseLeave={() => onLit?.([])}
                      >
                        {here.map((t, k) => (
                          <span key={k} className={(zh ? "font-han text-[15px] font-bold" : "font-gloss block text-[10.5px] font-semibold") + " mx-[2px] inline-block"} style={{ color: t.layer === "stem" ? ink : "var(--gilt)" }} title={label(t)}>
                            {zh ? TIE_NAMES[t.kind].hanzi : SHORT[t.kind]}
                          </span>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {zh ? (
            <p className="font-han mt-3 text-[12.5px]" style={{ color: sub }}>
              <span className="font-bold" style={{ color: ink }}>干</span> 天干{" "}
              <span className="ml-3 font-bold" style={{ color: "var(--gilt)" }}>支</span> 地支
            </p>
          ) : (
            <p className="font-gloss mt-3 text-[12.5px]" style={{ color: sub }}>
              <span className="font-semibold" style={{ color: ink }}>Ink</span> between stems{" "}
              <span className="ml-3 font-semibold" style={{ color: "var(--gilt)" }}>Gold</span> between branches
            </p>
          )}
          {ties.filter((t) => t.members.length === 3).map((t, i) => (
            zh ? (
              <p key={i} className="font-han mt-2 text-[13.5px]" style={{ color: ink }}>
                <span className="mr-2 font-bold" style={{ color: "var(--gilt)" }}>{TIE_NAMES[t.kind].hanzi}</span>
                {t.phase ? PHASES[t.phase].hanzi : null}
                <span className="ml-3 font-bold">{t.members.map((m) => m.char).join("")}</span>
              </p>
            ) : (
              <p key={i} className="font-gloss mt-2 text-[13.5px]" style={{ color: ink }}>
                <span className="mr-2 font-semibold" style={{ color: "var(--gilt)" }}>{tieLabel(t)}</span>
                <span className="ml-1 font-bold">{t.members.map((m) => m.en).join(", ")}</span>
              </p>
            )
          ))}
        </div>
      )}
    </div>
  );
}
