import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Solar } from "lunar-javascript";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { charts, masterChart, progress } from "../db/schema";
import { STEMS, BRANCHES, LESSONS } from "@contracts/bazi";

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
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The pillars would not resolve." });
  }
  return {
    yearStem: y.stem, yearBranch: y.branch,
    monthStem: m.stem, monthBranch: m.branch,
    dayStem: d.stem, dayBranch: d.branch,
    hourStem: h.stem, hourBranch: h.branch,
  };
}

const birthInput = z.object({
  label: z.string().trim().min(1).max(120),
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  zone: z.string().trim().min(1).max(64).refine(isZone, "That time zone is not one the house knows."),
});

export const academyRouter = createRouter({
  /** The Stone, visible to every ear, signed in or not. */
  stone: publicQuery.query(async () => {
    const rows = await getDb().select().from(masterChart).limit(1);
    return rows[0] ?? null;
  }),

  /** Inscribe the Stone. Admin only; refused once it stands. */
  inscribeStone: adminQuery.input(birthInput.extend({ note: z.string().max(2000).optional() })).mutation(async ({ input }) => {
    const db = getDb();
    const existing = await db.select().from(masterChart).limit(1);
    if (existing.length > 0) {
      throw new TRPCError({ code: "FORBIDDEN", message: "The Stone already stands. It is inscribed once." });
    }
    const p = castPillars(input.year, input.month, input.day, input.hour, input.minute, input.zone);
    await db.insert(masterChart).values({ label: input.label, note: input.note ?? null, ...p });
    const rows = await db.select().from(masterChart).limit(1);
    return rows[0];
  }),

  /** The student's own marks. */
  myProgress: authedQuery.query(async ({ ctx }) => {
    const rows = await getDb().select().from(progress).where(eq(progress.userId, ctx.user.id));
    return rows.map((r) => ({ lessonId: r.lessonId, completedAt: r.completedAt }));
  }),

  markRead: authedQuery.input(z.object({ lessonId: z.string() })).mutation(async ({ ctx, input }) => {
    const known = (LESSONS as readonly { id: string }[]).some((l) => l.id === input.lessonId);
    if (!known) throw new TRPCError({ code: "BAD_REQUEST", message: "No such scroll." });
    const db = getDb();
    await db
      .insert(progress)
      .values({ userId: ctx.user.id, lessonId: input.lessonId })
      .onDuplicateKeyUpdate({ set: { completedAt: new Date() } });
    return { ok: true };
  }),

  unmarkRead: authedQuery.input(z.object({ lessonId: z.string() })).mutation(async ({ ctx, input }) => {
    await getDb()
      .delete(progress)
      .where(and(eq(progress.userId, ctx.user.id), eq(progress.lessonId, input.lessonId)));
    return { ok: true };
  }),

  /** Charts the student keeps at the Desk. */
  myCharts: authedQuery.query(async ({ ctx }) => {
    return getDb().select().from(charts).where(eq(charts.userId, ctx.user.id));
  }),

  cast: authedQuery.input(birthInput).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const mine = await db.select().from(charts).where(eq(charts.userId, ctx.user.id));
    if (mine.length >= 6) {
      throw new TRPCError({ code: "FORBIDDEN", message: "The Desk keeps six charts at most." });
    }
    const p = castPillars(input.year, input.month, input.day, input.hour, input.minute, input.zone);
    await db.insert(charts).values({
      userId: ctx.user.id,
      label: input.label,
      birthYear: input.year, birthMonth: input.month, birthDay: input.day,
      birthHour: input.hour, birthMinute: input.minute, birthZone: input.zone,
      ...p,
    });
    const rows = await db.select().from(charts).where(eq(charts.userId, ctx.user.id));
    return rows;
  }),

  removeChart: authedQuery.input(z.object({ id: z.number().int() })).mutation(async ({ ctx, input }) => {
    await getDb()
      .delete(charts)
      .where(and(eq(charts.id, input.id), eq(charts.userId, ctx.user.id)));
    return { ok: true };
  }),

  /** Reference data for the desk: stems and branches, unchanged since the beginning. */
  canon: publicQuery.query(() => ({ stems: STEMS, branches: BRANCHES })),
});
