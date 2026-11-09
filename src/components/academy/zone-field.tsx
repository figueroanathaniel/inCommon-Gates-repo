import { useId } from "react";
import { zoneOptions } from "@/lib/zones";

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
  const sub = dark ? "rgba(34,31,26,.6)" : "rgba(250,248,245,.55)";
  return (
    <label className="block">
      <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: sub }}>
        Place of birth, by its time zone
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
        className="font-gloss mt-1 block min-h-[18px] text-[12.5px]"
        style={{ color: dark ? "var(--warn-ink)" : "var(--warn)" }}
        role={invalid ? "alert" : undefined}
      >
        {invalid ? "Choose the nearest city from the list." : ""}
      </span>
    </label>
  );
}
