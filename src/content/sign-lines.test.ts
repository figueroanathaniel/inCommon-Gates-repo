import { describe, expect, it } from "vitest";
import { STEMS, type FourPillars } from "@contracts/bazi";
import { ASK_CYCLE, PHASE_ASKS, closingAsk } from "./sign-lines";

const DASH = new RegExp("[" + String.fromCharCode(8212, 8211) + "]");
const all = Object.values(PHASE_ASKS).flatMap((fams) => fams.flatMap((f) => f.flatMap((v) => [v.yang, v.yin])));

const chart = (dayStem: number, shift: number): FourPillars => ({
  yearStem: (dayStem + shift) % 10, yearBranch: shift % 12, monthStem: (dayStem + 2) % 10, monthBranch: (shift + 3) % 12,
  dayStem, dayBranch: (shift + 5) % 12, hourStem: (dayStem + 7) % 10, hourBranch: (shift + 9) % 12,
});

describe("the closing questions", () => {
  it("hold four families of three variations, each in a Yang and a Yin form, for every phase", () => {
    for (const fams of Object.values(PHASE_ASKS)) {
      expect(fams.length).toBe(4);
      for (const f of fams) {
        expect(f.length).toBe(3);
        for (const v of f) expect(v.yang).not.toBe(v.yin);
      }
    }
    expect(all.length).toBe(5 * 4 * 3 * 2);
    expect(new Set(all).size).toBe(all.length);
  });

  it("follow the house rules for prose", () => {
    for (const q of all) {
      expect(q).not.toMatch(DASH);
      expect(q).not.toMatch(/[:;]/);
      expect(q).not.toMatch(/\b(rather than|instead of|fate|destin)/i);
      expect(q.trim().endsWith("?")).toBe(true);
    }
  });

  it("answer the Day Master's polarity with the matching form", () => {
    for (let s = 0; s < 10; s++) {
      const stem = STEMS[s];
      for (let t = 0; t < ASK_CYCLE; t++) {
        const q = closingAsk(chart(s, 4), t);
        const pool = PHASE_ASKS[stem.phase].flatMap((f) => f.map((v) => (stem.yinyang === "yang" ? v.yang : v.yin)));
        expect(pool).toContain(q);
      }
    }
  });

  it("never repeats a question before all twelve have been asked, and never asks from one family twice running", () => {
    for (let s = 0; s < 10; s++) for (let shift = 0; shift < 12; shift++) {
      const p = chart(s, shift);
      const fams = PHASE_ASKS[STEMS[s].phase];
      const famOf = (q: string) => fams.findIndex((f) => f.some((v) => v.yang === q || v.yin === q));
      const seen = Array.from({ length: ASK_CYCLE }, (_, t) => closingAsk(p, t + 7));
      expect(new Set(seen).size).toBe(ASK_CYCLE);
      for (let t = 1; t < 40; t++) {
        const window = [closingAsk(p, t), closingAsk(p, t + 1), closingAsk(p, t + 2), closingAsk(p, t + 3)].map(famOf);
        expect(new Set(window).size).toBe(4);
      }
    }
  });

  it("keeps one chart's question steady for a given turn", () => {
    const p = chart(3, 6);
    expect(closingAsk(p, 5)).toBe(closingAsk(p, 5));
    expect(closingAsk(p, 5)).toBe(closingAsk(p, 5 + ASK_CYCLE));
  });
});
