import { describe, expect, it } from "vitest";
import * as T from "./reading-turns";
import { phaseLines, domainLines, godLines, seasonLines } from "@/lib/reading";
import type { FourPillars } from "@contracts/bazi";

const trees: [string, T.Tree<any>, any][] = [
  ["HEAVY", T.HEAVY, { P: "Wood", n: 3, k: "wood" }],
  ["ABSENT", T.ABSENT, { L: "Metal", k: "metal" }],
  ["ONCE", T.ONCE, { L: "Fire", k: "fire" }],
  ["ALL_FIVE", T.ALL_FIVE, {}],
  ["DAY_MASTER", T.DAY_MASTER, { dm: "Jiǎ", yy: "yang", p: "wood", q: "the great tree" }],
  ...(Object.entries(T.SEASON).map(([k, t]) => [`SEASON.${k}`, t, { m: "Yín", mph: "wood", dph: "fire", decree: "the month's decree", dk: "fire" }]) as [string, T.Tree<any>, any][]),
  ["GOD", T.GOD, { pl: "year pillar", G: "Companion", reading: "shoulder to shoulder", domain: "ancestry", ph: "wood" }],
  ["GOD_TWICE", T.GOD_TWICE, { G: "Companion" }],
  ["GROUND", T.GROUND, { pl: "year pillar", S: "Jiǎ", sq: "the great tree", A: "Rat", B: "Zǐ", bq: "the deep hour", domain: "ancestry", ph: "wood" }],
  ["DAY_GROUND", T.DAY_GROUND, { pl: "day pillar", S: "Jiǎ", sq: "the great tree", A: "Rat", B: "Zǐ", bq: "the deep hour", domain: "the self", ph: "wood" }],
  ["READ_FROM", T.READ_FROM, { dm: "Jiǎ" }],
  ["RESTS", T.RESTS, {}],
  ["STONE_INTRO", T.STONE_INTRO, {}],
];

describe("the Destiny Chart's phrase trees", () => {
  it.each(trees)("%s has 3 x 4 x 3 x 2 = 72 distinct leaves", (_n, t, ctx) => {
    expect(t.a).toHaveLength(3);
    expect(t.b).toHaveLength(4);
    expect(t.c).toHaveLength(3);
    expect(new Set(T.leaves(t, ctx)).size).toBe(72);
  });

  it.each(trees)("%s gives all 36 of one voice before any repeats", (_n, t, ctx) => {
    for (const yy of ["yang", "yin"] as const) {
      const seen = new Set<string>();
      for (let turn = 0; turn < T.TURN_CYCLE; turn++) seen.add(T.say(t, ctx, yy, turn));
      expect(seen.size).toBe(36);
    }
  });

  it.each(trees)("%s says b1 nine different ways", (_n, t, ctx) => {
    expect(new Set(T.b1Forms(t, ctx)).size).toBe(9);
  });

  it.each(trees)("%s never says b1 the same way twice in one cycle", (_n, t, ctx) => {
    const forms = T.b1Forms(t, ctx);
    for (const salt of [0, 1, 2, 3]) {
      const used: string[] = [];
      for (let turn = 0; turn < T.TURN_CYCLE; turn++) {
        const line = T.say(t, ctx, "yang", turn, salt);
        const f = forms.find((b) => line.includes(b));
        if (f) used.push(f);
      }
      expect(used).toHaveLength(9);
      expect(new Set(used).size).toBe(9);
    }
  });
});

describe("the reading's voice", () => {
  const banned = /tradition|tends? to|appear|this chart|old reckoning|\byou are\b/i;
  it.each(trees)("%s speaks to you, warmly, with none of the retired phrasing", (_n, t, ctx) => {
    const all = [...T.leaves(t, ctx), ...T.b1Forms(t, ctx)];
    for (const line of all) expect(line).not.toMatch(banned);
  });
});

const chart: FourPillars = { yearStem: 0, yearBranch: 10, monthStem: 2, monthBranch: 2, dayStem: 0, dayBranch: 10, hourStem: 0, hourBranch: 0 };

describe("the reading turns", () => {
  it("turn 0 opens on the heaviest phase", () => {
    expect(phaseLines(chart)[0].startsWith("Wood is the heaviest phase in your chart, holding")).toBe(true);
  });

  it("no two pillar lines in one reading share an opening or a close", () => {
    for (let turn = 0; turn < T.TURN_CYCLE; turn++) {
      const g = godLines(chart, undefined, turn).slice(0, 3);
      const d = domainLines(chart, undefined, turn).filter((_, i) => i !== 2);
      for (const set of [g, d]) {
        expect(new Set(set.map((l) => l.split(" ").slice(0, 2).join(" "))).size).toBe(set.length);
        expect(new Set(set.map((l) => l.split(". ").slice(-2).join(". "))).size).toBe(set.length);
      }
    }
  });

  it("each line changes from one opening to the next", () => {
    for (const fn of [phaseLines, seasonLines, domainLines, godLines]) {
      for (let turn = 0; turn < T.TURN_CYCLE; turn++) {
        const now = fn(chart, undefined, turn);
        const next = fn(chart, undefined, turn + 1);
        now.forEach((line, i) => {
          expect(line).not.toBe(next[i]);
          // the opening sentence changes every turn too
          expect(line.split(". ")[0]).not.toBe(next[i].split(". ")[0]);
        });
      }
    }
  });
});
