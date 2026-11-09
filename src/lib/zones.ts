/**
 * The time zones a birth can be placed in, named by their cities.
 * The IANA id is what the house stores and casts from; the label is what a
 * reader looks for ("New York, America"). Intl supplies the list, so it
 * follows the browser's own tz data.
 */
export type ZoneOption = { id: string; label: string };

const FALLBACK = ["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Taipei", "Asia/Singapore", "America/New_York", "Europe/London", "UTC"];

function labelOf(id: string): string {
  const parts = id.split("/");
  if (parts.length === 1) return id;
  const city = parts[parts.length - 1].replace(/_/g, " ");
  const region = parts.slice(0, -1).join(", ").replace(/_/g, " ");
  return `${city}, ${region}`;
}

let cache: ZoneOption[] | null = null;

export function zoneOptions(): ZoneOption[] {
  if (cache) return cache;
  let ids: string[] = FALLBACK;
  try {
    const sv = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    if (sv) ids = sv("timeZone");
  } catch {
    /* an older browser keeps the short list */
  }
  cache = ids.map((id) => ({ id, label: labelOf(id) })).sort((a, b) => a.label.localeCompare(b.label));
  return cache;
}

/** The zone this device is set to, as the starting answer. */
export function deviceZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai";
  } catch {
    return "Asia/Shanghai";
  }
}

/** Accepts a typed label or an id and answers the IANA id, or null. */
export function zoneFrom(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  const hit = zoneOptions().find((z) => z.label.toLowerCase() === t || z.id.toLowerCase() === t);
  return hit ? hit.id : null;
}

export function zoneLabel(id: string | null | undefined): string {
  if (!id) return "";
  return labelOf(id);
}
