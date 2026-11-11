import type { ReactNode } from "react";
import { Shell, Seal, Rule } from "@/components/academy/chrome";
import { STEMS, BRANCHES, PHASES, PILLAR_LABELS, TEN_GODS } from "@contracts/bazi";
import { useT, useZh, YINYANG_ZH } from "@/lib/lang";

/**
 * The Glossary: the vocabulary a reading uses, given as the tradition gives
 * it. In English every entry is English, with its pinyin beside it; in 中文
 * every entry is the character and its gloss in traditional Chinese.
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
  const zh = useZh();
  return (
    <div className="border-t py-4" style={{ borderColor: "rgba(var(--ac2r),.28)" }}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {zh ? (
          <span className="font-han text-[24px] font-bold text-[var(--tx)]">{hanzi}</span>
        ) : (
          <>
            <span className="font-gloss text-[18px] font-semibold text-[var(--tx)]">{english}</span>
            {pinyin ? <span className="font-gloss text-[13px] tracking-[0.14em] text-[var(--gilt)]">{pinyin}</span> : null}
          </>
        )}
      </div>
      <p className={(zh ? "font-han" : "font-gloss") + " mt-2 max-w-2xl text-[14.5px] leading-relaxed text-[rgba(var(--txr),.7)]"}>{children}</p>
    </div>
  );
}

function Section({ hanzi, english, note, noteZh }: { hanzi: string; english: string; note?: string; noteZh?: string }) {
  const zh = useZh();
  return (
    <header className="mt-16 flex items-baseline gap-4">
      {zh ? (
        <h2 className="font-han text-[26px] font-bold text-[var(--tx)]">{hanzi}</h2>
      ) : (
        <h2 className="font-gloss text-[22px] font-semibold text-[var(--gilt)]">{english}</h2>
      )}
      {(zh ? noteZh : note) ? (
        <p className={(zh ? "font-han" : "font-gloss italic") + " hidden text-[13px] text-[rgba(var(--txr),.66)] min-[820px]:block"}>{zh ? noteZh : note}</p>
      ) : null}
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

const PHASE_MOVEMENT_ZH: Record<string, string> = {
  wood: "升而舒展之運行，種子裂開，樹木攀升。",
  fire: "炎上之運行，熱化為可見，在日在燈。",
  earth: "受納而成熟之運行，田地承其所種。",
  metal: "收斂而堅硬之運行，礦成刃，刃成寶。",
  water: "潤下而收藏之運行，靜深之處，孕育下一次升起。",
};

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** The terms of the art, in both languages. */
const TERMS = [
  { hanzi: "八字", pinyin: "bā zì", english: "The Eight Characters",
    en: "The four pillars written together: the whole chart, and the name of the art itself.",
    zh: "四柱合書：全盤，亦即此術之名。" },
  { hanzi: "日主", pinyin: "rì zhǔ", english: "The Day Master",
    en: "The stem of the day pillar, the self from which every other sign in the chart takes its relation. The founder set it at the centre of the art.",
    zh: "日柱之天干，即自身，盤中其餘諸字皆由此定其關係。開創者將之置於此術之中心。" },
  { hanzi: "月令", pinyin: "yuè lìng", english: "The Month's Decree",
    en: "The branch of the month pillar, the season that weighs most heavily of all eight characters in judging whether the Day Master stands supported.",
    zh: "月柱之地支，即季節，判斷日主是否得扶時，八字之中以此為最重。" },
  { hanzi: "藏干", pinyin: "cáng gān", english: "The Hidden Stems",
    en: "The one, two or three stems stored within a branch, like provisions in a cellar: what a life holds in reserve, surfacing in its season.",
    zh: "藏於地支之中的一至三個天干，如窖中之糧：一生所儲之備，逢其季而顯。" },
  { hanzi: "大運", pinyin: "dà yùn", english: "The Luck Pillars",
    en: "The decades a life walks through, each a new stem and branch laid beside the eight. The weather of the years.",
    zh: "一生所行之十年，每一步皆以新的干支置於八字之旁。歲月之天氣。" },
  { hanzi: "甲子", pinyin: "jiǎ zǐ", english: "The Sixty Pairs",
    en: "The cycle made by riding the ten stems on the twelve branches, yang with yang, yin with yin, sixty pairs and then the round begins again. The days turn in this round without interruption.",
    zh: "十干配十二支，陽配陽，陰配陰，成六十對，而後周而復始。日子循此輪轉，從無間斷。" },
  { hanzi: "立春", pinyin: "lì chūn", english: "The Beginning of Spring",
    en: "The solar term, near the fourth of February, at which the year pillar turns. A child born in late January belongs to the pillar of the year just closing.",
    zh: "節氣之一，約在二月四日前後，年柱於此而轉。一月下旬出生者，屬將盡之年的年柱。" },
];

