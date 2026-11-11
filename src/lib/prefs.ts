import { useSyncExternalStore } from "react";

/*
  How the reader likes a chart shown. Kept on the device and nowhere else:
  three switches on the pillars, all off until chosen, the shape of the
  table of meetings, and whether the house is read in English or in 中文.
*/

export interface ChartPrefs {
  hidden: boolean;
  gods: boolean;
  season: boolean;
  table: "list" | "grid";
  lang: "en" | "zh";
}

const KEY = "incommon.bazi.view.v1";
const DEFAULTS: ChartPrefs = { hidden: false, gods: false, season: false, table: "list", lang: "en" };

function load(): ChartPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!raw || typeof raw !== "object") return DEFAULTS;
    return {
      hidden: raw.hidden === true,
      gods: raw.gods === true,
      season: raw.season === true,
      table: raw.table === "grid" ? "grid" : "list",
      lang: raw.lang === "zh" ? "zh" : "en",
    };
  } catch {
    return DEFAULTS;
  }
}

let current: ChartPrefs | null = null;
const listeners = new Set<() => void>();

const snapshot = () => (current ??= load());

export function setChartPrefs(patch: Partial<ChartPrefs>) {
  current = { ...snapshot(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* A device that will not keep it still shows it for this visit. */
  }
  listeners.forEach((l) => l());
}

export function useChartPrefs(): ChartPrefs {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot,
    () => DEFAULTS,
  );
}
