import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./lib/authenticate";

/** The reader as the client may see them: the key hash never leaves the server. */
export type SafeUser = Omit<User, "passwordHash">;

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: SafeUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    const { passwordHash: _withheld, ...user } = await authenticateRequest(
      opts.req.headers,
    );
    ctx.user = user;
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
