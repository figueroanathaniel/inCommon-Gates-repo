// The arrival from incommonspace.com. index.html decides whether it plays
// (a fresh incommon.bazi.handoff key, or ?arrive=1) and sets
// html[data-look="field"][data-arrive="1"]. This runs once React has drawn
// the first room: the blocks of the page are drawn as frames in Deep Field,
// strata of earth rise over the whole screen, the page turns to parchment
// beneath them, and each block settles into place in ink. About 1.5s.

const STRATA = ["#d6c8a6", "#e2d6b8", "#cdbd98", "#e9dfc6", "#dacca9", "#f2ecdc"];

function blocksOf(): HTMLElement[] {
  // The page's own structure: the header, the footer, and the content of the
  // room broken down until no piece is taller than half the screen.
  const out: HTMLElement[] = [];
  const vh = window.innerHeight;
  const visible = (el: Element): el is HTMLElement => {
    if (!(el instanceof HTMLElement)) return false;
    const r = el.getBoundingClientRect();
    return r.height >= 8 && r.width >= 8 && r.bottom > 0 && r.top < vh;
  };
  const walk = (el: Element, depth: number) => {
    if (!visible(el)) return;
    const kids = Array.from(el.children).filter(visible);
    if (depth < 4 && kids.length > 0 && (kids.length === 1 || el.getBoundingClientRect().height > vh * 0.45)) {
      kids.forEach((k) => walk(k, depth + 1));
    } else out.push(el);
  };
  const header = document.querySelector("#root header");
  if (header && visible(header)) out.push(header);
  const main = document.querySelector("#root main");
  if (main) Array.from(main.children).forEach((c) => walk(c, 0));
  const footer = document.querySelector("#root footer");
  if (footer && visible(footer)) out.push(footer);
  return out.slice(0, 18);
}

export function runArrival() {
  const d = document.documentElement;
  if (d.dataset.arrive !== "1") return;
  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  let layer: HTMLDivElement | null = null;
  const finish = () => {
    timers.forEach(clearTimeout);
    layer?.remove();
    document.querySelectorAll("[data-arr]").forEach((el) => el.removeAttribute("data-arr"));
    d.removeAttribute("data-look");
    d.removeAttribute("data-arrive");
    d.setAttribute("data-arrived", "1");
  };
  try {
    const blocks = blocksOf();
    blocks.forEach((b) => b.setAttribute("data-arr", ""));
    d.dataset.arrive = "2";

    layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    const ground = document.createElement("div");
    ground.className = "arr-layer";
    ground.style.zIndex = "9998";
    const frames = document.createElement("div");
    frames.className = "arr-layer";
    frames.style.zIndex = "9999";
    layer.append(ground, frames);
    document.body.append(layer);

    // 0 to 500ms: the structure draws itself in space.
    const frameEls = blocks.map((b, i) => {
      const r = b.getBoundingClientRect();
      const f = document.createElement("div");
      f.className = "arr-frame";
      Object.assign(f.style, {
        left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
        animationDelay: `${i * 30}ms`,
      });
      frames.append(f);
      return f;
    });

    // 300 to 950ms: the earth comes up in strata from the bottom.
    const n = STRATA.length;
    at(300, () => {
      STRATA.forEach((c, i) => {
        const s = document.createElement("div");
        s.className = "arr-stratum";
        Object.assign(s.style, {
          bottom: `${(i * 100) / n}%`,
          height: `${100 / n + 2}%`,
          backgroundColor: c,
          animationDelay: `${i * 55}ms`,
        });
        ground.append(s);
      });
    });
    at(520, () => frameEls.forEach((f) => f.classList.add("ink")));

    // 950ms: under the earth the page becomes parchment.
    at(950, () => d.removeAttribute("data-look"));

    // 1000 to 1550ms: the earth settles into the page and each block is set
    // back in its place, in order.
    at(1000, () => {
      ground.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" });
      frameEls.forEach((f) => (f.style.opacity = "0"));
      blocks.forEach((b, i) => {
        b.removeAttribute("data-arr");
        b.animate(
          [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
          { duration: 420, delay: i * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
        );
      });
    });
    at(1000 + blocks.length * 45 + 460, finish);
    window.setTimeout(() => { if (d.dataset.arrive) finish(); }, 4000);
  } catch {
    finish();
  }
}
