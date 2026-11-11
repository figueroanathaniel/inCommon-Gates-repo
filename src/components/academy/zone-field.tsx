import { useId } from "react";
import { zoneOptions } from "@/lib/zones";
import { useT, useZh } from "@/lib/lang";

/**
 * Where the birth happened, as the time zone its clock kept.
 * A typed city is matched against the zone list; the cast reads the
 * zone's own offset for the birth date, daylight saving included.
 * `dark` means dark ink on paper, as in PillarChart.
 */
export function ZoneField({
  value,
  onChange,
  invalid,
  dark = false,
  fieldClass,
  border,
}: {
  value: string;
  onChange: (text: string) => void;
  invalid: boolean;
  dark?: boolean;
  fieldClass: string;
  border: React.CSSProperties;
}) {
  const id = useId();
  const listId = `${id}-zones`;
  const errId = `${id}-err`;
  const zh = useZh();
  const t = useT();
  const sub = dark ? "rgba(var(--txr),.6)" : "rgba(var(--txr),.55)";
  return (
    <label className="block">
      <span className={(zh ? "font-han" : "font-gloss uppercase") + " mb-1 block text-[12px] tracking-[0.18em]"} style={{ color: sub }}>
        {t("Place of birth, by its time zone", "出生之地，依其時區")}
      </span>
      <input
        className={fieldClass}
        style={border}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={listId}
        autoComplete="off"
        spellCheck={false}
        placeholder="New York, America"
        aria-invalid={invalid}
        aria-errormessage={invalid ? errId : undefined}
      />
      <datalist id={listId}>
        {zoneOptions().map((z) => (
          <option key={z.id} value={z.label} />
        ))}
      </datalist>
      <span
        id={errId}
        className={(zh ? "font-han" : "font-gloss") + " mt-1 block min-h-[18px] text-[12.5px]"}
        style={{ color: dark ? "var(--warn-ink)" : "var(--warn)" }}
        role={invalid ? "alert" : undefined}
      >
        {invalid ? t("Choose the nearest city from the list.", "請從清單中選最近的城市。") : ""}
      </span>
    </label>
  );
}
