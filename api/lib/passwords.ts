import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N?: number; r?: number; p?: number },
) => Promise<Buffer>;

// scrypt parameters: N (cost), r (block size), p (parallelism). Stored in the
// hash string itself so the parameters can be raised later without breaking
// keys already written in the Register.
const N = 16384;
const r = 8;
const p = 1;
const KEYLEN = 64;

/** Hash a password for storage: "scrypt$N$r$p$salt$hash", base64 fields. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEYLEN, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/** Verify a password against a stored hash. Constant-time on the key bytes. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nS, rS, pS, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const key = await scryptAsync(password, salt, expected.length, {
    N: Number(nS),
    r: Number(rS),
    p: Number(pS),
  });
  if (key.length !== expected.length) return false;
  return timingSafeEqual(key, expected);
}
