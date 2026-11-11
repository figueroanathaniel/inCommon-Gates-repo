/*
  命盤 The Destiny Chart, the one chart set at the centre of the hall.

  It is laid out once, so it ships as data rather than living in a table.
  The birth it was cast from is not in this file: the pillars and the luck
  decades are what the Academy shows, and each decade carries only the month
  it opens, which is what deciding the current one needs.

  Cast 9 November 2026 with src/lib/cast.ts from the house's own birth
  record. To lay out a different chart, cast it the same way and replace the
  values below.
*/

export interface StoneDecade { stem: number; branch: number; ageYears: number; ageMonths: number; opens: string }

const DECADES: StoneDecade[] = [
  { stem: 3, branch: 3, ageYears: 5, ageMonths: 6, opens: "1999-08" },
  { stem: 4, branch: 4, ageYears: 15, ageMonths: 6, opens: "2009-08" },
  { stem: 5, branch: 5, ageYears: 25, ageMonths: 6, opens: "2019-08" },
  { stem: 6, branch: 6, ageYears: 35, ageMonths: 6, opens: "2029-08" },
  { stem: 7, branch: 7, ageYears: 45, ageMonths: 6, opens: "2039-08" },
  { stem: 8, branch: 8, ageYears: 55, ageMonths: 6, opens: "2049-08" },
  { stem: 9, branch: 9, ageYears: 65, ageMonths: 6, opens: "2059-08" },
  { stem: 0, branch: 10, ageYears: 75, ageMonths: 6, opens: "2069-08" },
];

export function stoneChart(now = new Date()) {
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let current: number | null = null;
  DECADES.forEach((d, i) => { if (d.opens <= ym) current = i; });
  return {
    id: 1,
    label: "The Chart of the House",
    labelZh: "書院之盤",
    note: null as string | null,
    yearStem: 0, yearBranch: 10, monthStem: 2, monthBranch: 2,
    dayStem: 0, dayBranch: 10, hourStem: 0, hourBranch: 0,
    luck: {
      forward: true,
      start: { years: 5, months: 6, days: 10, hours: 0 },
      current,
      decades: DECADES.map(({ opens: _opens, ...d }) => d),
    },
  };
}
