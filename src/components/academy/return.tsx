import type { MouseEvent } from "react";
import { useZh } from "@/lib/lang";

/**
 * The way back to inCommon, in the lintel of every room.
 *
 * It is a real link to inCommon's Settings, where the reader left from, so it
 * works with every script dead and opens in a new tab like any link. A plain
 * press plays the Academy's half of the return: the parchment gives way and
 * the house sinks into the dark of Deep Field from the place that was pressed
 * (about 650ms). Then it leaves a one time key, incommon.bazi.return =
 * {v:1,t}, which inCommon reads once at boot, within 15 seconds, to fade its
 * own app up from #05060a. Under reduced motion it simply goes.
 */
export const INCOMMON_HREF = "/app.html#/settings";
export const RETURN_KEY = "incommon.bazi.return";

const FIELD = "#05060a";

function Rings() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden className="shrink-0">
      <circle cx="8" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function leave() {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify({ v: 1, t: Date.now() }));
  } catch {
    /* without storage inCommon simply opens as it always does */
  }
  location.assign(INCOMMON_HREF);
}

function play(e: MouseEvent<HTMLAnchorElement>) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return leave();

  const r = e.currentTarget.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const veil = document.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  veil.style.cssText =
    `position:fixed;inset:0;z-index:9999;pointer-events:none;` +
    `background:radial-gradient(circle at ${x}px ${y}px, rgba(47,79,214,.38), ${FIELD} 60%);` +
    `clip-path:circle(0px at ${x}px ${y}px)`;
  document.body.appendChild(veil);

  const main = document.querySelector("main");
  const fade = main?.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(14px)" },
    ],
    { duration: 420, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" },
  );
  const a = veil.animate(
    [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${far}px at ${x}px ${y}px)` }],
    { duration: 650, easing: "cubic-bezier(.55,0,.25,1)", fill: "forwards" },
  );
  /* Back from inCommon through the browser's cache brings this page as it was
     left: take the dark away again. */
  addEventListener(
    "pageshow",
    (ev) => {
      if (!ev.persisted) return;
      a.cancel();
      fade?.cancel();
      veil.remove();
    },
    { once: true },
  );
  let gone = false;
  const go = () => {
    if (gone) return;
    gone = true;
    leave();
  };
  a.finished.then(go, go);
  setTimeout(go, 900);
}

export function ReturnLink({ dim }: { dim: string }) {
  const zh = useZh();
  return (
    <a
      href={INCOMMON_HREF}
      onClick={play}
      className="font-gloss flex min-h-[44px] items-center gap-2 pr-2 text-[13px] tracking-[0.12em] hover:text-gilt"
      style={{ color: dim }}
    >
      <span aria-hidden className="text-[15px] leading-none">‹</span>
      <Rings />
      <span>{zh ? "返回 inCommon" : "Back to inCommon"}</span>
    </a>
  );
}
