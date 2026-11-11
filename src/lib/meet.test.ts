import { describe, expect, it } from "vitest";
import { BRANCHES, STEMS, type FourPillars } from "@contracts/bazi";
import { castPillars } from "./cast";
import { branchMeetings, crossTies, decadeYears, kindsAgainst, natalSigns, seasonState, stemMeetings, tiesAmong, yearPillar } from "./meet";

const S = (h: string) => STEMS.findIndex((s) => s.hanzi === h);
const B = (h: string) => BRANCHES.findIndex((b) => b.hanzi === h);
const kinds = (ms: { kind: string }[]) => ms.map((m) => m.kind).sort().join(",");

describe("how two signs meet", () => {
  it("combines the five stem pairs into the phase the page names", () => {
    const rows: [string, string, string][] = [["甲", "己", "earth"], ["乙", "庚", "metal"], ["丙", "辛", "water"], ["丁", "壬", "wood"], ["戊", "癸", "fire"]];
    for (const [a, b, phase] of rows) {
      expect(stemMeetings(S(a), S(b))).toEqual([{ kind: "combine", phase }]);
      expect(stemMeetings(S(b), S(a))).toEqual([{ kind: "combine", phase }]);
    }
  });
  it("clashes four stem pairs and no others", () => {
    let n = 0;
    for (let a = 0; a < 10; a++) for (let b = a + 1; b < 10; b++) if (stemMeetings(a, b).some((m) => m.kind === "clash")) n++;
    expect(n).toBe(4);
    expect(kinds(stemMeetings(S("甲"), S("庚")))).toBe("clash");
    expect(stemMeetings(S("戊"), S("甲"))).toEqual([]);
  });
  it("counts six combinations, six clashes, six harms among the branches", () => {
    const count = (k: string) => {
      let n = 0;
      for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) if (branchMeetings(a, b).some((m) => m.kind === k)) n++;
      return n;
    };
    expect(count("combine")).toBe(6);
    expect(count("clash")).toBe(6);
    expect(count("harm")).toBe(6);
    expect(count("punish")).toBe(7);
  });
  it("reads the pairs that name 丑", () => {
    expect(branchMeetings(B("子"), B("丑"))).toEqual([{ kind: "combine", phase: "earth" }]);
    expect(kinds(branchMeetings(B("丑"), B("未")))).toBe("clash,punish");
    expect(kinds(branchMeetings(B("丑"), B("午")))).toBe("harm");
    expect(kinds(branchMeetings(B("丑"), B("戌")))).toBe("punish");
  });
  it("lets a pair be two things at once: 寅巳 harms and punishes, 巳申 combines and punishes", () => {
    expect(kinds(branchMeetings(B("寅"), B("巳")))).toBe("harm,punish");
    expect(kinds(branchMeetings(B("巳"), B("申")))).toBe("combine,punish");
  });
  it("punishes a branch by itself only for 辰 午 酉 亥", () => {
    const self = BRANCHES.filter((b) => branchMeetings(b.index, b.index).length).map((b) => b.hanzi).join("");
    expect(self).toBe("辰午酉亥");
  });
});

describe("the signs of a chart, and what is laid beside them", () => {
  const house: FourPillars = { yearStem: 0, yearBranch: 10, monthStem: 2, monthBranch: 2, dayStem: 0, dayBranch: 10, hourStem: 0, hourBranch: 0 };
  it("finds nothing among 甲戌 丙寅 甲戌 甲子 but what is there", () => {
    expect(tiesAmong(natalSigns(house))).toEqual([]);
  });
  it("completes 寅午戌 when 午 arrives, and names every sign in it", () => {
    const ties = tiesAmong([...natalSigns(house), { key: "luck", hanzi: "運", english: "Decade", stem: S("庚"), branch: B("午"), incoming: true }]);
    const trio = ties.filter((t) => t.kind === "harmony");
    expect(trio).toHaveLength(1);
    expect(trio[0].phase).toBe("fire");
    expect(trio[0].members.map((m) => m.char).join("")).toBe("寅午戌");
    expect(trio[0].incoming).toBe(true);
    /* 庚 clashes each 甲, and 午 clashes 子. */
    expect(ties.filter((t) => t.kind === "clash" && t.layer === "stem")).toHaveLength(3);
    expect(ties.filter((t) => t.kind === "clash" && t.layer === "branch")).toHaveLength(1);
  });
  it("lists each kind once for a year set against the birth", () => {
    expect(kindsAgainst(house, S("庚"), B("午"))).toEqual(["clash", "harmony"]);
    expect(kindsAgainst(house, S("乙"), B("酉"))).toEqual(["harm"]);
  });
});

