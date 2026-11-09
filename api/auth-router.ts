import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { hashPassword, verifyPassword } from "./lib/passwords";
import { signSessionToken } from "./lib/session";
import { env } from "./lib/env";
import { log } from "./lib/logger";
import {
  createUser,
  findUserByEmail,
  hasKeyedAccount,
  touchLastSignIn,
} from "./queries/users";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import type { TrpcContext } from "./context";

function serializeSessionCookie(headers: Headers, value: string, maxAge: number) {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(Session.cookieName, value, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge,
  });
}

/** Sign the session and set the cookie on the response being built. */
async function issueSession(ctx: TrpcContext, unionId: string) {
  const token = await signSessionToken({ unionId, clientId: env.appId });
  ctx.resHeaders.append(
    "set-cookie",
    serializeSessionCookie(ctx.req.headers, token, Session.maxAgeMs / 1000),
  );
}

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("That does not read as an email address.")
  .max(320);
const passwordSchema = z
  .string()
  .min(8, "The key needs at least eight characters.")
  .max(128);

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  /** Write a new name in the Register: email and a key of the reader's choosing. */
  register: publicQuery
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
        name: z.string().trim().min(1).max(120).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "That email is already written in the Register. Sign in with its key instead.",
        });
      }
      const passwordHash = await hashPassword(input.password);
      // The first keyed account carries the seal of the house.
      const role = (await hasKeyedAccount()) ? ("user" as const) : ("admin" as const);
      const user = await createUser({
        unionId: `email:${input.email}`,
        email: input.email,
        name: input.name || input.email.split("@")[0],
        passwordHash,
        role,
        lastSignInAt: new Date(),
      });
      if (!user) {
        log.error("register: user row missing after insert", { email: input.email });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      await issueSession(ctx, user.unionId);
      const { passwordHash: _withheld, ...safeUser } = user;
      return { user: safeUser };
    }),

  /** Open the Register with an email and its key. */
  login: publicQuery
    .input(z.object({ email: emailSchema, password: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const user = await findUserByEmail(input.email);
      // Verify against a padded blank hash even when no such name exists, so a
      // guess cannot tell "no such email" from "wrong key" by the timing.
      const stored =
        user?.passwordHash ??
        `scrypt$16384$8$1$${Buffer.from("empty-hall").toString("base64")}$${Buffer.alloc(64).toString("base64")}`;
      const ok = await verifyPassword(input.password, stored);
      if (!user || !user.passwordHash || !ok) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The Register holds no such pairing of email and key.",
        });
      }
      await touchLastSignIn(user.unionId);
      await issueSession(ctx, user.unionId);
      const { passwordHash: _withheld, ...safeUser } = user;
      return { user: safeUser };
    }),

  /**
   * Enter as a guest: a page in the Register with no name and no key.
   * The page lives in the session cookie; a reader who clears it or comes
   * through another door will not find their marks again.
   */
  guest: publicQuery.mutation(async ({ ctx }) => {
    const user = await createUser({
      unionId: `guest:${crypto.randomUUID()}`,
      name: "Guest",
      lastSignInAt: new Date(),
    });
    if (!user) {
      log.error("guest: user row missing after insert", {});
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    await issueSession(ctx, user.unionId);
    const { passwordHash: _withheld, ...safeUser } = user;
    return { user: safeUser };
  }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append(
      "set-cookie",
      serializeSessionCookie(ctx.req.headers, "", 0),
    );
    return { success: true };
  }),
});
