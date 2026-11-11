import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { LESSONS } from "@contracts/bazi";
import { castPillars, isZone, luckOf } from "@/lib/cast";
import { cloud, currentReader, type Reader } from "@/lib/cloud";
import { stoneChart } from "@/lib/stone";
import { dropTeacherRecord } from "@/lib/teacher";
import { cleanCode, makeCode } from "@/lib/share";

/*
  The Academy's data, with no server of its own.

  A reader signed in to inCommon keeps their charts and their marks on their
  inCommon account (tables bazi_charts and bazi_progress, row level security,
  their own rows only). A guest keeps them on this device and nowhere else.
  A signed in reader may share one chart with a teacher (table bazi_shares):
  the teacher then reads that chart, and the reading marks if the student
  says so, and nothing else. Because of that, every read of the reader's own
  rows names user_id: row level security also returns what was shared.
  The Stone is data in the bundle. Lessons and the canon were always static.
*/

const CHARTS_KEY = "incommon.bazi.charts.v1";
const PROGRESS_KEY = "incommon.bazi.progress.v1";
export const MAX_CHARTS = 24;

export type Who = (Reader & { guest: false }) | { id: "guest"; name: "Guest"; email: null; guest: true };

export interface ChartRow {
  id: number;
  label: string;
  birthYear: number; birthMonth: number; birthDay: number; birthHour: number; birthMinute: number;
  birthZone: string; birthSex: "m" | "f" | null;
  yearStem: number; yearBranch: number; monthStem: number; monthBranch: number;
  dayStem: number; dayBranch: number; hourStem: number; hourBranch: number;
  createdAt: string;
}

const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    throw new Error("This device would not keep it. Private browsing can refuse storage.");
  }
};
/**
 * Who is reading. A reader signed in to inCommon is signed in here on arrival;
 * everybody else reads as a guest on this device. The Academy has no door of
 * its own: signing in and out is inCommon's.
 */
async function who(): Promise<Who> {
  const r = await currentReader();
  if (r) return { ...r, guest: false };
  return { id: "guest", name: "Guest", email: null, guest: true };
}

/* Rows as the database holds them. */
type Db = Record<string, unknown>;
const fromDb = (r: Db): ChartRow => ({
  id: Number(r.id), label: String(r.label),
  birthYear: r.birth_year as number, birthMonth: r.birth_month as number, birthDay: r.birth_day as number,
  birthHour: r.birth_hour as number, birthMinute: r.birth_minute as number,
  birthZone: r.birth_zone as string, birthSex: (r.birth_sex as "m" | "f" | null) ?? null,
  yearStem: r.year_stem as number, yearBranch: r.year_branch as number,
  monthStem: r.month_stem as number, monthBranch: r.month_branch as number,
  dayStem: r.day_stem as number, dayBranch: r.day_branch as number,
  hourStem: r.hour_stem as number, hourBranch: r.hour_branch as number,
  createdAt: String(r.created_at),
});

const refused = (e: { message?: string } | null) => {
  if (e) throw new Error("The house could not reach your account just now. Try again in a moment.");
};

export interface BirthInput {
  label: string; year: number; month: number; day: number; hour: number; minute: number;
  zone: string; sex?: "m" | "f" | null;
}

function checked(input: BirthInput) {
  const label = input.label.trim().slice(0, 120);
  const ok =
    label.length > 0 &&
    Number.isInteger(input.year) && input.year >= 1900 && input.year <= 2100 &&
    Number.isInteger(input.month) && input.month >= 1 && input.month <= 12 &&
    Number.isInteger(input.day) && input.day >= 1 && input.day <= 31 &&
    Number.isInteger(input.hour) && input.hour >= 0 && input.hour <= 23 &&
    Number.isInteger(input.minute) && input.minute >= 0 && input.minute <= 59;
  if (!ok) throw new Error("That birth does not read as a date and a time the house can cast.");
  if (!isZone(input.zone)) throw new Error("That time zone is not one the house knows.");
  return { ...input, label };
}

