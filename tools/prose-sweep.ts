/**
 * Prose sweep, in the manner of the parent house's 400-seed rule:
 * every generator in src/lib/reading.ts is run across hundreds of charts,
 * including the heaviest census cases, and its output is read by greps
 * for the classic failure modes.
 */
import { censusLines, seasonLines, domainLines, godLines, pillarViews, dayMasterOf, ReadingGloss } from "../src/lib/reading";
import { PHASES, STEMS, BRANCHES, tenGodOf } from "../contracts/bazi";
import type { FourPillars } from "../contracts/bazi";

function xorshift(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

const problems: string[] = [];
function inspect(text: string, ctx: string) {
  if (/undefined|NaN|\[object/.test(text)) problems.push(`${ctx}: token leak: ${text}`);
  if (/  /.test(text)) problems.push(`${ctx}: double space: ${text}`);
  if (/—|--/.test(text)) problems.push(`${ctx}: em dash or double hyphen: ${text}`);
  if (/\. [a-z]/.test(text)) problems.push(`${ctx}: lowercase after full stop: ${text}`);
  if (/\ba [AEIOU]/.test(text)) problems.push(`${ctx}: orphan article: ${text}`);
  if (/\b(1 times|1 pillars? are|2 time\b)/.test(text)) problems.push(`${ctx}: number grammar: ${text}`);
  const machinery = ["calculate", "compute", "algorithm", "parameter", "variable", "function", "output", "input"];
  for (const m of machinery) {
    if (new RegExp(`\\b${m}`, "i").test(text)) problems.push(`${ctx}: machinery word '${m}': ${text}`);
  }
}

let runs = 0;
// 1) 400 seeded pseudo-charts across the whole space
for (let seed = 1; seed <= 400; seed++) {
  const rnd = xorshift(seed);
  const p: FourPillars = {
    yearStem: Math.floor(rnd() * 10), yearBranch: Math.floor(rnd() * 12),
    monthStem: Math.floor(rnd() * 10), monthBranch: Math.floor(rnd() * 12),
    dayStem: Math.floor(rnd() * 10), dayBranch: Math.floor(rnd() * 12),
    hourStem: Math.floor(rnd() * 10), hourBranch: Math.floor(rnd() * 12),
  };
  for (const fn of [censusLines, seasonLines, domainLines, godLines]) {
    for (const line of fn(p)) inspect(line, `seed=${seed} ${fn.name}`);
  }
  runs++;
}

// 2) The heaviest census cases: all eight characters one phase (five charts)
const byPhase: Record<string, { stems: number[]; branches: number[] }> = {};
for (const ph of Object.keys(PHASES)) {
  byPhase[ph] = {
    stems: STEMS.filter((s) => s.phase === ph).map((s) => s.index),
    branches: BRANCHES.filter((b) => b.phase === ph).map((b) => b.index),
  };
}
for (const [ph, { stems, branches }] of Object.entries(byPhase)) {
  const p: FourPillars = {
    yearStem: stems[0], yearBranch: branches[0], monthStem: stems[1], monthBranch: branches[1 % branches.length],
    dayStem: stems[0], dayBranch: branches[0], hourStem: stems[1], hourBranch: branches[1 % branches.length],
  };
  for (const fn of [censusLines, seasonLines, domainLines, godLines]) {
    for (const line of fn(p)) inspect(line, `mono-${ph} ${fn.name}`);
  }
  runs++;
}

// 3) Ten gods truth table, hand-checked anchors
const anchors: [number, number, string][] = [
  [0, 0, "companion"],      // 甲 vs 甲
  [0, 1, "robwealth"],      // 甲 vs 乙
  [0, 2, "eatinggod"],      // 甲 vs 丙 (yang wood generates yang fire)
  [0, 3, "hurtingofficer"], // 甲 vs 丁
  [0, 4, "indirectwealth"], // 甲 vs 戊
  [0, 5, "directwealth"],   // 甲 vs 己
  [0, 6, "sevenkillings"],  // 甲 vs 庚
  [0, 7, "directofficer"],  // 甲 vs 辛
  [0, 8, "indirectresource"], // 甲 vs 壬
  [0, 9, "directresource"], // 甲 vs 癸
];
for (const [day, other, want] of anchors) {
  const got = tenGodOf(STEMS[day], STEMS[other]);
  if (got.key !== want) problems.push(`tenGod ${day}->${other}: want ${want}, got ${got.key}`);
}

// 4) All 100 stem pairs produce a god; day pillar views carry no god
for (let d = 0; d < 10; d++) for (let o = 0; o < 10; o++) {
  const g = tenGodOf(STEMS[d], STEMS[o]);
  if (!g.hanzi || !g.english) problems.push(`tenGod empty for ${d}->${o}`);
}
const sample = pillarViews({ yearStem: 0, yearBranch: 0, monthStem: 2, monthBranch: 2, dayStem: 4, dayBranch: 4, hourStem: 8, hourBranch: 8 });
if (sample[2].god !== null) problems.push("day pillar must carry no god");
if (dayMasterOf({ yearStem: 0, yearBranch: 0, monthStem: 0, monthBranch: 0, dayStem: 5, dayBranch: 5, hourStem: 0, hourBranch: 0 }).hanzi !== "己") {
  problems.push("dayMasterOf picks the wrong stem");
}

// 5) The Translate to English posture: no character may remain in any line
{
  const p: FourPillars = { yearStem: 0, yearBranch: 0, monthStem: 1, monthBranch: 1, dayStem: 2, dayBranch: 2, hourStem: 3, hourBranch: 3 };
  const gloss = new ReadingGloss(true);
  const all = [...seasonLines(p, gloss), ...censusLines(p, gloss), ...domainLines(p, gloss), ...godLines(p, gloss)].join("\n");
  if (/[一-鿿（）]/.test(all)) problems.push(`plain gloss kept characters: ${all}`);
  runs++;
}

// 6) One keeper across a whole reading: no symbol is glossed twice,
//    and a symbol named early is kept in English when named again
{
  const p: FourPillars = { yearStem: 0, yearBranch: 0, monthStem: 2, monthBranch: 2, dayStem: 0, dayBranch: 0, hourStem: 4, hourBranch: 4 };
  const gloss = new ReadingGloss(false);
  const all = [...seasonLines(p, gloss), ...censusLines(p, gloss), ...domainLines(p, gloss), ...godLines(p, gloss)].join("\n");
  const counts: Record<string, number> = {};
  for (const m of all.matchAll(/（([一-鿿]+)）/g)) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  for (const [h, n] of Object.entries(counts)) {
    if (n > 1) problems.push(`symbol ${h} glossed ${n} times in one reading`);
  }
  // a repeat of an earlier symbol must not carry its character again
  const tail = all.slice(all.indexOf("\n"));
  for (const m of tail.matchAll(/（([一-鿿]+)）/g)) {
    const before = all.slice(0, all.indexOf(m[0]));
    if (before.includes(m[1])) problems.push(`late gloss of an earlier symbol: ${m[1]}`);
  }
  runs++;
}

console.log(`swept ${runs} chart sets; ten-god anchors: ${anchors.length}`);
if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  problems.slice(0, 30).forEach((p) => console.log(" - " + p));
  process.exit(1);
}
console.log("clean: no prose defects, no machinery words, no em dashes, gods true");
