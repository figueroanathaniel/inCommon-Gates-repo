import { BRANCHES, STEMS } from "@contracts/bazi";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** What a sign is called in English: a stem's polarity and phase, a branch's animal. */
const MEANING: Record<string, string> = Object.fromEntries([
  ...STEMS.map((s) => [s.hanzi, `${cap(s.yinyang)} ${cap(s.phase)}`]),
  ...BRANCHES.map((b) => [b.hanzi, b.animal]),
]);

/**
 * A stem or branch of a chart, as the English Academy writes it: the pinyin
 * with its tone, then the character and its English name in full width
 * brackets: Jiǎ （甲 "Yang Wood"）. Nate set the shape on 11 November 2026 from
 * his own sample ("West （生氣 "Generating-Breath," wealth)"); the dashes in the
 * sample are left out by the no dash rule.
 */
export function SignWord({ en, han, stack }: { en: string; han: string; stack?: boolean }) {
  const m = MEANING[han];
  // A pillar cell is a quarter of a phone wide and already names the meaning
  // on the line under it, so there the bracket takes its own line and carries
  // the character alone: Jiǎ, then （甲）.
  if (stack) {
    return (
      <>
        {en}
        <span className="block whitespace-nowrap">（<span className="font-han" lang="zh-Hant">{han}</span>）</span>
      </>
    );
  }
  return (
    <>
      {en}{" "}
      <span className="whitespace-nowrap">
        （<span className="font-han" lang="zh-Hant">{han}</span>
        {m ? <> "{m}"</> : null}）
      </span>
    </>
  );
}