const store = {
  async charts(w: Who): Promise<ChartRow[]> {
    if (w.guest) return read<ChartRow[]>(CHARTS_KEY, []);
    const { data, error } = await cloud().from("bazi_charts").select("*").eq("user_id", w.id).order("id");
    refused(error);
    return (data ?? []).map(fromDb);
  },
  async cast(w: Who, raw: BirthInput) {
    const input = checked(raw);
    const mine = await store.charts(w);
    if (mine.length >= MAX_CHARTS) throw new Error("The Desk keeps twenty four charts at most.");
    const p = castPillars(input.year, input.month, input.day, input.hour, input.minute, input.zone);
    if (w.guest) {
      const id = mine.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      write(CHARTS_KEY, [...mine, {
        id, label: input.label,
        birthYear: input.year, birthMonth: input.month, birthDay: input.day, birthHour: input.hour, birthMinute: input.minute,
        birthZone: input.zone, birthSex: input.sex ?? null, ...p, createdAt: new Date().toISOString(),
      } satisfies ChartRow]);
      return;
    }
    const { error } = await cloud().from("bazi_charts").insert({
      label: input.label,
      birth_year: input.year, birth_month: input.month, birth_day: input.day,
      birth_hour: input.hour, birth_minute: input.minute, birth_zone: input.zone, birth_sex: input.sex ?? null,
      year_stem: p.yearStem, year_branch: p.yearBranch, month_stem: p.monthStem, month_branch: p.monthBranch,
      day_stem: p.dayStem, day_branch: p.dayBranch, hour_stem: p.hourStem, hour_branch: p.hourBranch,
    });
    refused(error);
  },
  async setSex(w: Who, id: number, sex: "m" | "f" | null) {
    if (w.guest) {
      write(CHARTS_KEY, read<ChartRow[]>(CHARTS_KEY, []).map((c) => (c.id === id ? { ...c, birthSex: sex } : c)));
      return;
    }
    const { error } = await cloud().from("bazi_charts").update({ birth_sex: sex }).eq("user_id", w.id).eq("id", id);
    refused(error);
  },
  async remove(w: Who, id: number) {
    if (w.guest) {
      write(CHARTS_KEY, read<ChartRow[]>(CHARTS_KEY, []).filter((c) => c.id !== id));
      dropTeacherRecord(w.id, id);
      return;
    }
    const { error } = await cloud().from("bazi_charts").delete().eq("user_id", w.id).eq("id", id);
    refused(error);
    dropTeacherRecord(w.id, id);
  },
  async progress(w: Who): Promise<{ lessonId: string; completedAt: string }[]> {
    if (w.guest) return read(PROGRESS_KEY, []);
    const { data, error } = await cloud().from("bazi_progress").select("lesson_id, completed_at").eq("user_id", w.id);
    refused(error);
    return (data ?? []).map((r) => ({ lessonId: String(r.lesson_id), completedAt: String(r.completed_at) }));
  },
  async mark(w: Who, lessonId: string) {
    if (!(LESSONS as readonly { id: string }[]).some((l) => l.id === lessonId)) throw new Error("No such scroll.");
    const at = new Date().toISOString();
    if (w.guest) {
      const rest = read<{ lessonId: string; completedAt: string }[]>(PROGRESS_KEY, []).filter((p) => p.lessonId !== lessonId);
      write(PROGRESS_KEY, [...rest, { lessonId, completedAt: at }]);
      return;
    }
    const { error } = await cloud().from("bazi_progress").upsert({ lesson_id: lessonId, completed_at: at }, { onConflict: "user_id,lesson_id" });
    refused(error);
  },
  async unmark(w: Who, lessonId: string) {
    if (w.guest) {
      write(PROGRESS_KEY, read<{ lessonId: string }[]>(PROGRESS_KEY, []).filter((p) => p.lessonId !== lessonId));
      return;
    }
    const { error } = await cloud().from("bazi_progress").delete().eq("user_id", w.id).eq("lesson_id", lessonId);
    refused(error);
  },
};

/* ---- 呈師 sharing a chart with a teacher ---- */

