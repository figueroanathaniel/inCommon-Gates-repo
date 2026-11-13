import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { FourPillars } from "@contracts/bazi";
import { BRANCHES, STEMS } from "@contracts/bazi";
import { Shell, Seal, JadeButton, GhostButton } from "@/components/academy/chrome";
import { SignWord } from "@/components/academy/sign";
import { api } from "@/providers/data";
import { useAuth } from "@/hooks/useAuth";
import { setLang, useT, useZh, ZH_OPEN, ZH_SOON } from "@/lib/lang";
import { World, webglOk, type LegSpec } from "@/game/world";
import { Sound } from "@/game/sound";
import { CHAPTERS, buildHours, closingHours } from "@/game/hours";
import { buildStory, closing, parts, plain, type Leg, type Part, type Vars } from "@/game/story";
import { nextWalkTurn } from "@/game/choices";
import { KEEPER, ONWARD, PLACE, TONE, type Choice, type L, type Option, type Tag } from "@/game/script";

/*
  Eight Characters Academy: one chart, walked. The reader picks a chart the
  house already holds, meets the Keeper at the garden stair, and walks the
  road its eight characters lay out. Nothing is kept: the road is walked anew
  each visit.
*/

const HELP = "/app.html#/library/yellow-pages";
const INK = "#f4ecd8";
const PANEL = "rgba(10,12,22,.88)";
const GOLD = "#e7c77a";

type Chapter = "road" | "hours";
const CHAPTER_KEYS: Chapter[] = ["road", "hours"];
const chapterName = (c: Chapter, zh: boolean) =>
  `${zh ? CHAPTERS[c].numeral.zh : CHAPTERS[c].numeral.en} · ${zh ? CHAPTERS[c].title.zh : CHAPTERS[c].title.en}`;
/** The hour a place is lit for, as the world reads it. */
const hourOf = (s: LegSpec) => s.hour ?? { dawn: 6.5, day: 10.5, dusk: 18, night: 0 }[s.tone];

interface Pick { key: string; label: string; pillars: FourPillars; luckStem: number | null }

type Step =
  | { kind: "say"; who: "keeper" | "figure" | "voice"; line: L; vars?: Partial<Vars> }
  | { kind: "choice"; choice: Choice };

/** How many letters a part costs the typewriter. A sign or a god arrives whole. */
const cost = (p: Part) => (typeof p === "string" ? p.length : 4);

function Line({ ps, zh, upto }: { ps: Part[]; zh: boolean; upto: number }) {
  const out: ReactNode[] = [];
  let left = upto;
  for (let i = 0; i < ps.length && left > 0; i++) {
    const p = ps[i];
    if (typeof p === "string") out.push(<span key={i}>{p.slice(0, left)}</span>);
    else if ("sign" in p) {
      out.push(zh
        ? <span key={i} className="font-han" style={{ color: GOLD }}>{p.sign.han}</span>
        : <span key={i} style={{ color: GOLD }}><SignWord en={p.sign.en} han={p.sign.han} /></span>);
    } else {
      out.push(zh
        ? <span key={i} className="font-han" style={{ color: GOLD }}>{p.god.han}</span>
        : (
          <span key={i} dir="ltr" style={{ color: GOLD }}>
            {p.god.en} <span className="whitespace-nowrap">（<span className="font-han" lang="zh-Hant">{p.god.han}</span> “{p.god.pinyin}”）</span>
          </span>
        ));
    }
    left -= cost(p);
  }
  return <>{out}</>;
}