export default function Glossary() {
  const zh = useZh();
  const t = useT();
  return (
    <Shell>
      <section className="py-16 min-[820px]:py-24">
        <div className="flex items-center gap-4">
          <Seal char="典" size={44} />
          <div>
            {zh ? (
              <h1 className="font-han text-[34px] font-bold tracking-[0.15em] text-[var(--tx)]">字彙</h1>
            ) : (
              <h1 className="font-gloss text-[30px] font-semibold tracking-[0.06em] text-[var(--tx)]">The Glossary</h1>
            )}
          </div>
        </div>
        <p className={(zh ? "font-han" : "font-gloss") + " mt-8 max-w-2xl text-[16px] leading-relaxed text-[rgba(var(--txr),.75)]"}>
          {t(
            "The vocabulary a reading uses, given as the tradition gives it and in the order the scrolls teach it. Each term carries its pinyin, the sound of the character it stands for.",
            "讀盤所用之字彙，依傳統所授，並依諸卷所教之序排列。",
          )}
        </p>
      </section>

      <Section hanzi="五行" english="The Five Phases" note="Movements of the world." noteZh="世間之運行。" />
      {Object.entries(PHASES).map(([phaseKey, ph]) => (
        <Entry key={phaseKey} hanzi={ph.hanzi} pinyin={ph.pinyin} english={ph.english}>
          {zh
            ? `${PHASE_MOVEMENT_ZH[phaseKey]}生${PHASES[ph.generates].hanzi}，剋${PHASES[ph.overcomes].hanzi}。`
            : `${PHASE_MOVEMENT[phaseKey]} It generates ${PHASES[ph.generates].english.toLowerCase()} and overcomes ${PHASES[ph.overcomes].english.toLowerCase()}.`}
        </Entry>
      ))}

      <Section hanzi="天干" english="The Ten Stems" note="Heaven's breath, standing above." noteZh="天之氣，立於上。" />
      {STEMS.map((s) => (
        <Entry key={s.hanzi} hanzi={s.hanzi} pinyin={s.pinyin} english={`${s.english}, ${cap(s.yinyang)} ${PHASES[s.phase].english}`}>
          {zh ? `${YINYANG_ZH[s.yinyang]}${PHASES[s.phase].hanzi}。${s.qualityZh}。` : `${cap(s.quality)}.`}
        </Entry>
      ))}

      <Section hanzi="地支" english="The Twelve Branches" note="Earth's body, standing below." noteZh="地之體，立於下。" />
      {BRANCHES.map((b) => (
        <Entry key={b.hanzi} hanzi={b.hanzi} pinyin={b.pinyin} english={`${b.english}, the ${b.animal}`}>
          {zh
            ? `屬${b.animalHanzi}。${b.qualityZh}。藏干：${b.hiddenStems.map((x) => STEMS[x].hanzi).join("、")}。`
            : `${cap(b.quality)}. Its hidden stems: ${b.hiddenStems.map((x) => STEMS[x].english).join(", ")}.`}
        </Entry>
      ))}

      <Section hanzi="十神" english="The Ten Gods" note="Relations around the Day Master." noteZh="日主周圍之關係。" />
      {Object.entries(TEN_GODS).map(([godKey, g]) => (
        <Entry key={godKey} hanzi={g.hanzi} pinyin={g.pinyin} english={g.english}>
          {zh ? `${g.readingZh}。` : `${cap(g.reading)}.`}
        </Entry>
      ))}

      <Section hanzi="四柱" english="The Four Pillars" note="Root, sprout, flower, fruit." noteZh="根、苗、花、實。" />
      {PILLAR_LABELS.map((l) => (
        <Entry key={l.key} hanzi={l.hanzi} english={l.english}>
          {zh ? `主${l.domainZh}。` : `Its ground is ${l.domain}.`}
        </Entry>
      ))}

      <Section hanzi="術語" english="The Terms of the Art" />
      {TERMS.map((x) => (
        <Entry key={x.hanzi} hanzi={x.hanzi} pinyin={x.pinyin} english={x.english}>
          {zh ? x.zh : x.en}
        </Entry>
      ))}

      <Rule className="mt-20" />
    </Shell>
  );
}
