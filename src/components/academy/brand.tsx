import { useEffect, useLayoutEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";

/*
  The hall's door, planted in neon.

  Entrance: a laser cuts the button's edge into the parchment, then burns the
  inCommon mark (two whole rings and the lens between them), and the neon
  floods out from the lens. Press: the lens glows, the glow opens across the
  screen and becomes the hall, and the light settles back into parchment.

  It plays once per tab (?brand=1 replays it). Under reduced motion nothing
  plays: the button is simply there, and a press simply goes in.
*/

const NEON = "#2fff8f";
const INK = "#141418";
const PARCH = "#f2ecdc";
const SEEN = "incommon.bazi.branded";
const R = 6.5; // ring radius in the mark's 22 unit box
const C1 = { x: 8, y: 11 };
const C2 = { x: 14, y: 11 };
const LENS = "M11 5.234 A6.5 6.5 0 0 1 11 16.766 A6.5 6.5 0 0 1 11 5.234 Z";

const still = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wantsIntro(): boolean {
  if (still()) return false;
  try {
    if (new URLSearchParams(location.search).has("brand")) return true;
    return !sessionStorage.getItem(SEEN);
  } catch {
    return true;
  }
}

function Mark() {
  return (
    <svg data-brand-mark width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0" style={{ overflow: "visible" }}>
      <path data-brand-lens d={LENS} fill="#ffffff" fillOpacity={0.55} />
      <circle cx={C1.x} cy={C1.y} r={R} fill="none" stroke={INK} strokeWidth={1.7} />
      <circle cx={C2.x} cy={C2.y} r={R} fill="none" stroke={INK} strokeWidth={1.7} />
    </svg>
  );
}

/** One ember thrown off the laser's point. */
function spark(layer: HTMLElement, x: number, y: number) {
  const s = document.createElement("span");
  const a = Math.random() * Math.PI * 2;
  const d = 6 + Math.random() * 14;
  s.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:2px;height:2px;border-radius:50%;background:#eafff3;box-shadow:0 0 4px ${NEON};pointer-events:none`;
  layer.appendChild(s);
  s.animate(
    [
      { transform: "translate(-1px,-1px)", opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 6}px)`, opacity: 0 },
    ],
    { duration: 380 + Math.random() * 220, easing: "cubic-bezier(.2,.6,.4,1)" },
  ).onfinish = () => s.remove();
}

export function BrandDoor({ to, children }: { to: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();
  const run = useRef<{ stop: () => void } | null>(null);

  // Decide before the first paint, so the neon never shows ahead of the laser.
  useLayoutEffect(() => {
    if (wantsIntro()) ref.current?.setAttribute("data-brand", "pre");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getAttribute("data-brand") !== "pre") return;
    let dead = false;
    const timers: number[] = [];
    let raf = 0;
    let layer: HTMLDivElement | null = null;

    const settle = () => {
      if (dead) return;
      dead = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      layer?.remove();
      el.removeAttribute("data-brand");
      el.querySelector<HTMLElement>("[data-brand-fill]")?.style.removeProperty("clip-path");
      try { sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: it plays again, harmlessly */ }
    };
    run.current = { stop: settle };

    const play = () => {
      if (dead) return;
      const box = el.getBoundingClientRect();
      const mk = el.querySelector("[data-brand-mark]")!.getBoundingClientRect();
      const w = box.width, h = box.height, pad = 8;
      const k = mk.width / 22;
      const mx = mk.left - box.left, my = mk.top - box.top;
      const at = (p: { x: number; y: number }) => ({ x: mx + p.x * k, y: my + p.y * k });
      const a = at(C1), b = at(C2), r = R * k;
      const lens = at({ x: 11, y: 11 });

      layer = document.createElement("div");
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = `position:absolute;left:${-pad}px;top:${-pad}px;width:${w + pad * 2}px;height:${h + pad * 2}px;pointer-events:none;z-index:2;overflow:visible`;
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("width", String(w + pad * 2));
      svg.setAttribute("height", String(h + pad * 2));
      svg.style.overflow = "visible";
      const o = pad;
      const edge = `M${o} ${o} H${o + w} V${o + h} H${o} Z`;
      const ring = (c: { x: number; y: number }) =>
        `M${o + c.x} ${o + c.y - r} A${r} ${r} 0 1 1 ${o + c.x - 0.01} ${o + c.y - r}`;
      const mkPath = (d: string, stroke: string, width: number, glow: boolean) => {
        const p = document.createElementNS(ns, "path");
        p.setAttribute("d", d);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", stroke);
        p.setAttribute("stroke-width", String(width));
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("pathLength", "1");
        p.setAttribute("stroke-dasharray", "1");
        p.setAttribute("stroke-dashoffset", "1");
        if (glow) p.style.filter = `drop-shadow(0 0 3px ${NEON}) drop-shadow(0 0 7px ${NEON})`;
        svg.appendChild(p);
        return p;
      };
      // The scorch stays in the paper; the neon cut glows over it and cools.
      const scorch = [edge, ring(a), ring(b)].map((d) => mkPath(d, "rgba(74,46,18,.55)", 1.6, false));
      const hot = [edge, ring(a), ring(b)].map((d) => mkPath(d, NEON, 1.3, true));
      layer.appendChild(svg);
      const dot = document.createElement("span");
      dot.style.cssText = `position:absolute;left:0;top:0;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fff,0 0 14px ${NEON},0 0 26px ${NEON};opacity:0`;
      layer.appendChild(dot);
      el.appendChild(layer);

      // Edge 0 to 650ms; ring A 650 to 950; ring B 950 to 1250.
      const legs = [
        { i: 0, t0: 0, t1: 650 },
        { i: 1, t0: 650, t1: 950 },
        { i: 2, t0: 950, t1: 1250 },
      ];
      const start = performance.now();
      let lastSpark = 0;
      const tick = (now: number) => {
        if (dead) return;
        const t = now - start;
        const leg = legs.find((l) => t < l.t1);
        for (const l of legs) {
          const f = Math.min(1, Math.max(0, (t - l.t0) / (l.t1 - l.t0)));
          hot[l.i].setAttribute("stroke-dashoffset", String(1 - f));
          scorch[l.i].setAttribute("stroke-dashoffset", String(1 - f));
        }
        if (leg) {
          const f = Math.max(0, (t - leg.t0) / (leg.t1 - leg.t0));
          const p = hot[leg.i] as SVGPathElement;
          const pt = p.getPointAtLength(p.getTotalLength() * f);
          dot.style.transform = `translate(${pt.x}px,${pt.y}px)`;
          dot.style.opacity = "1";
          if (now - lastSpark > 28) {
            lastSpark = now;
            spark(layer!, pt.x, pt.y);
          }
          raf = requestAnimationFrame(tick);
        } else {
          dot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
        }
      };
      raf = requestAnimationFrame(tick);

      // The neon floods out from the lens, the words surface, the cut cools.
      timers.push(
        window.setTimeout(() => {
          if (dead) return;
          el.setAttribute("data-brand", "flood");
          const fill = el.querySelector<HTMLElement>("[data-brand-fill]")!;
          const far = Math.hypot(Math.max(lens.x, w - lens.x), Math.max(lens.y, h - lens.y));
          fill.animate(
            [
              { clipPath: `circle(0px at ${lens.x}px ${lens.y}px)` },
              { clipPath: `circle(${far + 2}px at ${lens.x}px ${lens.y}px)` },
            ],
            { duration: 420, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" },
          );
          hot.forEach((p) => p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: 160, fill: "forwards" }));
          scorch.forEach((p) => p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 300, fill: "forwards" }));
        }, 1250),
        window.setTimeout(settle, 1250 + 760),
      );
    };

    // After the arrival from Deep Field has settled, or once the door has risen.
    const begin = () => {
      const d = document.documentElement;
      if (d.dataset.arrive) {
        timers.push(window.setTimeout(begin, 80));
        return;
      }
      timers.push(window.setTimeout(play, d.dataset.arrived ? 180 : 1050));
    };
    begin();
    return settle;
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    run.current?.stop();
    if (still()) return; // the Link navigates as it always did
    e.preventDefault();
    const mk = ref.current!.querySelector("[data-brand-mark]")!.getBoundingClientRect();
    const cx = mk.left + mk.width / 2, cy = mk.top + mk.height / 2;
    const far = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));

    ref.current!.querySelector("[data-brand-lens]")?.animate(
      [{ fillOpacity: 0.55 }, { fillOpacity: 1 }],
      { duration: 160, fill: "forwards" },
    );

    // The glow runs ahead; the neon follows it out and becomes the room.
    const glow = document.createElement("div");
    glow.setAttribute("aria-hidden", "true");
    glow.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${far * 2.6}px;height:${far * 2.6}px;margin:${-far * 1.3}px 0 0 ${-far * 1.3}px;border-radius:50%;pointer-events:none;z-index:9998;background:radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(182,255,214,.85) 14%,rgba(47,255,143,.55) 34%,rgba(47,255,143,0) 62%);transform:scale(.01)`;
    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:9997;background:${NEON}`;
    document.body.append(veil, glow);

    glow.animate([{ transform: "scale(.01)" }, { transform: "scale(1)", offset: 0.75 }, { transform: "scale(1.15)", opacity: 0 }], {
      duration: 900,
      easing: "cubic-bezier(.5,0,.3,1)",
      fill: "forwards",
    }).onfinish = () => glow.remove();
    veil.animate(
      [
        { clipPath: `circle(0px at ${cx}px ${cy}px)`, background: NEON },
        { clipPath: `circle(${far + 4}px at ${cx}px ${cy}px)`, background: NEON, offset: 0.37 },
        { clipPath: `circle(${far + 4}px at ${cx}px ${cy}px)`, background: NEON, offset: 0.47 },
        { clipPath: `circle(${far + 4}px at ${cx}px ${cy}px)`, background: PARCH, opacity: 1, offset: 0.73 },
        { clipPath: `circle(${far + 4}px at ${cx}px ${cy}px)`, background: PARCH, opacity: 0 },
      ],
      { duration: 1500, easing: "cubic-bezier(.4,0,.3,1)", fill: "forwards" },
    ).onfinish = () => veil.remove();
    // Into the hall once the neon has the whole screen.
    window.setTimeout(() => {
      navigate(to);
      window.scrollTo(0, 0);
    }, 560);
  };

  return (
    <Link
      ref={ref}
      to={to}
      onClick={onClick}
      data-brand-door
      className="font-gloss relative inline-flex min-h-[44px] items-center justify-center gap-3 px-7 text-[15px] uppercase tracking-[0.14em] transition-[filter] duration-200 hover:brightness-[.88]"
      style={{ color: INK }}
    >
      <span data-brand-fill aria-hidden className="absolute inset-0" style={{ background: NEON }} />
      <span data-brand-face className="relative inline-flex items-center gap-3">
        <Mark />
        {children}
      </span>
    </Link>
  );
}