/** A share the reader made of one of their own charts. */
export interface Offer {
  id: number; chartId: number;
  /** The code, until a teacher takes it up. */
  code: string | null;
  taken: boolean; withProgress: boolean; expiresAt: string;
}
/** A student's chart a teacher holds, with the scrolls the student has read when they share them. */
export interface Held { shareId: number; chart: ChartRow; read: string[] | null }
export interface Shares {
  /** False for a guest, and where the account has no sharing yet. */
  on: boolean;
  offers: Offer[];
  held: Held[];
}
const NO_SHARES: Shares = { on: false, offers: [], held: [] };

/** The account answers that it has no such table or function: sharing is not set up there yet. */
const absent = (e: { code?: string; message?: string } | null) =>
  !!e && (e.code === "42P01" || e.code === "PGRST205" || e.code === "PGRST202" || e.code === "42883");

const shares = {
  async all(w: Who): Promise<Shares> {
    if (w.guest) return NO_SHARES;
    const db = cloud();
    const rows = await db.from("bazi_shares").select("id, owner_id, chart_id, code, teacher_id, with_progress, expires_at").order("id");
    if (absent(rows.error)) return NO_SHARES;
    refused(rows.error);
    const all = (rows.data ?? []) as Db[];
    const offers: Offer[] = all.filter((r) => r.owner_id === w.id).map((r) => ({
      id: Number(r.id), chartId: Number(r.chart_id), code: (r.code as string | null) ?? null,
      taken: r.teacher_id != null, withProgress: r.with_progress === true, expiresAt: String(r.expires_at),
    }));
    const mine = all.filter((r) => r.teacher_id === w.id);
    if (mine.length === 0) return { on: true, offers, held: [] };
    const charts = await db.from("bazi_charts").select("*").neq("user_id", w.id).order("id");
    refused(charts.error);
    const marks = await db.from("bazi_progress").select("user_id, lesson_id").neq("user_id", w.id);
    refused(marks.error);
    const held: Held[] = [];
    for (const c of (charts.data ?? []) as Db[]) {
      const sh = mine.find((r) => Number(r.chart_id) === Number(c.id));
      if (!sh) continue;
      held.push({
        shareId: Number(sh.id), chart: fromDb(c),
        read: sh.with_progress === true
          ? ((marks.data ?? []) as Db[]).filter((m) => m.user_id === sh.owner_id).map((m) => String(m.lesson_id))
          : null,
      });
    }
    return { on: true, offers, held };
  },
  async offer(w: Who, chartId: number, withProgress: boolean) {
    if (w.guest) throw new Error("Sharing a chart needs an inCommon account.");
    const { error } = await cloud().from("bazi_shares").insert({ chart_id: chartId, code: makeCode(), with_progress: withProgress });
    if (error && /bazi_shares_full/.test(error.message ?? "")) throw new Error("The house keeps three shares a chart and sixty in all. End one to make another.");
    refused(error);
  },
  async setProgress(w: Who, id: number, on: boolean) {
    if (w.guest) return;
    const { error } = await cloud().from("bazi_shares").update({ with_progress: on }).eq("owner_id", w.id).eq("id", id);
    refused(error);
  },
  /** The student takes a share back, or the teacher lets one go: the same deletion. */
  async end(w: Who, id: number, chartId?: number) {
    if (w.guest) return;
    const { error } = await cloud().from("bazi_shares").delete().eq("id", id);
    refused(error);
    if (chartId != null) dropTeacherRecord(w.id, chartId);
  },
  async take(w: Who, typed: string) {
    if (w.guest) throw new Error("Taking up a code needs an inCommon account.");
    const code = cleanCode(typed);
    const none = "The house cannot open that code. It may be mistyped, already taken up, or more than seven days old.";
    if (!code) throw new Error(none);
    const { error } = await cloud().rpc("bazi_share_claim", { p_code: code });
    if (error && /bazi_share_none/.test(error.message ?? "")) throw new Error(none);
    if (error && /bazi_share_full/.test(error.message ?? "")) throw new Error("The table holds as many students' charts as it can. Let one go to take up another.");
    refused(error);
  },
};

const queryClient = new QueryClient();

