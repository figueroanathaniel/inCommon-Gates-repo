import { BRANCHES, PHASES, STEMS, type FourPillars, type Phase } from "@contracts/bazi";

/*
  合沖刑害: how two signs meet. Arithmetic only, no reading.

  Every table here was read on a page before it was typed, on 11 November
  2026, and the pages are listed in docs/meetings-sources.md:
    stems      天干化合 and 天干相沖, zh.wikipedia 天干
    branches   六合, 三合, 相沖, 相害, 相刑, zh.wikipedia 地支, with every
               pair that names 丑 taken from Master Sean Chan's branch
               pages, because the first page came through without it
    seasons    旺相休囚死 as five relations to the phase in season

  Left out because no page read settles them: half harmonies, the three
  seasonal meetings, the breaks, and what 午未 combines into.
*/

export type TieKind = "combine" | "clash" | "harm" | "punish" | "harmony";

export const TIE_NAMES: Record<TieKind, { hanzi: string; english: string }> = {
  combine: { hanzi: "合", english: "Combination" },
  clash: { hanzi: "沖", english: "Clash" },
  harm: { hanzi: "害", english: "Harm" },
  punish: { hanzi: "刑", english: "Punishment" },
  harmony: { hanzi: "三合", english: "Three Harmony" },
};

const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const table = <T,>(rows: [number, number, T][]) => new Map(rows.map(([a, b, v]) => [pairKey(a, b), v]));

/** 甲己土 乙庚金 丙辛水 丁壬木 戊癸火 */
const STEM_COMBINE = table<Phase>([[0, 5, "earth"], [1, 6, "metal"], [2, 7, "water"], [3, 8, "wood"], [4, 9, "fire"]]);
/** 甲庚 乙辛 丙壬 丁癸 */
const STEM_CLASH = table<true>([[0, 6, true], [1, 7, true], [2, 8, true], [3, 9, true]]);
/** 子丑土 寅亥木 卯戌火 辰酉金 巳申水 午未 */
const BRANCH_COMBINE = table<Phase | null>([[0, 1, "earth"], [2, 11, "wood"], [3, 10, "fire"], [4, 9, "metal"], [5, 8, "water"], [6, 7, null]]);
/** 子午 丑未 寅申 卯酉 辰戌 巳亥 */
const BRANCH_CLASH = table<true>([[0, 6, true], [1, 7, true], [2, 8, true], [3, 9, true], [4, 10, true], [5, 11, true]]);
/** 子未 丑午 寅巳 卯辰 申亥 酉戌 */
const BRANCH_HARM = table<true>([[0, 7, true], [1, 6, true], [2, 5, true], [3, 4, true], [8, 11, true], [9, 10, true]]);
/** 寅巳申, 丑戌未, 子卯 */
const BRANCH_PUNISH = table<true>([[2, 5, true], [5, 8, true], [2, 8, true], [1, 10, true], [10, 7, true], [1, 7, true], [0, 3, true]]);
/** 辰辰 午午 酉酉 亥亥 */
const SELF_PUNISH = new Set([4, 6, 9, 11]);
/** 申子辰水 寅午戌火 巳酉丑金 亥卯未木 */
const HARMONIES: { trio: [number, number, number]; phase: Phase }[] = [
  { trio: [8, 0, 4], phase: "water" },
  { trio: [2, 6, 10], phase: "fire" },
  { trio: [5, 9, 1], phase: "metal" },
  { trio: [11, 3, 7], phase: "wood" },
];

export interface Meeting { kind: TieKind; phase: Phase | null }

export function stemMeetings(a: number, b: number): Meeting[] {
  const out: Meeting[] = [];
  const k = pairKey(a, b);
  const c = STEM_COMBINE.get(k);
  if (c) out.push({ kind: "combine", phase: c });
  if (STEM_CLASH.has(k)) out.push({ kind: "clash", phase: null });
  return out;
}

