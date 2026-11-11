/**
 * A stem or branch of a chart, as the English Academy writes it: the pinyin
 * with its tone and the character after it, with nothing between them
 * (Jiǎ甲). Nate asked on 11 November 2026 that the chart's own pillars keep
 * their traditional characters in English too; prose names the sign in pinyin
 * alone.
 */
export function SignWord({ en, han }: { en: string; han: string }) {
  return (
    <>
      {en}
      <span className="font-han" lang="zh-Hant">{han}</span>
    </>
  );
}
