import { BRANCHES, STEMS } from "@contracts/bazi";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** What a sign is called in English: a stem's polarity and phase, a branch's animal. */
const MEANING: Record<string, string> = Object.fromEntries([
  ...STEMS.map((s) => [s.hanzi, `${cap(s.yinyang)} ${cap(s.phase)}`]),
  ...BRANCHES.map((b) => [b.hanzi, b.animal]),
]);

/**
 * A stem or branch of a chart, as the English Academy writes it: its English
 * name first, then the character and its toned pinyin in full width brackets:
 * Yang Wood （甲 "Jiǎ"）, Rat （子 "Zǐ"）. Nate chose this on 11 November 2026
 * from his own sample ("West （生氣 "Generating-Breath," wealth)"); the dashes
 * in the sample are left out by the no dash rule.
 */
export function SignWord({ en, han, stack }: { en: string; han: string; stack?: boolean }) {
  const name = MEANING[han] ?? en;
  // The pillar row is laid out right to left (dir="rtl"), so the sign sets its
  // own direction or its brackets and quotes come out mirrored.
  // A pillar cell is a quarter of a phone wide, so there the bracket takes
  // its own line under the name, smaller, and the name may wrap.
  const inner = <>（<span className="font-han" lang="zh-Hant">{han}</span> “{en}”）</>;
  if (stack) {
    return (
      <span dir="ltr" className="block max-w-full text-center">
        <span className="block">{name}</span>
        <span className="block whitespace-nowrap text-[max(0.62em,10.5px)] font-semibold">{inner}</span>
      </span>
    );
  }
  return <span dir="ltr">{name} <span className="whitespace-nowrap">{inner}</span></span>;
}
