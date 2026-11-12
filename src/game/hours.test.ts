import { describe, expect, it } from "vitest";
import { BRANCHES, type FourPillars } from "@contracts/bazi";
import { branchMeetings } from "../lib/meet";
import { parts, plain, type Beat, type Leg } from "./story";
import { B_MEET, B_REPEAT, HOURS_INVITE, buildHours, closingHours, toneOfHour } from "./hours";
import type { L } from "./script";

const DASH = new RegExp("[" + String.fromCharCode(8212, 8211) + "]");
const CJK = /[㐀-鿿]/;
const LATIN = /[A-Za-z]/;

/** Every line of a leg with what fills its tokens. */
function lines(leg: Leg): Beat[] {
  const plainLine = (line: L): Beat => ({ who: "voice", line });
  const out: Beat[] = [plainLine(leg.name), ...leg.meet, ...leg.after];
  for (const l of [leg.arrive, leg.sub, leg.enter]) if (l) out.push(plainLine(l));
  if (leg.choice) {
    out.push(plainLine(leg.choice.prompt));
    for (const o of leg.choice.options) out.push(plainLine(o.label), plainLine(o.reply));
  }
  return out;
}

const chart = (s: number, b: number): FourPillars => ({
  yearStem: (s + 3) % 10, yearBranch: (b + 5) % 12, monthStem: (s + 6) % 10, monthBranch: (b + 2) % 12,
  dayStem: s, dayBranch: b, hourStem: (s + 9) % 10, hourBranch: (b + 7) % 12,
});

describe("the hours of a chart", () => {
  it("reads cleanly in both languages for every day pillar", () => {
    let seen = 0;
    for (let s = 0; s < 10; s++) for (let b = 0; b < 12; b++) {
      if ((s + b) % 2) continue;
      const legs = buildHours(chart(s, b));
      expect(legs.length).toBe(6);
      expect(legs[0].exit).toBe("grow");
      expect(legs[5].exit).toBe("end");
      const closing = closingHours(["stand", "room"]).map((line): Beat => ({ who: "keeper", line }));
      for (const leg of legs) for (const beat of [...lines(leg), ...closing]) {
        for (const zh of [false, true]) {
          const ps = parts(beat.line, { ...leg.vars, ...beat.vars }, zh);
          const prose = ps.filter((x) => typeof x === "string").join("");
          const whole = plain(ps, zh);
          expect(whole).not.toMatch(/\{|\}|undefined|\[object/);
          expect(whole).not.toMatch(DASH);
          expect(ps.every((x) => x !== "")).toBe(true);
          expect(whole.trim().length).toBeGreaterThan(0);
          if (zh) { expect(prose).not.toMatch(LATIN); expect(whole).not.toMatch(LATIN); }
          else expect(prose).not.toMatch(CJK);
          seen++;
        }
      }
    }
    expect(seen).toBeGreaterThan(1500);
  });

  it("walks the year, month, day and hour branches in order, each at its own hour", () => {
    const p: FourPillars = { yearStem: 0, yearBranch: 0, monthStem: 2, monthBranch: 6, dayStem: 4, dayBranch: 9, hourStem: 6, hourBranch: 3 };
    const legs = buildHours(p);
    const want = [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch];
    want.forEach((bi, i) => {
      const leg = legs[i + 1];
      expect(leg.spec.figure).toBe("animal");
      expect(leg.spec.animal).toBe(bi);
      expect(leg.spec.env).toBe(BRANCHES[bi].phase);
      expect(leg.spec.hour).toBe((bi * 2) % 24);
      expect(leg.spec.tone).toBe(toneOfHour(bi));
    });
    expect(legs[0].spec.tone).toBe("night");
    expect(legs[5].spec.tone).toBe("dawn");
  });

  it("names every meeting between the branches walked, and nothing else", () => {
    for (let s = 0; s < 10; s++) for (let b = 0; b < 12; b++) {
      const p = chart(s, b);
      const walked = [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch];
      const legs = buildHours(p);
      let want = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < i; j++) want += branchMeetings(walked[j], walked[i]).length;
      const got = legs.flatMap((l) => l.after).filter((x) => x.line === B_MEET).length;
      expect(got).toBe(want);
    }
  });

  it("does not repeat what a branch carries when the chart holds it twice", () => {
    const legs = buildHours({ yearStem: 0, yearBranch: 4, monthStem: 2, monthBranch: 4, dayStem: 4, dayBranch: 0, hourStem: 6, hourBranch: 2 });
    expect(legs[1].meet.some((x) => x.line === B_REPEAT)).toBe(false);
    expect(legs[2].meet.some((x) => x.line === B_REPEAT)).toBe(true);
  });

  it("lets the Keeper's last words turn on how the walker chose", () => {
    const a = closingHours(["stand", "stand", "room"])[0].en;
    const b = closingHours(["room", "room", "stand"])[0].en;
    const c = closingHours([])[0].en;
    expect(new Set([a, b, c]).size).toBe(3);
    expect(HOURS_INVITE.options.every((o) => o.tag === null)).toBe(true);
  });
});
