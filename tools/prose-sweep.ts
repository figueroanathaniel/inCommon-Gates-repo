/**
 * Prose sweep, in the manner of the parent house's 400-seed rule:
 * every generator in src/lib/reading.ts is run across hundreds of charts,
 * including the heaviest phase cases, and its output is read by greps
 * for the classic failure modes.
 */
import { phaseLines, seasonLines, domainLines, godLines, phaseLinesZh, seasonLinesZh, domainLinesZh, godLinesZh, pillarViews, dayMasterOf } from "../src/lib/reading";
import { PHASES, STEMS, BRANCHES, tenGodOf } from "../contracts/bazi";
import type { FourPillars } from "../contracts/bazi";
import { TURN_CYCLE, leaves, b1Forms, READ_FROM, RESTS, STONE_INTRO } from "../src/content/reading-turns";

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
  if (/[:;]/.test(text)) problems.push(`${ctx}: colon or semicolon: ${text}`);
  if (/tradition|tends? to|appear|this chart|old reckoning/i.test(text)) problems.push(`${ctx}: retired phrasing: ${text}`);
  if (/\byou are\b|\brather than\b|\binstead of\b|\bfate\b/i.test(text)) problems.push(`${ctx}: house rule word: ${text}`);
  const machinery = ["calculate", "compute", "algorithm", "parameter", "variable", "function", "output", "input", "census", "architecture", "polarity", "framework", "dynamics", "leverage", "navigate", "landscape", "metric", "configuration"];
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
  // Every turn of the reading, so all 72 leaves of each phrase are read.
  for (let turn = 0; turn < TURN_CYCLE; turn++) {
    for (const fn of [phaseLines, seasonLines, domainLines, godLines]) {
      for (const line of fn(p, undefined, turn)) inspect(line, `seed=${seed} turn=${turn} ${fn.name}`);
    }
  }
  runs++;
}

// 2) The heaviest phase cases: all eight characters one phase (five charts)
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
  for (const fn of [phaseLines, seasonLines, domainLines, godLines]) {
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

// 5) English is wholly English, and 中文 wholly Chinese, over the 400 seeded charts
{
  const latin = /[A-Za-z]/;
  const cjk = /[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
  let seed = 7;
  const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  for (let i = 0; i < 400; i++) {
    const p: FourPillars = {
      yearStem: rnd(10), yearBranch: rnd(12), monthStem: rnd(10), monthBranch: rnd(12),
      dayStem: rnd(10), dayBranch: rnd(12), hourStem: rnd(10), hourBranch: rnd(12),
    };
    const en = [...seasonLines(p), ...phaseLines(p), ...domainLines(p), ...godLines(p)].join("\n");
    if (cjk.test(en)) problems.push(`English reading kept a character: ${en.match(cjk)![0]}`);
    const zh = [...seasonLinesZh(p), ...phaseLinesZh(p), ...domainLinesZh(p), ...godLinesZh(p)].join("\n");
    if (latin.test(zh)) problems.push(`中文 reading kept a Latin letter: ${zh}`);
    if (/undefined|NaN|\u2014|\u2013/.test(zh)) problems.push(`中文 reading defect: ${zh}`);
    runs++;
  }
}

for (const t of [READ_FROM, RESTS, STONE_INTRO]) {
  for (const line of leaves(t as Parameters<typeof leaves>[0], { dm: "Jiǎ" })) inspect(line, "frame");
  for (const line of b1Forms(t as Parameters<typeof b1Forms>[0], { dm: "Jiǎ" })) inspect(line, "frame b1");
}

console.log(`swept ${runs} chart sets; ten-god anchors: ${anchors.length}`);
if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  problems.slice(0, 30).forEach((p) => console.log(" - " + p));
  process.exit(1);
}
console.log("clean: no prose defects, no machinery words, no em dashes, gods true");
