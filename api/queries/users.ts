import { eq, isNotNull, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

/**
 * True while no keyed account exists yet. The first name written with a key
 * carries the seal of the house (admin), so the house can never be left with
 * no hand able to inscribe the Stone.
 */
export async function hasKeyedAccount(): Promise<boolean> {
  const rows = await getDb()
    .select({ n: sql<number>`count(*)` })
    .from(schema.users)
    .where(isNotNull(schema.users.passwordHash));
  return Number(rows.at(0)?.n ?? 0) > 0;
}

export async function createUser(data: InsertUser) {
  await getDb().insert(schema.users).values(data);
  return findUserByUnionId(data.unionId);
}

export async function touchLastSignIn(unionId: string) {
  await getDb()
    .update(schema.users)
    .set({ lastSignInAt: new Date() })
    .where(eq(schema.users.unionId, unionId));
}
