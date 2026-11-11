import { ReturnLink } from "./return";
import { Link, NavLink } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { setLang, useLangAttr, useZh } from "@/lib/lang";

/** 印 The seal of the house, set as a rubbing: ink on paper, never cinnabar. */
export function Seal({ char, size = 44, dark = false }: { char: string; size?: number; dark?: boolean }) {
  const zh = useZh();
  return (
    <span
      aria-hidden
      className="font-han inline-flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${dark ? "rgba(var(--txr),.7)" : "rgba(var(--ac2r),.8)"}`,
        color: dark ? "var(--tx)" : "var(--gilt)",
        fontSize: size * 0.52,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {zh ? (
        char
      ) : (
        <span
          className="inline-block rotate-45"
          style={{ width: size * 0.26, height: size * 0.26, border: `1.5px solid ${dark ? "rgba(var(--txr),.7)" : "rgba(var(--ac2r),.8)"}` }}
        />
      )}
    </span>
  );
}

/** A thin rule with a small square at its heart, in the manner of a thread binding. */
export function Rule({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <div className={`h-px flex-1 ${dark ? "rule-fade-dark" : "rule-fade"}`} />
      <span
        className="inline-block rotate-45"
        style={{ width: 6, height: 6, border: `1px solid ${dark ? "rgba(var(--txr),.55)" : "rgba(var(--ac2r),.7)"}` }}
      />
      <div className={`h-px flex-1 ${dark ? "rule-fade-dark" : "rule-fade"}`} />
    </div>
  );
}

/** 玉 The one primary action of the house, jade, reserved for what carries the reader forward. */
export function JadeButton({
  children,
  onClick,
  to,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
}) {
  const cls =
    "font-gloss inline-flex min-h-[44px] items-center justify-center gap-2 px-7 text-[15px] tracking-[0.14em] uppercase transition-all duration-200 hover:brightness-[.88]";
  const style = {
    background: disabled ? "rgba(47,255,143,.25)" : "#2fff8f",
    color: "#141418", /* the ink on jade, fixed in both looks */
    cursor: disabled ? "default" : "pointer",
  } as const;
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  );
}

