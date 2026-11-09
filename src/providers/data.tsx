import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { LESSONS } from "@contracts/bazi";
import { castPillars, isZone, luckOf } from "@/lib/cast";
import { cloud, currentReader, type Reader } from "@/lib/cloud";
import { stoneChart } from "@/lib/stone";

/*
  The Academy's data, with no server of its own.

  A reader signed in to inCommon keeps their charts and their marks on their
  inCommon account (tables bazi_charts and bazi_progress, row level security,
  their own rows only). A guest keeps them on this device and nowhere else.
  The Stone is data in the bundle. Lessons and the canon were always static.
*/

const CHARTS_KEY = "incommon.bazi.charts.v1";
const PROGRESS_KEY = "incommon.bazi.progress.v1";
const MAX_CHARTS = 6;

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
    const { data, error } = await cloud().from("bazi_charts").select("*").order("id");
    refused(error);
    return (data ?? []).map(fromDb);
  },
  async cast(w: Who, raw: BirthInput) {
    const input = checked(raw);
    const mine = await store.charts(w);
    if (mine.length >= MAX_CHARTS) throw new Error("The Desk keeps six charts at most.");
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
    const { error } = await cloud().from("bazi_charts").update({ birth_sex: sex }).eq("id", id);
    refused(error);
  },
  async remove(w: Who, id: number) {
    if (w.guest) {
      write(CHARTS_KEY, read<ChartRow[]>(CHARTS_KEY, []).filter((c) => c.id !== id));
      return;
    }
    const { error } = await cloud().from("bazi_charts").delete().eq("id", id);
    refused(error);
  },
  async progress(w: Who): Promise<{ lessonId: string; completedAt: string }[]> {
    if (w.guest) return read(PROGRESS_KEY, []);
    const { data, error } = await cloud().from("bazi_progress").select("lesson_id, completed_at");
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
    const { error } = await cloud().from("bazi_progress").delete().eq("lesson_id", lessonId);
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

  markRead: { useMutation: (o?: Opts) => useWrite((w, v: { lessonId: string }) => store.mark(w, v.lessonId), ["progress"], o) },
  unmarkRead: { useMutation: (o?: Opts) => useWrite((w, v: { lessonId: string }) => store.unmark(w, v.lessonId), ["progress"], o) },
  cast: { useMutation: (o?: Opts) => useWrite((w, v: BirthInput) => store.cast(w, v), ["charts"], o) },
  setChartSex: { useMutation: (o?: Opts) => useWrite((w, v: { id: number; sex: "m" | "f" | null }) => store.setSex(w, v.id, v.sex), ["charts"], o) },
  removeChart: { useMutation: (o?: Opts) => useWrite((w, v: { id: number }) => store.remove(w, v.id), ["charts"], o) },
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
