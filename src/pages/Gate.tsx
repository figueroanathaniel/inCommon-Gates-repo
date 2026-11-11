import { Link } from "react-router";
import { Shell, Seal, Rule, GhostButton } from "@/components/academy/chrome";
import { api } from "@/providers/data";
import { BrandDoor } from "@/components/academy/brand";

export default function Gate() {
  const stone = api.stone.useQuery();
  return (
    <Shell>
      {/* The threshold */}
      <section className="flex min-h-[88dvh] flex-col items-start justify-center py-16">
        <div className="rise rise-1 flex items-center gap-4">
          <Seal char="門" size={44} />
          <span className="font-gloss text-[13px] uppercase tracking-[0.3em] text-[var(--gilt)]">
            A branch of inCommon
          </span>
        </div>

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
          <span className="mt-2 flex min-w-0 max-w-[300px] flex-col gap-4">
            <span className="font-gloss break-words text-[13px] uppercase tracking-[0.22em] min-[820px]:text-[15px] min-[820px]:tracking-[0.34em] text-[rgba(var(--txr),.66)]">
              The Eight Characters Academy
            </span>
            <span className="hidden h-px w-24 min-[820px]:block" style={{ background: "rgba(var(--ac2r),.6)" }} />
            <span className="font-gloss hidden text-[15px] italic leading-relaxed text-[rgba(var(--txr),.65)] min-[820px]:block">
              Four pillars, eight characters, and a life read in its own grammar.
            </span>
          </span>
        </h1>

        <p className="rise rise-3 font-gloss mt-12 max-w-xl text-[17px] leading-relaxed text-[rgba(var(--txr),.85)]">
          The art was always handed over slowly: one reader, one listener, one chart between them.
          This house keeps that slowness and opens its door wider. Whoever enters receives the
          scrolls whole and in their order, as if each had been unrolled for them alone.
        </p>

        <div className="rise rise-4 mt-10 flex flex-col items-stretch gap-4 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center">
          <BrandDoor to="/hall">Enter the hall 入廳</BrandDoor>
          <GhostButton to="/stone">Stand before the Destiny Chart</GhostButton>
        </div>

        <p className="rise rise-5 font-gloss mt-8 text-[13px] text-[rgba(var(--txr),.66)]">
          {stone.data
            ? `Your Nature stands inscribed: ${stone.data.label}. Every scroll in the hall is written upon it.`
            : "Your Nature stands veiled. Once it is inscribed, every scroll will be found written upon it."}
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
          },
          {
            hanzi: "五行",
            english: "The Five Phases",
            text: "Wood, fire, earth, metal and water as movements, turning in the generating ring and governed by the overcoming star.",
          },
          {
            hanzi: "",
            english: "Your Nature",
            text: "One true chart set at the centre of the hall. Every scroll returns to it, until the grammar of the art is something you have seen written in a life.",
          },
        ].map((c) => (
          <div key={c.hanzi} className="border-t pt-6" style={{ borderColor: "rgba(var(--ac2r),.35)" }}>
            {c.hanzi ? <span className="font-han text-[30px] font-bold text-[var(--tx)]">{c.hanzi}</span> : null}
            <h2 className="font-gloss mt-2 text-[13px] uppercase tracking-[0.24em] text-[var(--gilt)]">{c.english}</h2>
            <p className="font-gloss mt-4 text-[15px] leading-relaxed text-[rgba(var(--txr),.7)]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="pb-10">
        <div className="border px-6 py-10 text-center min-[820px]:px-16" style={{ borderColor: "rgba(var(--ac2r),.35)", background: "rgba(var(--sfr),.84)" }}>
          <p className="font-han text-[22px] font-semibold tracking-[0.2em] text-[var(--paper)]">命好不如運好，運好不如流年好</p>
          <p className="font-gloss mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[rgba(var(--txr),.65)]">
            A fine chart is not the equal of a fine decade, and a fine decade is not the equal of a fine year.
            The Marrow of Heaven's Drops keeps the measure: going with the grain is fortune.
            The chart shows the grain.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/scroll/yuan"
              className="font-gloss inline-flex min-h-[44px] items-center px-6 text-[14px] uppercase tracking-[0.16em] text-[var(--jade-tx)] transition-opacity duration-200 hover:opacity-75"
            >
              Begin with the Prologue 緣
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
