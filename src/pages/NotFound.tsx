import { Shell, Seal, GhostButton } from "@/components/academy/chrome";
import { useT, useZh } from "@/lib/lang";

export default function NotFound() {
  const zh = useZh();
  const t = useT();
  return (
    <Shell>
      <section className="flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
        <Seal char="迷" size={52} />
        <h1 className={(zh ? "font-han tracking-[0.15em]" : "font-gloss tracking-[0.06em]") + " mt-8 text-[30px] font-bold text-[var(--tx)]"}>{t("Lost · 404", "迷路 · 404")}</h1>
        <p className={(zh ? "font-han" : "font-gloss italic") + " mt-4 max-w-md text-[15.5px] leading-relaxed text-[rgba(var(--txr),.65)]"}>
          {t(
            "This corridor does not exist in the house. Even a good reader loses the way once; the gate is never far.",
            "書院中無此廊。善讀者亦偶有迷途，門從不遠。",
          )}
        </p>
        <div className="mt-10"><GhostButton to="/">{t("Return to the Gate", "回門")}</GhostButton></div>
      </section>
    </Shell>
  );
}
