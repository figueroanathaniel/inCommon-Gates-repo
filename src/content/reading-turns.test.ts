import { describe, expect, it } from "vitest";
import * as T from "./reading-turns";
import { censusLines, domainLines, godLines, seasonLines } from "@/lib/reading";
import type { FourPillars } from "@contracts/bazi";

const trees: [string, T.Tree<any>, any][] = [
  ["HEAVY", T.HEAVY, { P: "Wood", n: 3 }],
  ["ABSENT", T.ABSENT, { L: "Metal" }],
  ["ONCE", T.ONCE, { L: "Fire" }],
  ["ALL_FIVE", T.ALL_FIVE, {}],
  ["DAY_MASTER", T.DAY_MASTER, { dm: "Jiǎ", yy: "yang", p: "wood", q: "the great tree" }],
  ...(Object.entries(T.SEASON).map(([k, t]) => [`SEASON.${k}`, t, { m: "Yín", mph: "wood", dph: "fire", decree: "the month's decree" }]) as [string, T.Tree<any>, any][]),
  ["GOD", T.GOD, { pl: "year pillar", G: "Companion", reading: "shoulder to shoulder", domain: "ancestry" }],
  ["GOD_TWICE", T.GOD_TWICE, { G: "Companion" }],
  ["GROUND", T.GROUND, { pl: "year pillar", S: "Jiǎ", sq: "the great tree", A: "Rat", B: "Zǐ", bq: "the deep hour", domain: "ancestry" }],
  ["DAY_GROUND", T.DAY_GROUND, { pl: "day pillar", S: "Jiǎ", sq: "the great tree", A: "Rat", B: "Zǐ", bq: "the deep hour", domain: "the self" }],
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

  it.each(trees)("%s gives all 36 of one polarity before any repeats", (_n, t, ctx) => {
    for (const yy of ["yang", "yin"] as const) {
      const seen = new Set<string>();
      for (let turn = 0; turn < T.TURN_CYCLE; turn++) seen.add(T.say(t, ctx, yy, turn));
      expect(seen.size).toBe(36);
    }
  });
});

const chart: FourPillars = { yearStem: 0, yearBranch: 10, monthStem: 2, monthBranch: 2, dayStem: 0, dayBranch: 10, hourStem: 0, hourBranch: 0 };

describe("the reading turns", () => {
  it("turn 0 keeps the wording that shipped before", () => {
    expect(censusLines(chart)[0].startsWith("Wood is the heaviest phase in this chart. It appears")).toBe(true);
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
    for (const fn of [censusLines, seasonLines, domainLines, godLines]) {
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
