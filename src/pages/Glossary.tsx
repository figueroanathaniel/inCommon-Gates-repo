import type { ReactNode } from "react";
import { Shell, Seal, Rule } from "@/components/academy/chrome";
import { STEMS, BRANCHES, PHASES, PILLAR_LABELS, TEN_GODS } from "@contracts/bazi";

/**
 * 典 The Glossary: the vocabulary a reading uses, given as the tradition
 * gives it. Each term is glossed once, at its first showing, and the
 * entries after it may keep the English alone. Attributed once to the
 * tradition, the entries then speak declaratively, as the scrolls do.
 */

function Entry({
  hanzi,
  pinyin,
  english,
  children,
}: {
  hanzi: string;
  pinyin?: string;
  english: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t py-4" style={{ borderColor: "rgba(var(--ac2r),.28)" }}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-han text-[24px] font-bold text-[var(--tx)]">{hanzi}</span>
        {pinyin ? <span className="font-gloss text-[13px] tracking-[0.14em] text-[var(--gilt)]">{pinyin}</span> : null}
        <span className="font-gloss text-[14px] uppercase tracking-[0.2em] text-[rgba(var(--txr),.85)]">{english}</span>
      </div>
      <p className="font-gloss mt-2 max-w-2xl text-[14.5px] leading-relaxed text-[rgba(var(--txr),.7)]">{children}</p>
    </div>
  );
}

function Section({ hanzi, english, note }: { hanzi: string; english: string; note?: string }) {
  return (
    <header className="mt-16 flex items-baseline gap-4">
      <span className="font-han text-[26px] font-bold text-[var(--tx)]">{hanzi}</span>
      <h2 className="font-gloss text-[13px] uppercase tracking-[0.24em] text-[var(--gilt)]">{english}</h2>
      {note ? <p className="font-gloss hidden text-[13px] italic text-[rgba(var(--txr),.66)] min-[820px]:block">{note}</p> : null}
    </header>
  );
}

/** The movement each phase is, named in the tradition's own images. */
const PHASE_MOVEMENT: Record<string, string> = {
  wood: "The movement of rising and spreading, the seed splitting and the tree climbing.",
  fire: "The movement of flaring upward, heat made visible in sun and lamp.",
  earth: "The movement of receiving and ripening, the field that bears what is planted in it.",
  metal: "The movement of gathering and hardening, ore becoming edge and edge becoming jewel.",
  water: "The movement of sinking and storing, the still deep where the next rise is conceived.",
};

export default function Glossary() {
  return (
    <Shell>
      <section className="py-16 min-[820px]:py-24">
        <div className="flex items-center gap-4">
          <Seal char="典" size={44} />
          <div>
            <h1 className="font-han text-[34px] font-bold tracking-[0.15em] text-[var(--tx)]">字彙</h1>
            <p data-en className="font-gloss text-[13px] uppercase tracking-[0.26em] text-[var(--gilt)]">The Glossary</p>
          </div>
        </div>
        <p className="font-gloss mt-8 max-w-2xl text-[16px] leading-relaxed text-[rgba(var(--txr),.75)]">
          The vocabulary a reading uses, given as the tradition gives it and in the order the scrolls teach it.
          A term is glossed once, at its first showing; the readings themselves keep the same rule, English
          beside the symbol at first appearance, English alone at every showing after.
        </p>
      </section>

      <Section hanzi="五行" english="The Five Phases" note="Movements, not things." />
      {Object.entries(PHASES).map(([phaseKey, ph]) => (
        <Entry key={phaseKey} hanzi={ph.hanzi} pinyin={ph.pinyin} english={ph.english}>
          {PHASE_MOVEMENT[phaseKey]} It generates {PHASES[ph.generates].english.toLowerCase()}
          {" "}and overcomes {PHASES[ph.overcomes].english.toLowerCase()}.
        </Entry>
      ))}

      <Section hanzi="天干" english="The Ten Stems" note="Heaven's breath, standing above." />
      {STEMS.map((s) => (
        <Entry key={s.hanzi} hanzi={s.hanzi} pinyin={s.pinyin} english={`${s.yinyang} ${PHASES[s.phase].english}`}>
          {s.quality.charAt(0).toUpperCase() + s.quality.slice(1)}.
        </Entry>
      ))}

      <Section hanzi="地支" english="The Twelve Branches" note="Earth's body, standing below." />
      {BRANCHES.map((b) => (
        <Entry key={b.hanzi} hanzi={b.hanzi} pinyin={b.pinyin} english={`${b.english}, the ${b.animal}`}>
          {b.quality.charAt(0).toUpperCase() + b.quality.slice(1)}. Its hidden stems:{" "}
          {b.hiddenStems.map((s) => `${STEMS[s].english} ${STEMS[s].hanzi}`).join(", ")}.
        </Entry>
      ))}

      <Section hanzi="十神" english="The Ten Gods" note="Relations around the Day Master, not spirits." />
      {Object.entries(TEN_GODS).map(([godKey, g]) => (
        <Entry key={godKey} hanzi={g.hanzi} pinyin={g.pinyin} english={g.english}>
          {g.reading.charAt(0).toUpperCase() + g.reading.slice(1)}.
        </Entry>
      ))}

      <Section hanzi="八字" english="BaZi" note="Root, sprout, flower, fruit." />
      {PILLAR_LABELS.map((l) => (
        <Entry key={l.key} hanzi={l.hanzi} english={l.english}>
          Its ground is {l.domain}.
        </Entry>
      ))}

      <Section hanzi="術語" english="The Terms of the Art" />
      <Entry hanzi="八字" pinyin="bā zì" english="The Eight Characters">
        The four pillars written together: the whole chart, and the name of the art itself.
      </Entry>
      <Entry hanzi="日主" pinyin="rì zhǔ" english="The Day Master">
        The stem of the day pillar, the self from which every other sign in the chart takes its relation.
        The founder set it at the centre of the art.
      </Entry>
      <Entry hanzi="月令" pinyin="yuè lìng" english="The Month's Decree">
        The branch of the month pillar, the season that weighs most heavily of all eight characters
        in judging whether the Day Master stands supported.
      </Entry>
      <Entry hanzi="藏干" pinyin="cáng gān" english="The Hidden Stems">
        The one, two or three stems stored within a branch, like provisions in a cellar:
        what a life holds in reserve, surfacing in its season.
      </Entry>
      <Entry hanzi="大運" pinyin="dà yùn" english="The Luck Pillars">
        The decades a life walks through, each a new stem and branch laid beside the eight.
        Weather, not verdicts.
      </Entry>
      <Entry hanzi="甲子" pinyin="jiǎ zǐ" english="The Sixty Pairs">
        The cycle made by riding the ten stems on the twelve branches, yang with yang, yin with yin,
        sixty pairs and then the round begins again. The days turn in this round without interruption.
      </Entry>
      <Entry hanzi="立春" pinyin="lì chūn" english="The Beginning of Spring">
        The solar term, near the fourth of February, at which the year pillar turns. A child born in
        late January belongs to the pillar of the year just closing.
      </Entry>

      <Rule className="mt-20" />
    </Shell>
  );
}
