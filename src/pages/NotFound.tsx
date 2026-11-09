import { Shell, Seal, GhostButton } from "@/components/academy/chrome";

export default function NotFound() {
  return (
    <Shell>
      <section className="flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
        <Seal char="迷" size={52} />
        <h1 className="font-han mt-8 text-[30px] font-bold tracking-[0.15em] text-[var(--tx)]">迷路 · 404</h1>
        <p className="font-gloss mt-4 max-w-md text-[15.5px] italic leading-relaxed text-[rgba(var(--txr),.65)]">
          This corridor does not exist in the house. Even a good reader loses the way once;
          the gate is never far.
        </p>
        <div className="mt-10"><GhostButton to="/">Return to the Gate 門</GhostButton></div>
      </section>
    </Shell>
  );
}
