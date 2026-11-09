import { describe, expect, it } from "vitest";
import { castPillars, castLuck, isZone } from "./cast";

const GAN = "甲乙丙丁戊己庚辛壬癸";
const ZHI = "子丑寅卯辰巳午未申酉戌亥";
const gz = (s: number, b: number) => GAN[s] + ZHI[b];
const read = (p: ReturnType<typeof castPillars>) =>
  [gz(p.yearStem, p.yearBranch), gz(p.monthStem, p.monthBranch), gz(p.dayStem, p.dayBranch), gz(p.hourStem, p.hourBranch)].join(" ");

describe("casting in the browser", () => {
  it("keeps the day anchor: 2000-01-01 is a 戊午 day", () => {
    expect(read(castPillars(2000, 1, 1, 12, 0, "Asia/Shanghai"))).toBe("己卯 丙子 戊午 戊午");
  });
  it("reads year and month from the instant on the Beijing clock, day and hour from the local clock", () => {
    // 2024-02-04 16:27 Beijing is 立春. One minute before it in New York is still 癸卯 乙丑.
    const before = castPillars(2024, 2, 4, 3, 26, "America/New_York");
    const after = castPillars(2024, 2, 4, 3, 28, "America/New_York");
    expect(gz(before.yearStem, before.yearBranch) + gz(before.monthStem, before.monthBranch)).toBe("癸卯乙丑");
    expect(gz(after.yearStem, after.yearBranch) + gz(after.monthStem, after.monthBranch)).toBe("甲辰丙寅");
    // An evening birth in New York keeps its own day.
    expect(gz(before.dayStem, before.dayBranch)).toBe(gz(after.dayStem, after.dayBranch));
  });
  it("lays out eight luck decades from the month pillar", () => {
    const l = castLuck(2000, 1, 1, 12, 0, "Asia/Shanghai", "m");
    expect(l.decades).toHaveLength(8);
    expect(l.forward).toBe(false); // 己 is a yin year stem; a son runs backward
  });
  it("knows a zone from a typo", () => {
    expect(isZone("America/Puerto_Rico")).toBe(true);
    expect(isZone("Mars/Olympus")).toBe(false);
  });
});