export default function Journey() {
  const zh = useZh();
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";
  const { isAuthenticated } = useAuth();
  const charts = api.myCharts.useQuery(undefined, { enabled: isAuthenticated });
  const stone = api.stone.useQuery();
  const [chosen, setChosen] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Pick | null>(null);
  const [chapter, setChapter] = useState<Chapter>("road");
  const [lost, setLost] = useState(false);
  const can = useMemo(() => webglOk(), []);

  const picks: Pick[] = useMemo(() => {
    const out: Pick[] = [];
    for (const c of charts.data ?? []) {
      out.push({
        key: `c${c.id}`, label: c.label,
        pillars: {
          yearStem: c.yearStem, yearBranch: c.yearBranch, monthStem: c.monthStem, monthBranch: c.monthBranch,
          dayStem: c.dayStem, dayBranch: c.dayBranch, hourStem: c.hourStem, hourBranch: c.hourBranch,
        },
        luckStem: c.luck && c.luck.current !== null ? c.luck.decades[c.luck.current]?.stem ?? null : null,
      });
    }
    const s = stone.data;
    if (s) {
      out.push({
        key: "house", label: zh ? s.labelZh : s.label,
        pillars: {
          yearStem: s.yearStem, yearBranch: s.yearBranch, monthStem: s.monthStem, monthBranch: s.monthBranch,
          dayStem: s.dayStem, dayBranch: s.dayBranch, hourStem: s.hourStem, hourBranch: s.hourBranch,
        },
        luckStem: s.luck && s.luck.current !== null ? s.luck.decades[s.luck.current]?.stem ?? null : null,
      });
    }
    return out;
  }, [charts.data, stone.data, zh]);

  const sel = picks.find((p) => p.key === chosen) ?? picks[0] ?? null;

  if (playing && !lost) {
    return <Play key={playing.key + chapter} pick={playing} chapter={chapter} onChapter={setChapter} onLeave={() => setPlaying(null)} onLost={() => setLost(true)} />;
  }

  return (
    <Shell>
      <section className="py-14 min-[820px]:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center"><Seal char="行" size={48} /></div>
          <h1 className={(zh ? "font-han font-black tracking-[0.12em]" : "font-gloss font-semibold tracking-[0.04em]") + " mt-6 text-[34px] text-[var(--tx)] min-[820px]:text-[44px]"}>
            {t("Eight Characters Academy", "八字書院")}
          </h1>
          <p className={f + " mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed"} style={{ color: "rgba(var(--txr),.7)" }}>
            {t(
              "The Keeper waits at the stair in the garden. Choose a chart and walk its road.",
              "守者在園中石階等候。擇一張盤，走它的路。",
            )}
          </p>
        </div>

        {!can || lost ? (
          <div className="mx-auto mt-12 max-w-xl text-center">
            <p className={f + " text-[15px] leading-relaxed"} style={{ color: "var(--warn)" }} role="alert">
              {t("This device could not draw the road.", "此裝置未能繪出這條路。")}
            </p>
            <div className="mt-8 flex justify-center"><GhostButton to="/desk">{t("To the Desk", "往書桌")}</GhostButton></div>
          </div>
        ) : picks.length === 0 ? (
          <p className={f + " mt-14 text-center text-[15px] italic"} style={{ color: "rgba(var(--txr),.66)" }}>
            {t("The garden gate is being opened.", "園門正在開啟。")}
          </p>
        ) : (
          <div className="mx-auto mt-12 max-w-xl">
            <div role="radiogroup" aria-label={t("Chapter", "章")} className="mb-6 grid grid-cols-2 gap-3">
              {CHAPTER_KEYS.map((c) => {
                const on = chapter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChapter(c)}
                    className={f + " min-h-[52px] border px-3 py-2 text-center text-[14.5px] font-bold transition-colors duration-200"}
                    style={{ borderColor: on ? "var(--gilt)" : "rgba(var(--txr),.25)", background: on ? "rgba(var(--txr),.06)" : "transparent", color: "var(--tx)" }}
                  >
                    {chapterName(c, zh)}
                  </button>
                );
              })}
            </div>
            <div role="radiogroup" aria-label={t("Chart to walk", "所走之盤")} className="grid gap-3">
              {picks.map((p) => {
                const on = sel?.key === p.key;
                const b = BRANCHES[p.pillars.dayBranch];
                const s = STEMS[p.pillars.dayStem];
                const from = chapter === "hours" ? BRANCHES[p.pillars.yearBranch] : b;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChosen(p.key)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 border px-5 py-3 text-left transition-colors duration-200"
                    style={{ borderColor: on ? "var(--gilt)" : "rgba(var(--txr),.25)", background: on ? "rgba(var(--txr),.06)" : "transparent" }}
                  >
                    <span className="min-w-0">
                      <span className={f + " block text-[17px] font-bold text-[var(--tx)]"}>{p.label}</span>
                      <span className={f + " mt-1 block text-[13px]"} style={{ color: "rgba(var(--txr),.7)" }}>
                        {zh ? PLACE[from.phase].zh : PLACE[from.phase].en}
                      </span>
                    </span>
                    <span className="font-han shrink-0 text-[26px] leading-none text-[var(--tx)]" lang="zh-Hant" aria-hidden="true">{s.hanzi}{b.hanzi}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <JadeButton onClick={() => sel && setPlaying(sel)} disabled={!sel}>{t("Enter the garden", "入園")}</JadeButton>
              <GhostButton to="/desk">{t("Cast a chart at the Desk", "往書桌排盤")}</GhostButton>
            </div>
          </div>
        )}
      </section>
    </Shell>
  );
}

function Play({ pick, chapter, onChapter, onLeave, onLost }: { pick: Pick; chapter: Chapter; onChapter: (c: Chapter) => void; onLeave: () => void; onLost: () => void }) {
  const zh = useZh();
  const t = useT();
  const f = zh ? "font-han" : "font-gloss";
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Each walk turns the choices once. The 中文 walk keeps the approved ones, which are the only ones written in 中文.
  const [turn] = useState(() => (zh ? null : nextWalkTurn()));
  const legs = useMemo(() => (chapter === "hours" ? buildHours(pick.pillars, turn) : buildStory(pick.pillars, pick.luckStem, turn)), [pick, chapter, turn]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<World | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const tagsRef = useRef<Tag[]>([]);
  const soundRef = useRef<Sound | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const [idx, setIdx] = useState(0);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [si, setSi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [hint, setHint] = useState<L | null>(null);
  const [card, setCard] = useState(true);
  const [veil, setVeil] = useState(false);
  const [menu, setMenu] = useState(false);
  const [auto, setAutoOn] = useState(false);
  const [ended, setEnded] = useState(false);
  const [stick, setStick] = useState<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const [touch, setTouch] = useState(false);

  const leg: Leg = legs[idx];
  const step = steps ? steps[si] ?? null : null;

  /** A place has arrived: its air, and a small bell. */
  const arrive = useCallback((spec: LegSpec) => {
    soundRef.current?.place(spec.env, hourOf(spec));
    soundRef.current?.chime();
  }, []);

  // The latest handlers, for the world to call.
  const live = useRef({ idx, legs, ended });
  live.current = { idx, legs, ended };

  const begin = useCallback((i: number) => {
    const l = live.current.legs[i];
    const s: Step[] = l.meet.map((b) => ({ kind: "say", who: b.who, line: b.line, vars: b.vars }));
    if (l.choice) s.push({ kind: "choice", choice: l.choice });
    for (const b of l.after) s.push({ kind: "say", who: b.who, line: b.line, vars: b.vars });
    if (l.exit === "end") {
      const last = chapter === "hours" ? closingHours(tagsRef.current) : closing(tagsRef.current);
      for (const line of last) s.push({ kind: "say", who: "keeper", line });
    }
    worldRef.current?.setTalking(true);
    worldRef.current?.setAuto(false);
    setAutoOn(false);
    setHint(null);
    setSteps(s); setSi(0); setTyped(0);
  }, [chapter]);

  const cross = useCallback(() => {
    const i = live.current.idx + 1;
    if (i >= live.current.legs.length) return;
    const go = () => {
      const next = live.current.legs[i];
      worldRef.current?.load(next.spec, "cut");
      arrive(next.spec);
      setIdx(i); setHint(next.enter ?? null); setCard(true); setAutoOn(false);
      setVeil(false);
    };
    soundRef.current?.gate();
    if (reduced) go();
    else { setVeil(true); window.setTimeout(go, 650); }
  }, [reduced, arrive]);

  // The world, made once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let w: World;
    try {
      w = new World(canvas, reduced, {
        onNear: () => begin(live.current.idx),
        onGate: () => cross(),
        onLost: () => onLost(),
        onStep: () => soundRef.current?.step(),
      });
    } catch {
      onLost();
      return;
    }
    worldRef.current = w;
    const snd = new Sound();
    soundRef.current = snd;
    w.load(legs[0].spec, "cut");
    snd.place(legs[0].spec.env, hourOf(legs[0].spec));
    const iv = window.setInterval(() => {
      if (barRef.current) barRef.current.style.width = `${Math.round(w.progress() * 100)}%`;
    }, 200);
    return () => { window.clearInterval(iv); w.dispose(); worldRef.current = null; snd.dispose(); soundRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The title card of each place leaves on its own.
  useEffect(() => {
    if (!card) return;
    const id = window.setTimeout(() => setCard(false), 3600);
    return () => window.clearTimeout(id);
  }, [card, idx]);

  // The typewriter.
  const say = step && step.kind === "say" ? step : null;
  const vars: Vars = useMemo(() => (say && say.vars ? { ...leg.vars, ...say.vars } : leg.vars), [leg, say]);
  const ps = useMemo(() => (say ? parts(say.line, vars, zh) : []), [say, vars, zh]);
  const total = useMemo(() => ps.reduce((n, p) => n + cost(p), 0), [ps]);
  useEffect(() => {
    if (!say) return;
    if (reduced) { setTyped(total); return; }
    if (typed >= total) return;
    if (typed % (zh ? 3 : 6) === 0) soundRef.current?.blip(say.who);
    const id = window.setTimeout(() => setTyped((n) => Math.min(total, n + (zh ? 1 : 2))), 22);
    return () => window.clearTimeout(id);
  }, [say, typed, total, reduced, zh]);

  useEffect(() => { if (step && !menu) nextRef.current?.focus({ preventScroll: true }); }, [step, si, menu]);

  const finish = useCallback(() => {
    const w = worldRef.current;
    setSteps(null); setSi(0); setTyped(0);
    w?.setTalking(false);
    if (leg.exit === "grow") {
      const i = idx + 1;
      w?.load(legs[i].spec, "grow");
      arrive(legs[i].spec);
      setIdx(i); setCard(true);
      if (leg.arrive) setHint(leg.arrive);
    } else if (leg.exit === "gate") {
      w?.openGate();
      setHint(ONWARD);
    } else {
      w?.setLocked(true);
      setEnded(true);
    }
  }, [leg, idx, legs, arrive]);

  const advance = useCallback(() => {
    if (!steps || !say) return;
    if (typed < total) { setTyped(total); return; }
    if (si + 1 >= steps.length) finish();
    else { setSi(si + 1); setTyped(0); }
  }, [steps, say, typed, total, si, finish]);

  const choose = useCallback((o: Option) => {
    if (!steps) return;
    if (o.tag) tagsRef.current = [...tagsRef.current, o.tag];
    soundRef.current?.choose();
    const who = leg.spec.figure === "keeper" ? "keeper" : "figure";
    const next = steps.slice();
    next.splice(si + 1, 0, { kind: "say", who, line: o.reply });
    setSteps(next); setSi(si + 1); setTyped(0);
  }, [steps, si, leg]);

  // Keys.
  useEffect(() => {
    const down = new Set<string>();
    const push = () => {
      const w = worldRef.current; if (!w) return;
      const has = (...k: string[]) => k.some((c) => down.has(c));
      const z = (has("KeyW", "ArrowUp") ? 1 : 0) - (has("KeyS", "ArrowDown") ? 1 : 0);
      const x = (has("KeyD") ? 1 : 0) - (has("KeyA") ? 1 : 0);
      const turn = (has("ArrowRight", "KeyE") ? 1 : 0) - (has("ArrowLeft", "KeyQ") ? 1 : 0);
      w.setInput(x, z, turn);
      if (x || z) setAutoOn(false);
    };
    const kd = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const onControl = !!el && (el.tagName === "BUTTON" || el.tagName === "A");
      soundRef.current?.wake();
      if (e.code === "Escape") { setMenu((m) => !m); return; }
      if ((e.code === "Enter" || e.code === "Space") && !onControl) { e.preventDefault(); advance(); return; }
      if (e.code.startsWith("Arrow") && !onControl) e.preventDefault();
      down.add(e.code); push();
    };
    const ku = (e: KeyboardEvent) => { down.delete(e.code); push(); };
    const blur = () => { down.clear(); push(); };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); window.removeEventListener("blur", blur); };
  }, [advance]);

  useEffect(() => { worldRef.current?.setLocked(menu || ended); }, [menu, ended]);

  // Pointer: a drag looks; on a touch screen the left half is the stick.
  const ptr = useRef<{ look: number | null; stick: number | null; lx: number; ly: number; ox: number; oy: number }>({ look: null, stick: null, lx: 0, ly: 0, ox: 0, oy: 0 });
  const pDown = (e: React.PointerEvent) => {
    const p = ptr.current;
    if (e.pointerType === "touch") setTouch(true);
    if (e.pointerType === "touch" && e.clientX < window.innerWidth / 2 && p.stick === null) {
      p.stick = e.pointerId; p.ox = e.clientX; p.oy = e.clientY;
      setStick({ x: e.clientX, y: e.clientY, dx: 0, dy: 0 });
    } else if (p.look === null) {
      p.look = e.pointerId; p.lx = e.clientX; p.ly = e.clientY;
    }
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const pMove = (e: React.PointerEvent) => {
    const p = ptr.current; const w = worldRef.current; if (!w) return;
    if (e.pointerId === p.stick) {
      const R = 56;
      let dx = e.clientX - p.ox, dy = e.clientY - p.oy;
      const len = Math.hypot(dx, dy);
      if (len > R) { dx = dx / len * R; dy = dy / len * R; }
      setStick({ x: p.ox, y: p.oy, dx, dy });
      w.setInput(dx / R, -dy / R, 0);
      if (len > 6) setAutoOn(false);
    } else if (e.pointerId === p.look) {
      w.look((e.clientX - p.lx) * 0.005, (e.clientY - p.ly) * 0.004);
      p.lx = e.clientX; p.ly = e.clientY;
    }
  };
  const pUp = (e: React.PointerEvent) => {
    const p = ptr.current;
    if (e.pointerId === p.stick) { p.stick = null; setStick(null); worldRef.current?.setInput(0, 0, 0); }
    if (e.pointerId === p.look) p.look = null;
  };

  const toggleAuto = () => {
    const on = !auto;
    setAutoOn(on);
    worldRef.current?.setAuto(on);
  };

  const again = () => {
    tagsRef.current = [];
    setEnded(false); setSteps(null); setHint(null); setIdx(0); setCard(true);
    worldRef.current?.setLocked(false);
    worldRef.current?.load(legs[0].spec, "cut");
    arrive(legs[0].spec);
  };

  const toggleSound = () => {
    const on = !soundOn;
    setSoundOn(on);
    soundRef.current?.setOn(on);
  };

  const who = say ? (say.who === "keeper" ? KEEPER : say.who === "figure" ? leg.name : null) : null;
  const place = `${zh ? PLACE[leg.spec.env].zh : PLACE[leg.spec.env].en} · ${leg.sub ? (zh ? leg.sub.zh : leg.sub.en) : zh ? TONE[leg.spec.tone].zh : TONE[leg.spec.tone].en}`;
  const other: Chapter = chapter === "road" ? "hours" : "road";
  const endTitle = chapter === "hours" ? t("The garden at first light", "晨光中的園") : t("The garden at dusk", "暮色中的園");
  const btn = f + " inline-flex min-h-[44px] items-center justify-center px-4 text-[13px] tracking-[0.1em]" + (zh ? "" : " uppercase");
  const chip = { background: PANEL, color: INK, border: "1px solid rgba(244,236,216,.28)" } as const;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "#05060a", color: INK }} lang={zh ? "zh-Hant" : "en"} onPointerDownCapture={() => soundRef.current?.wake()}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ touchAction: "none" }}
        onPointerDown={pDown} onPointerMove={pMove} onPointerUp={pUp} onPointerCancel={pUp}
        aria-hidden="true"
      />

      {/* Where the walker is */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "rgba(244,236,216,.14)" }}>
        <div ref={barRef} className="h-full" style={{ width: "0%", background: GOLD, transition: "width .25s linear" }} />
      </div>
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between gap-3 px-4 pt-4" style={{ paddingLeft: "max(16px, env(safe-area-inset-left))", paddingRight: "max(16px, env(safe-area-inset-right))", paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <p className={f + " pointer-events-none min-w-0 px-3 py-2 text-[13px]"} style={{ ...chip, border: "none" }}>{place}</p>
        <div className="flex shrink-0 gap-2">
          {!steps && !ended ? (
            <button type="button" className={btn} style={{ ...chip, borderColor: auto ? GOLD : "rgba(244,236,216,.28)" }} aria-pressed={auto} onClick={toggleAuto}>
              {t("Walk for me", "代我行")}
            </button>
          ) : null}
          <button type="button" className={btn} style={chip} aria-haspopup="dialog" aria-expanded={menu} onClick={() => setMenu(true)}>
            {t("Menu", "選單")}
          </button>
        </div>
      </div>

      {/* The name of the place, on arrival */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-[22%] flex justify-center px-6 text-center"
        style={{ opacity: card && !steps && !ended ? 1 : 0, transition: reduced ? "none" : "opacity .9s ease" }}
        aria-hidden="true"
      >
        <div>
          <p className={(zh ? "font-han font-black tracking-[0.2em]" : "font-gloss font-semibold tracking-[0.08em]") + " text-[34px] min-[820px]:text-[52px]"} style={{ textShadow: "0 2px 18px rgba(0,0,0,.65)" }}>
            {zh ? PLACE[leg.spec.env].zh : PLACE[leg.spec.env].en}
          </p>
          <div className="mx-auto mt-3 h-px w-40" style={{ background: GOLD }} />
          {leg.sub ? (
            <p className={f + " mt-3 text-[17px] min-[820px]:text-[21px]"} style={{ textShadow: "0 2px 14px rgba(0,0,0,.7)" }}>{zh ? leg.sub.zh : leg.sub.en}</p>
          ) : null}
        </div>
      </div>

      {/* The stick, under a thumb */}
      {stick ? (
        <div className="pointer-events-none absolute" style={{ left: stick.x - 56, top: stick.y - 56, width: 112, height: 112, borderRadius: "50%", border: "1px solid rgba(244,236,216,.5)", background: "rgba(10,12,22,.3)" }} aria-hidden="true">
          <div style={{ position: "absolute", left: 56 - 22 + stick.dx, top: 56 - 22 + stick.dy, width: 44, height: 44, borderRadius: "50%", background: "rgba(244,236,216,.75)" }} />
        </div>
      ) : null}

      {/* A line for the road */}
      {!steps && !ended && !menu ? (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center px-4" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          <p className={f + " max-w-xl px-4 py-3 text-center text-[14.5px] leading-relaxed"} style={{ ...chip, border: "none" }} role="status">
            {hint
              ? <Line ps={parts(hint, vars, zh)} zh={zh} upto={9999} />
              : touch
                ? t("Left thumb walks. Right thumb looks.", "左指行路，右指環顧。")
                : t("W A S D or the arrows walk. Drag to look.", "方向鍵行路，拖曳環顧。")}
          </p>
        </div>
      ) : null}

      {/* Speech */}
      {step && !ended ? (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-3" style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))", paddingLeft: "max(12px, env(safe-area-inset-left))", paddingRight: "max(12px, env(safe-area-inset-right))" }}>
          <div className="w-full max-w-3xl" style={{ background: PANEL, border: `1px solid ${GOLD}`, boxShadow: "0 10px 40px rgba(0,0,0,.5)" }}>
            {say ? (
              <>
                {who ? (
                  <p className={f + " -mt-4 ml-4 inline-block px-3 py-1 text-[13px] font-bold tracking-[0.1em]"} style={{ background: GOLD, color: "#141418" }}>
                    {zh ? who.zh : who.en}
                  </p>
                ) : null}
                <p className={f + " min-h-[92px] px-5 pb-2 pt-3 text-[16.5px] leading-relaxed min-[820px]:text-[18px]" + (say.who === "voice" ? " italic" : "")} aria-hidden="true">
                  <Line ps={ps} zh={zh} upto={typed} />
                </p>
                <p className="sr-only" role="status" aria-live="polite">{(who ? (zh ? who.zh : who.en) + (zh ? "：" : ". ") : "") + plain(ps, zh)}</p>
                <div className="flex justify-end px-3 pb-3">
                  <button ref={nextRef} type="button" className={btn} style={{ color: GOLD, border: "1px solid rgba(231,199,122,.5)" }} onClick={advance}>
                    {typed < total ? t("Skip", "略過") : t("Go on", "繼續")}
                  </button>
                </div>
              </>
            ) : step.kind === "choice" ? (
              <div className="px-5 py-4">
                <p className={f + " text-[16.5px] leading-relaxed min-[820px]:text-[18px]"}><Line ps={parts(step.choice.prompt, vars, zh)} zh={zh} upto={9999} /></p>
                <div className="mt-4 grid gap-2 min-[820px]:grid-cols-2">
                  {step.choice.options.map((o, i) => (
                    <button
                      key={i}
                      ref={i === 0 ? nextRef : undefined}
                      type="button"
                      className={f + " min-h-[52px] px-4 py-2 text-left text-[15.5px] leading-snug"}
                      style={{ color: INK, border: "1px solid rgba(231,199,122,.55)", background: "rgba(231,199,122,.08)" }}
                      onClick={() => choose(o)}
                    >
                      <Line ps={parts(o.label, vars, zh)} zh={zh} upto={9999} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* The veil between places */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "#fff6d8", opacity: veil ? 1 : 0, transition: reduced ? "none" : "opacity .6s ease" }} aria-hidden="true" />

      {/* The end of the road */}
      {ended ? (
        <div className="absolute inset-0 flex items-center justify-center px-5" style={{ background: "rgba(5,6,10,.72)" }} role="dialog" aria-modal="true" aria-label={endTitle}>
          <div className="w-full max-w-md px-6 py-8 text-center" style={{ background: PANEL, border: `1px solid ${GOLD}` }}>
            <h2 className={(zh ? "font-han font-black tracking-[0.16em]" : "font-gloss font-semibold tracking-[0.06em]") + " text-[28px]"}>{endTitle}</h2>
            <div className="mx-auto mt-4 h-px w-32" style={{ background: GOLD }} />
            <div className="mt-8 grid gap-3">
              <button type="button" autoFocus className={btn} style={{ background: "#2fff8f", color: "#141418" }} onClick={again}>{t("Walk again", "再走一回")}</button>
              <button type="button" className={btn} style={{ ...chip, borderColor: GOLD }} onClick={() => onChapter(other)}>{chapterName(other, zh)}</button>
              <Link to="/scroll/shishen" className={btn} style={chip}>{t("The Ten Gods scroll", "十神卷")}</Link>
              <Link to="/desk" className={btn} style={chip}>{t("To the Desk", "往書桌")}</Link>
              <button type="button" className={btn} style={chip} onClick={onLeave}>{t("Choose another chart", "另擇一盤")}</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* The menu */}
      {menu ? (
        <div className="absolute inset-0 flex items-center justify-center px-5" style={{ background: "rgba(5,6,10,.72)" }} role="dialog" aria-modal="true" aria-label={t("Menu", "選單")}>
          <div className="w-full max-w-sm px-6 py-7 text-center" style={{ background: PANEL, border: "1px solid rgba(244,236,216,.3)" }}>
            <h2 className={(zh ? "font-han font-black tracking-[0.16em]" : "font-gloss font-semibold tracking-[0.06em]") + " text-[24px]"}>{t("Eight Characters Academy", "八字書院")}</h2>
            <div className="mt-6 grid gap-3">
              <button type="button" autoFocus className={btn} style={{ background: "#2fff8f", color: "#141418" }} onClick={() => setMenu(false)}>{t("Back to the road", "回到路上")}</button>
              {ZH_OPEN ? (
                <button type="button" className={btn + (zh ? " font-gloss" : " font-han")} style={chip} lang={zh ? "en" : "zh-Hant"} onClick={() => setLang(zh ? "en" : "zh")}>{zh ? "English" : "中文"}</button>
              ) : (
                <button type="button" className={btn + " font-han cursor-default"} style={chip} aria-disabled="true" aria-label="Chinese, coming soon" data-lang-soon><span lang="zh-Hant">中文 · {ZH_SOON}</span></button>
              )}
              <button type="button" className={btn} style={{ ...chip, borderColor: soundOn ? GOLD : "rgba(244,236,216,.28)" }} aria-pressed={soundOn} onClick={toggleSound}>{t("Sound", "聲音")}</button>
              <a href={HELP} className={btn} style={{ background: "var(--safety)", color: "#141418", fontWeight: 700 }}>{t("Get Help", "尋求協助")}</a>
              <button type="button" className={btn} style={chip} onClick={onLeave}>{t("Leave the road", "離開這條路")}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
