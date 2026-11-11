import { Link } from "react-router";
import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { api } from "@/providers/data";
import { BrandDoor } from "@/components/academy/brand";
import { useT, useZh } from "@/lib/lang";

export default function Gate() {
  const stone = api.stone.useQuery();
  const zh = useZh();
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";
  return (
    <Shell>
      {/* The threshold */}
      <section className="flex min-h-[88dvh] flex-col items-start justify-center py-16">
        <div className="rise rise-1 flex items-center gap-4">
          <Seal char="門" size={44} />
          <span className={(zh ? "font-han tracking-[0.3em]" : "font-gloss uppercase tracking-[0.3em]") + " text-[13px] text-[var(--gilt)]"}>
            {t("A branch of inCommon", "inCommon 之一支")}
          </span>
        </div>

        {zh ? (
          <h1 className="rise rise-2 mt-10 flex min-w-0 items-start gap-4 min-[820px]:gap-10">
            <span
              className="relative inline-flex shrink-0 items-center justify-center"
              style={{ fontSize: "clamp(44px, 11vw, 112px)", width: "clamp(110px, 30vw, 300px)", height: "clamp(110px, 30vw, 300px)" }}
            >
              <span className="mark-ring" aria-hidden />
              <span
                className="vertical-rl font-han font-black leading-none text-[var(--tx)]"
                style={{ writingMode: "vertical-rl", letterSpacing: "0.12em" }}
              >
                八字
              </span>
            </span>
            <span className="flex flex-col justify-between pt-2">
              <span
                className="vertical-rl font-han font-bold leading-none text-[var(--gilt)]"
                style={{ writingMode: "vertical-rl", fontSize: "clamp(30px, 6.5vw, 56px)", letterSpacing: "0.2em" }}
              >
                書院
              </span>
            </span>
            <span className="mt-2 hidden min-w-0 max-w-[300px] flex-col gap-4 min-[820px]:flex">
              <span className="h-px w-24" style={{ background: "rgba(var(--ac2r),.6)" }} />
              <span className="font-han text-[16px] leading-relaxed text-[rgba(var(--txr),.65)]">
                四柱八字，一生以其本有之文法讀之。
              </span>
            </span>
          </h1>
        ) : (
          <h1 className="rise rise-2 mt-10 flex min-w-0 items-center gap-6 min-[820px]:gap-10">
            <span
              className="relative inline-flex shrink-0 items-center justify-center"
              style={{ width: "clamp(110px, 30vw, 300px)", height: "clamp(110px, 30vw, 300px)" }}
            >
              <span className="mark-ring" aria-hidden />
              <span className="font-gloss font-semibold leading-none text-[var(--tx)]" style={{ fontSize: "clamp(34px, 8.5vw, 84px)", letterSpacing: "0.04em" }}>
                BaZi
              </span>
            </span>
            <span className="flex min-w-0 max-w-[320px] flex-col gap-4">
              <span className="font-gloss font-semibold leading-tight text-[var(--gilt)]" style={{ fontSize: "clamp(22px, 4.6vw, 40px)" }}>
                The Eight Characters Academy
              </span>
              <span className="hidden h-px w-24 min-[820px]:block" style={{ background: "rgba(var(--ac2r),.6)" }} />
              <span className="font-gloss hidden text-[15px] italic leading-relaxed text-[rgba(var(--txr),.65)] min-[820px]:block">
                Four pillars, eight characters, and a life read in its own grammar.
              </span>
            </span>
          </h1>
        )}

        <p className={"rise rise-3 " + f + " mt-12 max-w-xl text-[17px] leading-relaxed text-[rgba(var(--txr),.85)]"}>
          {t(
            "The art was always handed over slowly: one reader, one listener, one chart between them. This house keeps that slowness and opens its door wider. Whoever enters receives the scrolls whole and in their order, as if each had been unrolled for them alone.",
            "此術向來傳得緩慢：一位讀者，一位聽者，一張命盤居於其間。書院守此緩慢，而將門開得更寬。入門者得諸卷之全，依序而讀，如每卷專為其一人展開。",
          )}
        </p>

        <div className="rise rise-4 mt-10 flex flex-col items-stretch gap-4 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center">
          <BrandDoor to="/hall">{t("Enter the hall", "入廳")}</BrandDoor>
          <GhostButton to="/stone">{t("Stand before the Destiny Chart", "往命盤之前")}</GhostButton>
        </div>

        <p className={"rise rise-5 " + f + " mt-8 text-[13px] text-[rgba(var(--txr),.66)]"}>
          {stone.data
            ? zh
              ? `本命已銘：${stone.data.labelZh}。堂中諸卷皆書於其上。`
              : `Your Nature stands inscribed: ${stone.data.label}. Every scroll in the hall is written upon it.`
            : t("Your Nature stands veiled. Once it is inscribed, every scroll will be found written upon it.", "本命尚蒙。一經銘定，諸卷皆可見書於其上。")}
        </p>
      </section>

      <Rule />

      {/* What the house keeps */}
      <section className="grid gap-14 py-20 min-[820px]:grid-cols-3 min-[820px]:gap-10">
        {[
          {
            hanzi: "八字",
            english: "BaZi",
            text: "The year, the month, the day and the hour of a birth, written as eight characters and read as one life: root, sprout, flower and fruit.",
            zhText: "生之年、月、日、時，書為八字，讀為一生：根、苗、花、實。",
          },
          {
            hanzi: "五行",
            english: "The Five Phases",
            text: "Wood, fire, earth, metal and water as movements, turning in the generating ring and governed by the overcoming star.",
            zhText: "木火土金水，皆為運行，旋於相生之環，制於相剋之星。",
          },
          {
            hanzi: "命盤",
            english: "Your Nature",
            text: "One true chart set at the centre of the hall. Every scroll returns to it, until the grammar of the art is something you have seen written in a life.",
            zhText: "一張真盤置於堂中。諸卷皆回歸於它，直至此術之文法，成為你在一生中親見所書者。",
          },
        ].map((c) => (
          <div key={c.english} className="border-t pt-6" style={{ borderColor: "rgba(var(--ac2r),.35)" }}>
            {zh ? (
              <h2 className="font-han text-[30px] font-bold text-[var(--tx)]">{c.hanzi}</h2>
            ) : (
              <h2 className="font-gloss text-[22px] font-semibold text-[var(--tx)]">{c.english}</h2>
            )}
            <p className={f + " mt-4 text-[15px] leading-relaxed text-[rgba(var(--txr),.7)]"}>{zh ? c.zhText : c.text}</p>
          </div>
        ))}
      </section>

      <section className="pb-10">
        <div className="border px-6 py-10 text-center min-[820px]:px-16" style={{ borderColor: "rgba(var(--ac2r),.35)", background: "rgba(var(--sfr),.84)" }}>
          {zh ? (
            <>
              <p className="font-han text-[22px] font-semibold tracking-[0.2em] text-[var(--paper)]">命好不如運好，運好不如流年好</p>
              <p className="font-han mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[rgba(var(--txr),.65)]">
                《滴天髓》守其分寸：順其紋理者為福。命盤示其紋理。
              </p>
            </>
          ) : (
            <>
              <p className="font-gloss text-[20px] font-semibold italic text-[var(--paper)]">A fine chart is not the equal of a fine decade, and a fine decade is not the equal of a fine year.</p>
              <p className="font-gloss mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[rgba(var(--txr),.65)]">
                The Marrow of Heaven's Drops keeps the measure: going with the grain is fortune. The chart shows the grain.
              </p>
            </>
          )}
          <div className="mt-8 flex justify-center">
            <Link
              to="/scroll/yuan"
              className={(zh ? "font-han tracking-[0.2em]" : "font-gloss uppercase tracking-[0.16em]") + " inline-flex min-h-[44px] items-center px-6 text-[14px] text-[var(--jade-tx)] transition-opacity duration-200 hover:opacity-75"}
            >
              {t("Begin with the Prologue", "自緣起始")}
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
