import { describe, expect, it } from "vitest";
import { CODE_LENGTH, cleanCode, makeCode, showCode } from "./share";

describe("the code a student hands a teacher", () => {
  it("is ten characters with no 0, O, 1 or I, and differs each time", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const c = makeCode();
      expect(c).toMatch(/^[A-HJ-NP-Z2-9]{10}$/);
      seen.add(c);
    }
    expect(seen.size).toBe(200);
    expect(CODE_LENGTH).toBe(10);
  });
  it("reads back however it was typed", () => {
    const c = makeCode();
    expect(cleanCode(showCode(c))).toBe(c);
    expect(cleanCode(` ${c.slice(0, 5).toLowerCase()}-${c.slice(5)} `)).toBe(c);
  });
  it("refuses what cannot be a code", () => {
    expect(cleanCode("")).toBeNull();
    expect(cleanCode("ABCDE")).toBeNull();
    expect(cleanCode("ABCDE FGH10")).toBeNull();
    expect(cleanCode("ABCDEFGHJKL")).toBeNull();
  });
});
