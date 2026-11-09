import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Shell, Seal, JadeButton, GhostButton, Rule } from "@/components/academy/chrome";
import { trpc } from "@/providers/trpc";

const field =
  "font-gloss min-h-[44px] w-full border bg-transparent px-3 text-[15px] text-[var(--tx)] placeholder:text-[rgba(var(--txr),.66)]";
const border = { borderColor: "rgba(var(--txr),.3)" } as const;
const labelCls =
  "font-gloss mb-1 block text-left text-[12px] uppercase tracking-[0.18em] text-[rgba(var(--txr),.66)]";

export default function Login() {
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const done = async () => {
    await utils.invalidate();
    navigate(next.startsWith("/") ? next : "/");
  };
  const login = trpc.auth.login.useMutation({ onSuccess: done });
  const register = trpc.auth.register.useMutation({ onSuccess: done });
  const guest = trpc.auth.guest.useMutation({ onSuccess: done });

  const active = mode === "signin" ? login : register;
  const error = active.error ?? guest.error;
  const pending = login.isPending || register.isPending || guest.isPending;

  const submit = () => {
    if (mode === "signin") {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, name: name.trim() || undefined });
    }
  };

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
          An email and a key of your choosing open your page. The scrolls themselves remain the same
          for every ear that enters.
        </p>

        <div className="mt-10 grid w-full max-w-sm gap-4">
          {mode === "register" ? (
            <label className="block">
              <span className={labelCls}>A name for the page</span>
              <input
                className={field}
                style={border}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                placeholder="As you would have it written"
              />
            </label>
          ) : null}
          <label className="block">
            <span className={labelCls}>Email</span>
            <input
              type="email"
              className={field}
              style={border}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={320}
              autoComplete="email"
              placeholder="you@wherever.com"
            />
          </label>
          <label className="block">
            <span className={labelCls}>{mode === "signin" ? "Your key" : "Choose a key, eight characters or more"}</span>
            <input
              type="password"
              className={field}
              style={border}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email && password) submit();
              }}
            />
          </label>
          {error ? (
            <p className="font-gloss text-left text-[13.5px]" style={{ color: "var(--warn)" }} role="alert">
              {error.message}
            </p>
          ) : null}
          <div className="mt-2 flex flex-col items-center gap-4">
            <JadeButton onClick={submit} disabled={!email || !password || pending}>
              {mode === "signin" ? "Sign in 入" : "Write my name 冊"}
            </JadeButton>
            <GhostButton
              onClick={() => {
                setMode(mode === "signin" ? "register" : "signin");
                login.reset();
                register.reset();
              }}
            >
              {mode === "signin" ? "First time at this door" : "My name is already written"}
            </GhostButton>
          </div>
        </div>

        <Rule className="mt-12 w-full max-w-xs" />
        <div className="mt-8 flex flex-col items-center gap-3">
          <GhostButton onClick={() => { if (!pending) guest.mutate(); }}>
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