export function branchMeetings(a: number, b: number): Meeting[] {
  const out: Meeting[] = [];
  const k = pairKey(a, b);
  if (BRANCH_COMBINE.has(k)) out.push({ kind: "combine", phase: BRANCH_COMBINE.get(k) ?? null });
  if (BRANCH_CLASH.has(k)) out.push({ kind: "clash", phase: null });
  if (BRANCH_HARM.has(k)) out.push({ kind: "harm", phase: null });
  if (BRANCH_PUNISH.has(k) || (a === b && SELF_PUNISH.has(a))) out.push({ kind: "punish", phase: null });
  return out;
}

/** The key a chart lights a character by: the sign it stands in and its layer. */
export const litKey = (sign: string, layer: "stem" | "branch") => `${sign}:${layer}`;

/** One pillar set among the others: the four of the birth, a decade, a year. */
export interface Sign {
  key: string;
  hanzi: string;
  english: string;
  stem: number;
  branch: number;
  /** True for a decade or a year laid beside the birth. */
  incoming?: boolean;
}

export interface Tie {
  kind: TieKind;
  layer: "stem" | "branch";
  phase: Phase | null;
  /** The signs that meet, in the order they were given. */
  members: { sign: string; char: string }[];
  /** True when a decade or a year is one of them. */
  incoming: boolean;
}

export function natalSigns(p: FourPillars): Sign[] {
  return [
    { key: "year", hanzi: "年", english: "Year", stem: p.yearStem, branch: p.yearBranch },
    { key: "month", hanzi: "月", english: "Month", stem: p.monthStem, branch: p.monthBranch },
    { key: "day", hanzi: "日", english: "Day", stem: p.dayStem, branch: p.dayBranch },
    { key: "hour", hanzi: "時", english: "Hour", stem: p.hourStem, branch: p.hourBranch },
  ];
}

/** Every meeting among the signs given: pairs first, in order, then whole three harmonies. */
export function tiesAmong(signs: Sign[]): Tie[] {
  const out: Tie[] = [];
  for (let i = 0; i < signs.length; i++) {
    for (let j = i + 1; j < signs.length; j++) {
      const a = signs[i];
      const b = signs[j];
      const incoming = !!(a.incoming || b.incoming);
      for (const m of stemMeetings(a.stem, b.stem)) {
        out.push({ ...m, layer: "stem", incoming, members: [{ sign: a.key, char: STEMS[a.stem].hanzi }, { sign: b.key, char: STEMS[b.stem].hanzi }] });
      }
      for (const m of branchMeetings(a.branch, b.branch)) {
        out.push({ ...m, layer: "branch", incoming, members: [{ sign: a.key, char: BRANCHES[a.branch].hanzi }, { sign: b.key, char: BRANCHES[b.branch].hanzi }] });
      }
    }
  }
  for (const h of HARMONIES) {
    const found = h.trio.map((b) => signs.find((s) => s.branch === b));
    if (found.every(Boolean)) {
      const members = (found as Sign[]).map((s) => ({ sign: s.key, char: BRANCHES[s.branch].hanzi }));
      out.push({ kind: "harmony", layer: "branch", phase: h.phase, members, incoming: (found as Sign[]).some((s) => s.incoming) });
    }
  }
  return out;
}

/** The kinds of meeting one sign makes with the four of the birth, each kind once. */
export function kindsAgainst(p: FourPillars, stem: number, branch: number): TieKind[] {
  const ties = tiesAmong([...natalSigns(p), { key: "x", hanzi: "", english: "", stem, branch, incoming: true }]);
  const seen: TieKind[] = [];
  for (const t of ties) if (t.incoming && !seen.includes(t.kind)) seen.push(t.kind);
  return seen;
}

/**
 * 流年, the pillar of the year that opens at 立春 in the calendar year given.
 * 1984 is 甲子.
 */
export function yearPillar(year: number): { stem: number; branch: number } {
  const n = (((year - 1984) % 60) + 60) % 60;
  return { stem: n % 10, branch: n % 12 };
}