export function DataProvider({ children }: { children: ReactNode }) {
  // A sign in or out elsewhere on the site (another tab) changes who is reading.
  // The refetch is put off a tick and nothing is returned: supabase-js awaits
  // this callback while it holds its lock, and the refetch asks for the session,
  // which waits on that same lock. Awaited, a reader arriving signed in from
  // inCommon was never let in.
  useEffect(() => {
    const { data } = cloud().auth.onAuthStateChange(() => {
      setTimeout(() => void queryClient.invalidateQueries({ queryKey: ["bazi"] }), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/* ---- hooks, in the shape the pages already used ---- */

export function useWho() {
  return useQuery({ queryKey: ["bazi", "who"], queryFn: who, staleTime: 60_000 });
}

function useNeedWho() {
  const w = useWho();
  return w.data ?? null;
}

type Opts = { onSuccess?: () => void };

export const api = {
  stone: { useQuery: () => useQuery({ queryKey: ["bazi", "stone"], queryFn: async () => stoneChart() }) },

  myProgress: {
    useQuery: (_?: undefined, o?: { enabled?: boolean }) => {
      const w = useNeedWho();
      return useQuery({ queryKey: ["bazi", "progress", w?.id], queryFn: () => store.progress(w!), enabled: !!w && (o?.enabled ?? true) });
    },
  },
  myCharts: {
    useQuery: (_?: undefined, o?: { enabled?: boolean }) => {
      const w = useNeedWho();
      return useQuery({
        queryKey: ["bazi", "charts", w?.id],
        queryFn: async () => (await store.charts(w!)).map((r) => ({ ...r, luck: luckOf(r) })),
        enabled: !!w && (o?.enabled ?? true),
      });
    },
  },

  shares: {
    useQuery: (_?: undefined, o?: { enabled?: boolean }) => {
      const w = useNeedWho();
      return useQuery({
        queryKey: ["bazi", "shares", w?.id],
        queryFn: async () => {
          const s = await shares.all(w!);
          return { ...s, held: s.held.map((h) => ({ ...h, chart: { ...h.chart, luck: luckOf(h.chart) } })) };
        },
        enabled: !!w && (o?.enabled ?? true),
      });
    },
  },
  offerShare: { useMutation: (o?: Opts) => useWrite((w, v: { chartId: number; withProgress: boolean }) => shares.offer(w, v.chartId, v.withProgress), ["shares"], o) },
  setShareProgress: { useMutation: (o?: Opts) => useWrite((w, v: { id: number; on: boolean }) => shares.setProgress(w, v.id, v.on), ["shares"], o) },
  endShare: { useMutation: (o?: Opts) => useWrite((w, v: { id: number; chartId?: number }) => shares.end(w, v.id, v.chartId), ["shares"], o) },
  takeShare: { useMutation: (o?: Opts) => useWrite((w, v: { code: string }) => shares.take(w, v.code), ["shares"], o) },

  markRead: { useMutation: (o?: Opts) => useWrite((w, v: { lessonId: string }) => store.mark(w, v.lessonId), ["progress"], o) },
  unmarkRead: { useMutation: (o?: Opts) => useWrite((w, v: { lessonId: string }) => store.unmark(w, v.lessonId), ["progress"], o) },
  cast: { useMutation: (o?: Opts) => useWrite((w, v: BirthInput) => store.cast(w, v), ["charts"], o) },
  setChartSex: { useMutation: (o?: Opts) => useWrite((w, v: { id: number; sex: "m" | "f" | null }) => store.setSex(w, v.id, v.sex), ["charts"], o) },
  removeChart: { useMutation: (o?: Opts) => useWrite((w, v: { id: number }) => store.remove(w, v.id), ["charts", "shares"], o) },
};

function useWrite<V>(fn: (w: Who, v: V) => Promise<void>, refresh: string[], o?: Opts) {
  const qc = useQueryClient();
  const w = useNeedWho();
  return useMutation({
    mutationFn: async (v: V) => {
      if (!w) throw new Error("The house is still opening. Try again in a moment.");
      await fn(w, v);
    },
    onSuccess: async () => {
      await Promise.all(refresh.map((k) => qc.invalidateQueries({ queryKey: ["bazi", k] })));
      o?.onSuccess?.();
    },
  });
}
