/*
  符 The code a student hands a teacher. Ten characters from an alphabet with
  no 0, O, 1 or I, made on this device from the browser's own randomness.
  The account keeps it only until a teacher takes it up.
*/

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 10;

export function makeCode(): string {
  const out: string[] = [];
  const buf = new Uint8Array(1);
  while (out.length < CODE_LENGTH) {
    crypto.getRandomValues(buf);
    // 256 is a multiple of 32, so the low five bits are even over the alphabet.
    out.push(ALPHABET[buf[0] & 31]);
  }
  return out.join("");
}

/** What was typed, as the account holds it: no spaces or hyphens, capitals. Null when it cannot be a code. */
export function cleanCode(typed: string): string | null {
  const c = typed.replace(/[\s-]/g, "").toUpperCase();
  if (c.length !== CODE_LENGTH) return null;
  for (const ch of c) if (!ALPHABET.includes(ch)) return null;
  return c;
}

/** In two groups of five, so it can be read aloud. */
export const showCode = (code: string) => `${code.slice(0, 5)} ${code.slice(5)}`;