/** The ten calendar years a decade covers, from the year it opens. */
export function decadeYears(from: string): number[] {
  if (!/^\d{4}/.test(from)) return [];
  const y = Number(from.slice(0, 4));
  return Array.from({ length: 10 }, (_, i) => y + i);
}

export type SeasonState = "wang" | "xiang" | "xiu" | "qiu" | "si";

export const SEASON_STATES: Record<SeasonState, { hanzi: string; english: string }> = {
  wang: { hanzi: "旺", english: "Prosperous" },
  xiang: { hanzi: "相", english: "Assisted" },
  xiu: { hanzi: "休", english: "Resting" },
  qiu: { hanzi: "囚", english: "Confined" },
  si: { hanzi: "死", english: "Dead" },
};

/**
 * 旺相休囚死: where a phase stands against the phase in season, which is the
 * month branch's own. In season it is 旺; fed by the season, 相; feeding it,
 * 休; set to overcome it, 囚; overcome by it, 死.
 */
export function seasonState(monthBranch: number, phase: Phase): SeasonState {
  const season = BRANCHES[monthBranch].phase;
  if (phase === season) return "wang";
  if (PHASES[season].generates === phase) return "xiang";
  if (PHASES[phase].generates === season) return "xiu";
  if (PHASES[phase].overcomes === season) return "qiu";
  return "si";
}

/**
 * 師生合參: the meetings between two charts, a teacher's and a student's.
 * Only a meeting with a sign from each chart is kept; what a chart does
 * within itself is its own table. The same tables as above, nothing added.
 */
export function crossSigns(teacher: FourPillars, student: FourPillars): { teacher: Sign[]; student: Sign[] } {
  const side = (p: FourPillars, key: string, han: string, en: string) =>
    natalSigns(p).map((s) => ({ ...s, key: `${key}-${s.key}`, hanzi: `${han}${s.hanzi}`, english: `${en} ${s.english}` }));
  return { teacher: side(teacher, "t", "師", "Teacher"), student: side(student, "s", "生", "Student") };
}

export function crossTies(teacher: FourPillars, student: FourPillars): Tie[] {
  const { teacher: ts, student: ss } = crossSigns(teacher, student);
  const out: Tie[] = [];
  for (const a of ts) {
    for (const b of ss) {
      for (const m of stemMeetings(a.stem, b.stem)) {
        out.push({ ...m, layer: "stem", incoming: false, members: [{ sign: a.key, char: STEMS[a.stem].hanzi }, { sign: b.key, char: STEMS[b.stem].hanzi }] });
      }
      for (const m of branchMeetings(a.branch, b.branch)) {
        out.push({ ...m, layer: "branch", incoming: false, members: [{ sign: a.key, char: BRANCHES[a.branch].hanzi }, { sign: b.key, char: BRANCHES[b.branch].hanzi }] });
      }
    }
  }
  const all = [...ts, ...ss];
  const isT = (s: Sign) => s.key.startsWith("t-");
  for (const h of HARMONIES) {
    const holders = h.trio.map((b) => all.filter((s) => s.branch === b));
    if (holders.some((x) => x.length === 0)) continue;
    /* A whole trio that neither chart holds alone: the first choice of holders that draws on both. */
    let pick: Sign[] | null = null;
    for (const a of holders[0]) for (const b of holders[1]) for (const c of holders[2]) {
      if (pick) continue;
      const trio = [a, b, c];
      if (trio.some(isT) && !trio.every(isT)) pick = trio;
    }
    if (!pick) continue;
    const alone = (side: Sign[]) => h.trio.every((b) => side.some((s) => s.branch === b));
    if (alone(ts) || alone(ss)) continue;
    out.push({ kind: "harmony", layer: "branch", phase: h.phase, incoming: false, members: pick.map((s) => ({ sign: s.key, char: BRANCHES[s.branch].hanzi })) });
  }
  return out;
}
