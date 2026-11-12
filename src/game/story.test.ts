import { describe, expect, it } from "vitest";
import type { FourPillars } from "@contracts/bazi";
import { buildStory, closing, parts, plain, type Leg } from "./story";
import { KEEPER_INVITE, ONWARD } from "./script";
import type { L } from "./script";

const DASH = new RegExp("[" + String.fromCharCode(8212, 8211) + "]");
const CJK = /[㐀-鿿]/;
const LATIN = /[A-Za-z]/;

function lines(leg: Leg): L[] {
  const out: L[] = [leg.name, ...leg.meet.map((b) => b.line), ...leg.after.map((b) => b.line)];
  if (leg.arrive) out.push(leg.arrive);
  if (leg.choice) {
    out.push(leg.choice.prompt);
    for (const o of leg.choice.options) out.push(o.label, o.reply);
  }
  return out;
}

describe("the road of a chart", () => {
  it("reads cleanly in both languages for every day pillar", () => {
    let seen = 0;
    for (let s = 0; s < 10; s++) for (let b = 0; b < 12; b++) {
      if ((s + b) % 2) continue;
      const p: FourPillars = {
        yearStem: (s + 3) % 10, yearBranch: (b + 5) % 12, monthStem: (s + 6) % 10, monthBranch: (b + 2) % 12,
        dayStem: s, dayBranch: b, hourStem: (s + 9) % 10, hourBranch: (b + 7) % 12,
      };
      for (const luck of [null, (s + 4) % 10]) {
        const legs = buildStory(p, luck);
        expect(legs.length).toBe(luck === null ? 6 : 7);
        expect(legs[0].exit).toBe("grow");
        expect(legs[legs.length - 1].exit).toBe("end");
        for (const leg of legs) for (const line of [...lines(leg), ONWARD, ...closing(["stand", "room"])]) {
          for (const zh of [false, true]) {
            const ps = parts(line, leg.vars, zh);
            // Outside its tokens a line stays in its own language.
            const prose = ps.filter((x) => typeof x === "string").join("");
            const whole = plain(ps, zh);
            expect(whole).not.toMatch(/\{|\}|undefined|\[object/);
            expect(whole).not.toMatch(DASH);
            expect(whole.trim().length).toBeGreaterThan(0);
            if (zh) { expect(prose).not.toMatch(LATIN); expect(whole).not.toMatch(LATIN); }
            else expect(prose).not.toMatch(CJK);
            seen++;
          }
        }
      }
    }
    expect(seen).toBeGreaterThan(1000);
  });

  it("starts in the place of the Day Branch's phase", () => {
    // 寅 is wood, 午 is fire, 子 is water, 辰 is earth, 申 is metal.
    const want: [number, string][] = [[2, "wood"], [6, "fire"], [0, "water"], [4, "earth"], [8, "metal"]];
    for (const [b, env] of want) {
      const legs = buildStory({ yearStem: 0, yearBranch: 0, monthStem: 2, monthBranch: 2, dayStem: 0, dayBranch: b, hourStem: 4, hourBranch: 4 }, null);
      expect(legs[1].spec.env).toBe(env);
    }
  });

  it("lets the Keeper's last words turn on how the walker chose", () => {
    const a = closing(["stand", "stand", "room"])[0].en;
    const b = closing(["room", "room", "stand"])[0].en;
    const c = closing([])[0].en;
    expect(new Set([a, b, c]).size).toBe(3);
    expect(KEEPER_INVITE.options.every((o) => o.tag === null)).toBe(true);
  });
});