/** A quiet secondary action, ink-bordered, never jade. */
export function GhostButton({
  children,
  onClick,
  to,
  dark = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  dark?: boolean;
}) {
  const style = {
    border: `1px solid ${dark ? "rgba(var(--txr),.45)" : "rgba(var(--txr),.35)"}`,
    color: dark ? "var(--tx)" : "rgba(var(--txr),.85)",
  } as const;
  const cls =
    "font-gloss inline-flex min-h-[44px] items-center justify-center gap-2 px-6 text-[14px] tracking-[0.12em] uppercase transition-colors duration-200 hover:border-gilt";
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

const NAV = [
  { to: "/", hanzi: "門", english: "Gate", end: true },
  { to: "/hall", hanzi: "廳", english: "Hall", end: false },
  { to: "/glossary", hanzi: "典", english: "Glossary", end: false },
  { to: "/stone", hanzi: "命盤", english: "Destiny Chart", end: false },
  { to: "/desk", hanzi: "案", english: "Desk", end: false },
  { to: "/register", hanzi: "冊", english: "Register", end: false },
];

/**
 * The shell of the house. One breakpoint, at 820px, as the law of the parent
 * house requires: beneath it the plaque folds into the lintel, above it the
 * plaque hangs at the right edge as it would on a wooden hall.
 */
export function Shell({ children, paper = false }: { children: ReactNode; paper?: boolean }) {
  const { user, isSignedIn } = useAuth();
  const zh = useZh();
  useLangAttr();
  return (
    <div className="min-h-[100dvh]" style={{ background: "transparent", color: "var(--tx)" }}>
      {/* The lintel */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: paper ? "rgba(var(--bgr),.94)" : "rgba(var(--bgr),.94)",
          borderColor: paper ? "rgba(var(--txr),.18)" : "rgba(var(--ac2r),.22)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 min-[820px]:px-10">
          <ReturnLink dim="rgba(var(--txr),.75)" />
          <Link to="/" className="flex min-h-[44px] items-center gap-3" aria-label={zh ? "八字書院，回門" : "The Eight Characters Academy, to the Gate"}>
            <Seal char="書" size={34} dark={paper} />
            <span className="flex flex-col leading-tight">
              {zh ? (
                <span className="font-han text-[17px] font-semibold tracking-[0.3em]">八字書院</span>
              ) : (
                <span className="font-gloss text-[13px] font-semibold uppercase tracking-[0.22em]">The Eight Characters Academy</span>
              )}
            </span>
          </Link>
          <nav className="ml-auto flex flex-wrap items-center" aria-label={zh ? "書院各室" : "The rooms of the house"}>
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className="group flex min-h-[44px] min-w-[44px] flex-col items-center justify-center px-2.5"
                aria-label={zh ? n.hanzi : n.english}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={(zh ? "font-han text-[16px]" : "font-gloss text-[12px] uppercase tracking-[0.14em]") + " leading-none transition-colors duration-200 group-hover:text-gilt"}
                      style={{ color: isActive ? "var(--gilt)" : paper ? "rgba(var(--txr),.75)" : "rgba(var(--txr),.75)" }}
                    >
                      {zh ? n.hanzi : n.english}
                    </span>
                    <span
                      className="mt-1 block h-px w-full transition-all duration-200"
                      style={{ background: isActive ? "var(--gilt)" : "transparent" }}
                      aria-hidden
                    />
                  </>
                )}
              </NavLink>
            ))}
            <button
              type="button"
              data-lang-switch
              lang={zh ? "en" : "zh-Hant"}
              onClick={() => setLang(zh ? "en" : "zh")}
              className={(zh ? "font-gloss tracking-[0.12em] uppercase" : "font-han tracking-[0.2em]") + " ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center border px-3 text-[13px] transition-colors duration-200 hover:text-gilt"}
              style={{ borderColor: "rgba(var(--txr),.3)", color: "rgba(var(--txr),.85)" }}
            >
              {zh ? "English" : "中文"}
            </button>
            {isSignedIn ? (
              <>
              <span className="mx-2 hidden h-5 w-px min-[820px]:block" style={{ background: "rgba(var(--txr),.2)" }} aria-hidden />
              <Link
                to="/register"
                className="font-gloss flex min-h-[44px] items-center px-2 text-[13px] tracking-[0.12em] uppercase hover:text-gilt"
                style={{ color: "rgba(var(--txr),.75)" }}
              >
                {user?.name ?? (zh ? "讀者" : "Reader")}
              </Link>
              </>
            ) : null}
          </nav>
        </div>
      </header>

      {/* 牌匾 The name plaque, hanging at the right edge above 820px */}
      <div
        aria-hidden
        className="fixed right-0 top-1/3 z-30 hidden min-[820px]:flex vertical-rl items-center border px-2 py-6"
        style={{
          writingMode: "vertical-rl",
          background: "rgba(var(--sfr),.84)",
          borderColor: "rgba(var(--ac2r),.55)",
          color: "var(--paper)",
          letterSpacing: "0.55em",
        }}
      >
        <span className={zh ? "font-han text-[20px] font-bold" : "font-gloss text-[14px] font-semibold uppercase"}>{zh ? "八字書院" : "The Eight Characters Academy"}</span>
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 min-[820px]:px-10">{children}</main>

      <footer className="mx-auto mt-24 max-w-6xl px-5 pb-14 min-[820px]:px-10">
        <Rule dark={paper} />
        <div className="mt-8 flex flex-col gap-2 min-[820px]:flex-row min-[820px]:items-end min-[820px]:justify-between">
          <p className={(zh ? "font-han tracking-[0.35em]" : "font-gloss italic") + " text-[13px]"} style={{ color: "rgba(var(--txr),.66)" }}>
            {zh ? "一命二運三風水，四積陰德五讀書" : "First fate, second fortune, third the lie of the land, fourth quiet kindness, fifth study."}
          </p>
          <p className="font-gloss text-[13px]" style={{ color: "rgba(var(--txr),.66)" }}>
            {zh ? "inCommon 之一支。命盤示其種，耕耘在你。" : "A branch of inCommon. The chart shows the seed; the tending is yours."}
          </p>
        </div>
      </footer>
    </div>
  );
}
