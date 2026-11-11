import { useState } from "react";
import { castPillars } from "./cast";
import { decadeYears, yearPillar, type Sign } from "./meet";
import type { LuckView } from "@/components/academy/luck";

/** The calendar year whose pillar is open now: the year turns at 立春, not on the first of January. */
export function openYear(now = new Date()): number {
  const y = now.getUTCFullYear();
  const p = castPillars(y, now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), "UTC");
  const own = yearPillar(y);
  return own.stem === p.yearStem && own.branch === p.yearBranch ? y : y - 1;
}

/** The years a decade can show: its ten where its opening day is known, the open year alone where it is not. */
export function yearsOf(luck: LuckView, i: number, open: number): number[] {
  const from = luck.decades[i]?.from;
  if (from) return decadeYears(from);
  return luck.current === i ? [open] : [];
}

/**
 * Which decade and which year the reader has laid beside the birth. It opens
 * on the decade and the year that are open today.
 */
export function useTimes(luck: LuckView | null | undefined) {
  const [open] = useState(() => openYear());
  /* Until the reader chooses, the decade is the one the life stands in, even when the chart arrives late. */
  const [pick, setPick] = useState<{ decade: number | null; year: number | null } | null>(null);
  const decade = pick ? pick.decade : (luck?.current ?? null);
  const year = pick ? pick.year : open;
  const setDecade = (i: number | null) =>
    setPick({ decade: i, year: luck && i !== null && yearsOf(luck, i, open).includes(open) ? open : null });
  const setYear = (y: number | null) => setPick({ decade, year: y });
  const incoming: Sign[] = [];
  const d = luck && decade !== null ? luck.decades[decade] : null;
  if (d) incoming.push({ key: "luck", hanzi: "大運", english: "Decade", stem: d.stem, branch: d.branch, incoming: true });
  if (year !== null) incoming.push({ key: "annual", hanzi: "流年", english: String(year), ...yearPillar(year), incoming: true });
  return { decade, year, open, setDecade, setYear, incoming };
}

export type Times = ReturnType<typeof useTimes>;
