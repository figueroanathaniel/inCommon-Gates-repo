import { useNavigate, useSearchParams } from "react-router";
import { Shell, Seal, GhostButton, Rule } from "@/components/academy/chrome";
import { enterAsGuest } from "@/providers/data";
import { useAuth } from "@/hooks/useAuth";
import { SIGN_IN_HREF } from "@/lib/cloud";

/*
  The Register's door. The Academy is a branch of inCommon, so a reader's
  page here is their inCommon account: signing in happens at inCommon's own
  door, and this page only points there. A guest keeps their page on this
  device instead.
*/
export default function Login() {
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Shell>
      <section className="flex min-h-[70dvh] flex-col items-center justify-center py-20">
        <Seal char="籍" size={52} />
        <h1 className="font-han mt-8 text-center text-[30px] font-bold tracking-[0.15em] text-[var(--tx)]">入籍 · 簽名</h1>
        <p className="font-gloss mt-3 text-center text-[13px] uppercase tracking-[0.28em] text-[var(--gilt)]">
          Write your name in the Register
        </p>
        <Rule className="mt-10 w-full max-w-xs" />
        <p className="font-gloss mt-8 max-w-md text-center text-[15.5px] leading-relaxed text-[rgba(var(--txr),.72)]">
          The house keeps one page for every reader: the scrolls unrolled, the charts kept at the Desk.
          Your inCommon account opens your page, wherever you sign in to it. The scrolls themselves
          remain the same for every ear that enters.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          {user && !user.guest ? (
            <p className="font-gloss text-center text-[15px] text-[var(--tx)]">
              The house already holds your name, {user.name}.
            </p>
          ) : (
            <a
              href={SIGN_IN_HREF}
              className="font-gloss inline-flex min-h-[44px] items-center justify-center gap-2 px-7 text-[15px] uppercase tracking-[0.14em] transition-all duration-200 hover:brightness-[.88]"
              style={{ background: "#2fff8f", color: "#141418" }}
            >
              Sign in with inCommon 入
            </a>
          )}
        </div>

        <Rule className="mt-12 w-full max-w-xs" />
        <div className="mt-8 flex flex-col items-center gap-3">
          <GhostButton
            onClick={() => {
              void enterAsGuest().then(() => navigate(next.startsWith("/") ? next : "/"));
            }}
          >
            Enter as a guest 客
          </GhostButton>
          <p className="font-gloss max-w-xs text-center text-[12.5px] italic leading-relaxed text-[rgba(var(--txr),.66)]">
            A guest's page lives in this browser alone. Clear it or come through another door,
            and the marks upon it cannot be found again.
          </p>
        </div>
      </section>
    </Shell>
  );
}
