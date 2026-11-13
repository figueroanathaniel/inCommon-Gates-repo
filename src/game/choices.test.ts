import { describe, expect, it } from "vitest";
import type { FourPillars } from "@contracts/bazi";
import { CHOICE_CYCLE, GOD_TURNS, HOURS_INVITE_TURNS, PILLAR_TURNS, ROAD_INVITE_TURNS, turnChoice } from "./choices";
import { GODS, KEEPER_INVITE } from "./script";
import { HOURS_INVITE, PILLAR_CHOICE, buildHours } from "./hours";
import { buildStory } from "./story";

const DASH = new RegExp("[" + String.fromCharCode(8212, 8211) + "]");
const CJK = /[㐀-鿿]/;
const places = [
  { approved: KEEPER_INVITE, turns: ROAD_INVITE_TURNS, tagged: false },
  { approved: HOURS_INVITE, turns: HOURS_INVITE_TURNS, tagged: false },
  ...Object.entries(GOD_TURNS).map(([k, turns]) => ({ approved: GODS[k as keyof typeof GODS].choice, turns, tagged: true })),
  ...PILLAR_TURNS.map((turns, i) => ({ approved: PILLAR_CHOICE[i], turns, tagged: true })),
];
const scenes = places.flatMap((p) => p.turns);

describe("the turning choices", () => {
  it("give every place four families of three, each with a Yang way and a Yin way", () => {
    expect(places.length).toBe(16);
    for (const p of places) {
      expect(p.turns.length).toBe(11);
      for (const s of p.turns) expect(s.length).toBe(5);
    }
    const moments = scenes.map((s) => s[0]);
    expect(new Set(moments).size).toBe(moments.length);
  });

  it("follow the house rules for prose", () => {
    for (const s of scenes) for (const line of s) {
      expect(line.trim().length).toBeGreaterThan(0);
      expect(line).not.toMatch(DASH);
      expect(line).not.toMatch(/[:;{}]/);
      expect(line).not.toMatch(CJK);
      expect(line).not.toMatch(/\b(rather than|instead of|fate|destin|unglamorous)/i);
    }
  });

  it("offer all twelve at a place before any comes round, and never the same family twice running", () => {
    for (const p of places) for (let off = 0; off < 5; off++) {
      const seen = Array.from({ length: CHOICE_CYCLE }, (_, t) => turnChoice(p.approved, p.turns, t + 3, off, p.tagged).prompt.en);
      expect(new Set(seen).size).toBe(CHOICE_CYCLE);
      expect(seen).toContain(p.approved.prompt.en);
      const fam = (t: number) => (((t + off) % CHOICE_CYCLE) + CHOICE_CYCLE) % 4;
      for (let t = 0; t < 30; t++) expect(fam(t)).not.toBe(fam(t + 1));
    }
  });

  it("tag the Yang way stand and the Yin way room, and leave the invitations untagged", () => {
    for (const p of places) for (let t = 0; t < CHOICE_CYCLE; t++) {
      const c = turnChoice(p.approved, p.turns, t, 0, p.tagged);
      if (!p.tagged) expect(c.options.every((o) => o.tag === null)).toBe(true);
      else expect(c.options.map((o) => o.tag).sort()).toEqual(["room", "stand"]);
      if (c !== p.approved) {
        const s = p.turns.find((x) => x[0] === c.prompt.en)!;
        const yang = c.options.find((o) => o.label.en === s[1])!;
        expect(yang.reply.en).toBe(s[2]);
        if (p.tagged) expect(yang.tag).toBe("stand");
      }
    }
  });

  it("keep the approved choices, with their 中文, when the turn is null", () => {
    const p: FourPillars = { yearStem: 0, yearBranch: 0, monthStem: 2, monthBranch: 6, dayStem: 4, dayBranch: 9, hourStem: 6, hourBranch: 3 };
    for (const legs of [buildStory(p, 5, null), buildHours(p, null)]) {
      for (const l of legs) if (l.choice) expect(l.choice.prompt.zh.length).toBeGreaterThan(0);
    }
  });

  it("let one walk show different families at different places, and the next walk move on", () => {
    const p: FourPillars = { yearStem: 1, yearBranch: 3, monthStem: 3, monthBranch: 5, dayStem: 0, dayBranch: 2, hourStem: 8, hourBranch: 8 };
    const a = buildHours(p, 7).map((l) => l.choice?.prompt.en ?? "");
    const b = buildHours(p, 8).map((l) => l.choice?.prompt.en ?? "");
    a.forEach((x, i) => { if (x) expect(x).not.toBe(b[i]); });
    const road = buildStory(p, null, 4).map((l) => l.choice?.prompt.en).filter(Boolean);
    expect(road.length).toBeGreaterThan(2);
  });
});
