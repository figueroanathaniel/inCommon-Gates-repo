import { Solar } from "lunar-javascript";

/*
  The casting, done in the browser. It was the Academy's server code until
  the Academy became a branch of inCommon's own site (9 November 2026) and is
  unchanged: the year and the month are read from the birth instant on the
  Beijing clock, the day and the hour from the local wall clock.
*/

const GAN = "甲乙丙丁戊己庚辛壬癸";
const ZHI = "子丑寅卯辰巳午未申酉戌亥";

/**
 * Minutes east of UTC that `zone` kept at the instant `utcMs`.
 * Asked of Intl, because daylight rules have changed by country and by year.
 */
function zoneOffsetMin(zone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const v = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(v("year"), v("month") - 1, v("day"), v("hour"), v("minute"), v("second"));
  return Math.round((asUtc - utcMs) / 60000);
}

/** The UTC instant of a wall clock time in `zone`. Asked twice, since the offset depends on the instant. */
function wallToUtc(zone: string, y: number, mo: number, d: number, h: number, mi: number): number {
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let t = wall - zoneOffsetMin(zone, wall) * 60000;
  t = wall - zoneOffsetMin(zone, t) * 60000;
  return t;
}

export function isZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/**
 * The eight characters of a birth.
 *
 * lunar-javascript reads every clock it is given as Beijing time (UTC+8).
 * The year and the month turn at solar terms, which are instants, so they
 * are read from the birth instant carried to UTC+8. The day and the hour
 * belong to the clock where the birth happened, so they are read from the
 * local wall time. A birth in New York near a solar term then takes the
 * month it was actually born in, and an evening birth there keeps its own day.
 */
export function castPillars(year: number, month: number, day: number, hour: number, minute: number, zone = "Asia/Shanghai") {
  const utc = wallToUtc(zone, year, month, day, hour, minute);
  const cn = new Date(utc + 8 * 3600000);
  const ecCn = Solar.fromYmdHms(cn.getUTCFullYear(), cn.getUTCMonth() + 1, cn.getUTCDate(), cn.getUTCHours(), cn.getUTCMinutes(), 0)
    .getLunar().getEightChar();
  const ecLocal = Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getEightChar();
  const pair = (ganzhi: string) => ({
    stem: GAN.indexOf(ganzhi.charAt(0)),
    branch: ZHI.indexOf(ganzhi.charAt(1)),
  });
  const y = pair(ecCn.getYear());
  const m = pair(ecCn.getMonth());
  const d = pair(ecLocal.getDay());
  const h = pair(ecLocal.getTime());
  if ([y, m, d, h].some((p) => p.stem < 0 || p.branch < 0)) {
    throw new Error("The pillars would not resolve.");
  }
  return {
    yearStem: y.stem, yearBranch: y.branch,
    monthStem: m.stem, monthBranch: m.branch,
    dayStem: d.stem, dayBranch: d.branch,
    hourStem: h.stem, hourBranch: h.branch,
  };
}

export type BirthSex = "m" | "f";

export interface LuckDecade {
  stem: number;
  branch: number;
  /** Age at which the decade opens, in whole years and months. */
  ageYears: number;
  ageMonths: number;
  /** The local calendar day it opens, YYYY-MM-DD. */
  from: string;
}

export interface LuckPillars {
  forward: boolean;
  /** Time from birth to the first decade, in the old count of three days to the year. */
  start: { years: number; months: number; days: number; hours: number };
  decades: LuckDecade[];
}

/**
 * 大運, the luck pillars. They step from the month pillar, forward for a yang
 * year stem with a son or a yin year stem with a daughter, backward for the
 * other two. The first decade opens after the distance from birth to the
 * next jie (forward) or back to the last one (backward), three days of
 * distance counted as a year of life, one day as four months.
 *
 * The year stem, the month pillar and the jie are all read from the birth
 * instant on the Beijing clock, as castPillars reads the year and month, so
 * the decades rise from the same month pillar the chart shows. lunar-javascript
 * is asked for the exact count (its sect 2, by minutes) rather than the count
 * by double hours.
 */
export function castLuck(
  year: number, month: number, day: number, hour: number, minute: number,
  zone: string, sex: BirthSex, count = 8,
): LuckPillars {
  const utc = wallToUtc(zone, year, month, day, hour, minute);
  const cn = new Date(utc + 8 * 3600000);
  const ec = Solar.fromYmdHms(cn.getUTCFullYear(), cn.getUTCMonth() + 1, cn.getUTCDate(), cn.getUTCHours(), cn.getUTCMinutes(), 0)
    .getLunar().getEightChar();
  const yun = ec.getYun(sex === "m" ? 1 : 0, 2);
  const start = { years: yun.getStartYear(), months: yun.getStartMonth(), days: yun.getStartDay(), hours: yun.getStartHour() };
  const decades: LuckDecade[] = yun.getDaYun(count + 1).slice(1).map((d, i) => {
    const gz = d.getGanZhi();
    const stem = GAN.indexOf(gz.charAt(0));
    const branch = ZHI.indexOf(gz.charAt(1));
    if (stem < 0 || branch < 0) {
      throw new Error("The luck pillars would not resolve.");
    }
    /* Counted on the birth's own calendar: the age is added to the local birth day. */
    const opens = new Date(Date.UTC(year + start.years + 10 * i, month - 1 + start.months, day + start.days, hour + start.hours, minute));
    const from = `${opens.getUTCFullYear()}-${String(opens.getUTCMonth() + 1).padStart(2, "0")}-${String(opens.getUTCDate()).padStart(2, "0")}`;
    return { stem, branch, ageYears: start.years + 10 * i, ageMonths: start.months, from };
  });
  return { forward: yun.isForward(), start, decades };
}

/** The luck pillars of a stored row, or null when the row lacks the zone or the sex at birth. */
export function luckOf(r: {
  birthYear: number | null; birthMonth: number | null; birthDay: number | null;
  birthHour: number | null; birthMinute: number | null; birthZone: string | null; birthSex: string | null;
}): (LuckPillars & { current: number | null }) | null {
  if (r.birthYear == null || r.birthMonth == null || r.birthDay == null || r.birthHour == null || r.birthMinute == null) return null;
  if (!r.birthZone || !isZone(r.birthZone)) return null;
  if (r.birthSex !== "m" && r.birthSex !== "f") return null;
  const luck = castLuck(r.birthYear, r.birthMonth, r.birthDay, r.birthHour, r.birthMinute, r.birthZone, r.birthSex);
  /* Which decade is open today, by the birth's own calendar. */
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: r.birthZone }).format(new Date());
  let current: number | null = null;
  luck.decades.forEach((d, i) => { if (d.from <= today) current = i; });
  return { ...luck, current };
}