describe("the year and the season", () => {
  it("agrees with the casting on the pillar of each year, read in midsummer", () => {
    for (const y of [1900, 1984, 1999, 2024, 2026, 2060]) {
      const p = castPillars(y, 7, 1, 12, 0, "Asia/Shanghai");
      expect(yearPillar(y)).toEqual({ stem: p.yearStem, branch: p.yearBranch });
    }
  });
  it("gives a decade its ten years", () => {
    expect(decadeYears("2019-08-17")).toEqual([2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]);
    expect(decadeYears("")).toEqual([]);
  });
  it("reads spring as wood 旺, fire 相, water 休, metal 囚, earth 死", () => {
    const m = B("寅");
    expect([seasonState(m, "wood"), seasonState(m, "fire"), seasonState(m, "water"), seasonState(m, "metal"), seasonState(m, "earth")])
      .toEqual(["wang", "xiang", "xiu", "qiu", "si"]);
  });
  it("reads the four earth months as earth 旺", () => {
    for (const h of ["辰", "未", "戌", "丑"]) expect(seasonState(B(h), "earth")).toBe("wang");
    expect(seasonState(B("辰"), "metal")).toBe("xiang");
    expect(seasonState(B("辰"), "wood")).toBe("qiu");
  });
});

describe("two charts set side by side", () => {
  const chart = (c: string): FourPillars => ({
    yearStem: S(c[0]), yearBranch: B(c[1]), monthStem: S(c[2]), monthBranch: B(c[3]),
    dayStem: S(c[4]), dayBranch: B(c[5]), hourStem: S(c[6]), hourBranch: B(c[7]),
  });
  it("keeps only meetings that take a sign from each chart", () => {
    /* The teacher clashes within itself (子午) and that is not listed. */
    const ties = crossTies(chart("甲子甲午甲子甲午"), chart("丙辰丙辰丙辰丙辰"));
    for (const t of ties) {
      expect(t.members.some((m) => m.sign.startsWith("t-"))).toBe(true);
      expect(t.members.some((m) => m.sign.startsWith("s-"))).toBe(true);
    }
    expect(ties.some((t) => t.kind === "clash")).toBe(false);
  });
  it("finds the stem combination and the branch clash between them", () => {
    const ties = crossTies(chart("甲子丙辰丙辰丙辰"), chart("己午丙辰丙辰丙辰"));
    const pair = (t: { members: { sign: string }[] }) => t.members.map((m) => m.sign).join(" ");
    expect(ties.find((t) => t.kind === "combine" && t.layer === "stem" && pair(t) === "t-year s-year")?.phase).toBe("earth");
    expect(ties.some((t) => t.kind === "clash" && t.layer === "branch" && pair(t) === "t-year s-year")).toBe(true);
  });
  it("names a three harmony only when the two charts complete it together", () => {
    const together = crossTies(chart("甲寅甲午丙辰丙辰"), chart("丙戌丙辰丙辰丙辰")).filter((t) => t.kind === "harmony" && t.phase === "fire");
    expect(together).toHaveLength(1);
    expect(together[0].members.map((m) => m.char).join("")).toBe("寅午戌");
    const alone = crossTies(chart("甲寅甲午甲戌丙辰"), chart("丙戌丙辰丙辰丙辰")).filter((t) => t.kind === "harmony" && t.phase === "fire");
    expect(alone).toHaveLength(0);
  });
});
