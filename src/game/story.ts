import { BRANCHES, PHASES, PILLAR_LABELS, STEMS, tenGodOf, type FourPillars, type Phase } from "@contracts/bazi";
import type { GodKind, LegSpec, Tone } from "./world";
import {
  AGAIN, CLOSE_FIRST, CLOSE_LAST, CLOSE_WAY, FRAME, GODS, INTIMACY, KEEPER, KEEPER_INVITE, KEEPER_OPEN, OPENING, READ_AS,
  type Choice, type L, type Tag,
} from "./script";

/*
  The road of one chart. It is read straight off the eight characters with
  the Academy's own tables: the Day Branch's phase chooses where the road
  begins, and the figure on each stretch is the ten god of one stem (the Day
  Branch's first hidden stem, then the year, month and hour stems, then the
  stem of the decade the chart is in, where one is known). Nothing is
  weighed, scored or foretold.
*/

/** What a token in a line stands for. */
export type Part =
  | string
  | { sign: { en: string; han: string } }
  | { god: { en: string; han: string; pinyin: string } };

export interface Vars {
  branch: Part; phase: L; quality: L;
  stem?: Part; god?: Part; reading?: L; pillar?: L; domain?: L;
  /** Chapter II: the branch's two hours, an earlier branch, its pillar, and the name of a meeting. */
  hours?: L; other?: Part; earlier?: L; tie?: L;
}

export interface Beat {
  who: "keeper" | "figure" | "voice";
  line: L;
  /** What this one line fills its tokens from, over the leg's own. */
  vars?: Partial<Vars>;
}
export interface Leg {
  spec: LegSpec;
  name: L;
  vars: Vars;
  meet: Beat[];
  choice: Choice | null;
  after: Beat[];
  /** How the reader leaves: the garden grows into the next place, a moon gate, or the walk ends. */
  exit: "grow" | "gate" | "end";
  /** Said once the next place has grown, before the reader walks. */
  arrive?: L;
  /** A second line on the place's title card, and beside its name. */
  sub?: L;
  /** Said on the road as the reader steps into this place through a gate. */
  enter?: L;
}

export const capWords = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
export const signOf = (x: { english: string; hanzi: string }): Part => ({ sign: { en: x.english, han: x.hanzi } });
const TONES: Tone[] = ["day", "dusk", "night", "dawn", "day"];

export function buildStory(p: FourPillars, luckStem: number | null): Leg[] {
  const dm = STEMS[p.dayStem];
  const branch = BRANCHES[p.dayBranch];
  const base: Vars = {
    branch: signOf(branch),
    phase: { en: PHASES[branch.phase].english, zh: PHASES[branch.phase].hanzi },
    quality: { en: branch.quality, zh: branch.qualityZh },
  };
  const legs: Leg[] = [];

  legs.push({
    spec: { env: "garden", tone: "dawn", figure: "keeper" },
    name: KEEPER, vars: base,
    meet: KEEPER_OPEN.map((line) => ({ who: "keeper" as const, line })),
    choice: KEEPER_INVITE, after: [], exit: "grow", arrive: OPENING[branch.phase],
  });

  const stops: { stem: number; env: Phase; frame: "day" | "pillar" | "luck"; pillar?: number }[] = [
    { stem: branch.hiddenStems[0], env: branch.phase, frame: "day" },
    { stem: p.yearStem, env: STEMS[p.yearStem].phase, frame: "pillar", pillar: 0 },
    { stem: p.monthStem, env: STEMS[p.monthStem].phase, frame: "pillar", pillar: 1 },
    { stem: p.hourStem, env: STEMS[p.hourStem].phase, frame: "pillar", pillar: 3 },
  ];
  if (luckStem !== null) stops.push({ stem: luckStem, env: STEMS[luckStem].phase, frame: "luck" });

  const seen = new Set<string>();
  stops.forEach((s, i) => {
    const stem = STEMS[s.stem];
    const god = tenGodOf(dm, stem);
    const kind = god.key as GodKind;
    const sc = GODS[kind];
    const pl = s.pillar === undefined ? null : PILLAR_LABELS[s.pillar];
    const vars: Vars = {
      ...base,
      stem: signOf(stem),
      god: { god: { en: god.english, han: god.hanzi, pinyin: capWords(god.pinyin) } },
      reading: { en: god.reading, zh: god.readingZh },
      pillar: pl ? { en: pl.english, zh: pl.hanzi } : undefined,
      domain: pl ? { en: pl.domain, zh: pl.domainZh } : undefined,
    };
    const fig = (line: L): Beat => ({ who: "figure", line });
    const again = seen.has(kind);
    seen.add(kind);
    const meet: Beat[] = [fig(FRAME[s.frame])];
    const after: Beat[] = [];
    if (again) meet.push(fig(AGAIN));
    else {
      meet.push(fig(READ_AS), ...sc.hard.map(fig));
      after.push(...sc.gift.map(fig));
    }
    if (s.frame === "day") after.push(fig(INTIMACY));
    legs.push({
      spec: { env: s.env, tone: TONES[i % TONES.length], figure: kind, phase: stem.phase },
      name: sc.name, vars, meet, choice: again ? null : sc.choice, after, exit: "gate",
    });
  });

  legs.push({
    spec: { env: "garden", tone: "dusk", figure: "keeper" },
    name: KEEPER, vars: base,
    meet: [{ who: "keeper", line: CLOSE_FIRST }],
    choice: null, after: [], exit: "end",
  });
  return legs;
}

/** The Keeper's last words, which turn on how the reader chose along the road. */
export function closing(tags: Tag[]): L[] {
  const stand = tags.filter((t) => t === "stand").length;
  const room = tags.length - stand;
  const way = stand > room ? "stand" : room > stand ? "room" : "even";
  return [CLOSE_WAY[way], ...CLOSE_LAST];
}

/** A line cut into its words and its tokens, in the language asked for. */
export function parts(line: L, vars: Vars, zh: boolean): Part[] {
  const src = zh ? line.zh : line.en;
  const out: Part[] = [];
  for (const piece of src.split(/(\{[a-z]+\})/)) {
    if (!piece) continue;
    const m = /^\{([a-z]+)\}$/.exec(piece);
    if (!m) { out.push(piece); continue; }
    const v = vars[m[1] as keyof Vars];
    if (v === undefined) out.push("");
    else if (typeof v === "string" || "sign" in v || "god" in v) out.push(v as Part);
    else out.push(zh ? v.zh : v.en);
  }
  return out;
}

const NAME_EN: Record<string, string> = Object.fromEntries([
  ...STEMS.map((s) => [s.hanzi, `${capWords(s.yinyang)} ${capWords(s.phase)}`]),
  ...BRANCHES.map((b) => [b.hanzi, b.animal]),
]);

/** The same line as plain text, for the screen reader and the tests. */
export function plain(ps: Part[], zh: boolean): string {
  return ps.map((x) => {
    if (typeof x === "string") return x;
    if ("sign" in x) return zh ? x.sign.han : `${NAME_EN[x.sign.han]} （${x.sign.han} “${x.sign.en}”）`;
    return zh ? x.god.han : `${x.god.en} （${x.god.han} “${x.god.pinyin}”）`;
  }).join("");
}
