import { BRANCHES, STEMS } from "@contracts/bazi";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** What a sign is called in English: a stem's yin or yang and phase, a branch's animal. */
const MEANING: Record<string, string> = Object.fromEntries([
  ...STEMS.map((s) => [s.hanzi, `${cap(s.yinyang)} ${cap(s.phase)}`]),
  ...BRANCHES.map((b) => [b.hanzi, b.animal]),
]);

/**
 * A stem or branch of a chart, as the English Academy writes it: its English
 * name first, then the character and its toned pinyin in full width brackets:
 * Yang Wood （甲 "Jiǎ"）, Rat （子 "Zǐ"）. Nate chose this on 11 November 2026
 * from his own sample ("West （生氣 "Generating-Breath," wealth)"); the dashes
 * in the sample are left out by the no dash rule. The pillars themselves
 * carry the character alone, in both languages (Nate, 11 November 2026: "No
 * English in the main text on the pillars, ever."); this form is for prose,
 * the Meetings and the Teacher's Table.
 */
export function SignWord({ en, han }: { en: string; han: string }) {
  const name = MEANING[han] ?? en;
  // Inside the pillar panel the row is laid out right to left (dir="rtl"), so
  // the sign sets its own direction or its brackets and quotes come mirrored.
  return (
    <span dir="ltr">
      {name} <span className="whitespace-nowrap">（<span className="font-han" lang="zh-Hant">{han}</span> “{en}”）</span>
    </span>
  );
}
