import { useSyncExternalStore } from "react";

/*
  師 What a teacher keeps about one student's chart: which scrolls have been
  taught, and the teacher's own notes. Kept on this device, under the reader
  and the chart it belongs to, and burned with the chart.
*/

export interface TeacherRecord { taught: string[]; notes: string }

const KEY = "incommon.bazi.teacher.v1";
const EMPTY: TeacherRecord = { taught: [], notes: "" };
type Book = Record<string, TeacherRecord>;

const slot = (who: string, chartId: number) => `${who}:${chartId}`;

let book: Book | null = null;
const listeners = new Set<() => void>();

function load(): Book {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!raw || typeof raw !== "object") return {};
    const out: Book = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      const r = v as Partial<TeacherRecord> | null;
      if (!r || typeof r !== "object") continue;
      out[k] = {
        taught: Array.isArray(r.taught) ? r.taught.filter((x): x is string => typeof x === "string") : [],
        notes: typeof r.notes === "string" ? r.notes.slice(0, 20000) : "",
      };
    }
    return out;
  } catch {
    return {};
  }
}

const snapshot = () => (book ??= load());

function save(next: Book) {
  book = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* A device that will not keep it still holds it for this visit. */
  }
  listeners.forEach((l) => l());
}

export function setTeacherRecord(who: string, chartId: number, patch: Partial<TeacherRecord>) {
  const k = slot(who, chartId);
  const now = snapshot()[k] ?? EMPTY;
  save({ ...snapshot(), [k]: { ...now, ...patch } });
}

/** Burned with the chart it was written about. */
export function dropTeacherRecord(who: string, chartId: number) {
  const k = slot(who, chartId);
  if (!(k in snapshot())) return;
  const next = { ...snapshot() };
  delete next[k];
  save(next);
}

export function useTeacherRecord(who: string | null, chartId: number | null): TeacherRecord {
  const all = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot,
    () => ({}) as Book,
  );
  if (!who || chartId === null) return EMPTY;
  return all[slot(who, chartId)] ?? EMPTY;
}
