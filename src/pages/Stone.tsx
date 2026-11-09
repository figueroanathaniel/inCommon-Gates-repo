import { useState } from "react";
import { Shell, Seal, Rule, JadeButton, GhostButton } from "@/components/academy/chrome";
import { MirrorReading } from "@/components/academy/mirror";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import type { FourPillars } from "@contracts/bazi";
import { ZoneField } from "@/components/academy/zone-field";
import { deviceZone, zoneFrom, zoneLabel } from "@/lib/zones";

function InscriptionForm() {
  const utils = trpc.useUtils();
  const inscribe = trpc.academy.inscribeStone.useMutation({
    onSuccess: () => utils.academy.stone.invalidate(),
  });
  const [label, setLabel] = useState("The Chart of the House");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [note, setNote] = useState("");
  const [place, setPlace] = useState(() => zoneLabel(deviceZone()));
  const [placeTried, setPlaceTried] = useState(false);
  const zone = zoneFrom(place);

  const field =
    "font-gloss min-h-[44px] w-full border bg-transparent px-3 text-[15px] text-[#221f1a] placeholder:text-[rgba(34,31,26,.4)]";
  const border = { borderColor: "rgba(34,31,26,.35)" } as const;

  const submit = () => {
    if (!date || !time) return;
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    if (!y || !m || !d) return;
    setPlaceTried(true);
    if (!zone) return;
    inscribe.mutate({ label: label.trim() || "The Chart of the House", year: y, month: m, day: d, hour: h, minute: min, zone, note: note.trim() || undefined });
  };

  return (
    <div className="mx-auto mt-10 max-w-xl border px-6 py-8 min-[820px]:px-10" style={{ borderColor: "rgba(34,31,26,.3)", background: "rgba(255,255,255,.35)" }}>
      <h2 className="font-han text-[20px] font-bold text-[#221f1a]">銘石 · Inscribe the Stone</h2>
      <p className="font-gloss mt-3 text-[14.5px] leading-relaxed" style={{ color: "rgba(34,31,26,.7)" }}>
        You carry the seal of the house. Set the true chart here, once, and every scroll in the hall
        will be found written upon it. The Stone is inscribed once and not re-cut.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: "rgba(34,31,26,.6)" }}>Name upon the Stone</span>
          <input className={field} style={border} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: "rgba(34,31,26,.6)" }}>Day of birth</span>
            <input type="date" className={field} style={border} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block">
            <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: "rgba(34,31,26,.6)" }}>Hour of birth</span>
            <input type="time" className={field} style={border} value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>
        <ZoneField dark value={place} onChange={setPlace} invalid={placeTried && !zone} fieldClass={field} border={border} />
        <label className="block">
          <span className="font-gloss mb-1 block text-[12px] uppercase tracking-[0.18em]" style={{ color: "rgba(34,31,26,.6)" }}>A line for the pedestal, if you wish</span>
          <textarea className={`${field} min-h-[88px] py-2`} style={border} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <JadeButton onClick={submit} disabled={!date || inscribe.isPending}>Set the Stone 銘</JadeButton>
          {inscribe.error ? (
            <p className="font-gloss text-[13.5px]" style={{ color: "var(--warn-ink)" }} role="alert">{inscribe.error.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** The Stone room: Your Nature, veiled or read. */
export default function Stone() {
  const stone = trpc.academy.stone.useQuery();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  const pillars: FourPillars | null = stone.data
    ? {
        yearStem: stone.data.yearStem, yearBranch: stone.data.yearBranch,
        monthStem: stone.data.monthStem, monthBranch: stone.data.monthBranch,
        dayStem: stone.data.dayStem, dayBranch: stone.data.dayBranch,
        hourStem: stone.data.hourStem, hourBranch: stone.data.hourBranch,
      }
    : null;

  return (
    <Shell paper>
      <section className="py-14 min-[820px]:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Seal char="鑑" size={48} dark /></div>
          <h1 className="font-han mt-6 text-[38px] font-black tracking-[0.12em] text-[#221f1a] min-[820px]:text-[46px]">Your Nature</h1>
          <p className="font-gloss mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed" style={{ color: "rgba(34,31,26,.7)" }}>
            One true chart, set at the centre of the house as the stone was set in the desert:
            the same life read in every script the hall keeps, until the scripts become one reading.
          </p>
        </div>

        {stone.isLoading ? (
          <p className="font-gloss mt-16 text-center text-[15px] italic" style={{ color: "rgba(34,31,26,.55)" }}>
            The room is quiet while the Stone is sought.
          </p>
        ) : pillars && stone.data ? (
          <>
            {stone.data.note ? (
              <p className="font-gloss mx-auto mt-10 max-w-xl text-center text-[14.5px] italic leading-relaxed" style={{ color: "rgba(34,31,26,.6)" }}>
                Upon the pedestal is written: {stone.data.note}
              </p>
            ) : null}
            <MirrorReading pillars={pillars} label={`The Stone: ${stone.data.label}`} />
            <div className="mt-14 flex justify-center">
              <GhostButton to="/scroll/jian" dark>Return to the Mirror scroll</GhostButton>
            </div>
          </>
        ) : (
          <div className="mx-auto mt-14 max-w-2xl">
            <div className="border px-8 py-14 text-center" style={{ borderColor: "rgba(34,31,26,.3)", background: "rgba(255,255,255,.3)" }}>
              <p className="font-han text-[60px] font-black leading-none" style={{ color: "rgba(34,31,26,.22)" }}>鑑</p>
              <p className="font-han mt-6 text-[20px] font-bold text-[#221f1a]">石猶未銘</p>
              <p className="font-gloss mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(34,31,26,.7)" }}>
                The Stone stands veiled. The house does not read a chart it does not hold, and it will not invent one.
                When the true chart is set here, every scroll will be found written upon it.
              </p>
            </div>
            {isAuthenticated && isAdmin ? <InscriptionForm /> : null}
            {isAuthenticated && !isAdmin ? (
              <p className="font-gloss mt-8 text-center text-[13.5px] italic" style={{ color: "rgba(34,31,26,.55)" }}>
                Only the hand that carries the seal of the house may inscribe the Stone.
              </p>
            ) : null}
            {!isAuthenticated ? (
              <p className="font-gloss mt-8 text-center text-[13.5px] italic" style={{ color: "rgba(34,31,26,.55)" }}>
                The Stone is inscribed after signing in with the seal of the house.
              </p>
            ) : null}
          </div>
        )}
      </section>
      <Rule dark className="mb-16" />
    </Shell>
  );
}
