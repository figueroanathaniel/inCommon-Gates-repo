import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

/*
  The Academy is a branch of inCommon's own site, served at /bazi/ on the same
  origin, so it reads the sign in inCommon already holds: the same project,
  the same stored session key. It never signs anybody in itself; the cover
  does that. Every rule inCommon applies before it treats a stored session as
  signed in is applied here too, or the two pages would disagree about who
  is reading:

  - a session from a browser that has since closed, when the reader did not
    ask to be remembered (the ephemeral mark without its cookie);
  - a session that still owes its two-step code (an aal1 token on an account
    with a verified authenticator).

  The anon key is public by design; row level security is the wall.
*/

export const PROJECT_URL = "https://lkzcybzhjjxdqetwwdrx.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxremN5Ynpoamp4ZHFldHd3ZHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NTYwMDcsImV4cCI6MjEwNTQzMjAwN30.jgsqfpPmbd2SM23R-E7KuRg3eWxsgvIhISBkhYC0mtM";
const EPHEMERAL_KEY = "incommon.signin.ephemeral";
const LIVE_COOKIE = "incommon_signin_live";

/** Where inCommon's cover opens its sign in form. */
export const SIGN_IN_HREF = "/?signin=1";

let client: SupabaseClient | null = null;
export function cloud(): SupabaseClient {
  if (!client) {
    client = createClient(PROJECT_URL, ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  }
  return client;
}

function closedWithBrowser(): boolean {
  try {
    if (localStorage.getItem(EPHEMERAL_KEY) !== "1") return false;
    return !new RegExp(`(^|;\\s*)${LIVE_COOKIE}=1(;|$)`).test(document.cookie || "");
  } catch {
    return false;
  }
}

function claims(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part + "===".slice((part.length + 3) % 4)));
  } catch {
    return null;
  }
}

/** The same rule as owesCode() in inCommon's cloud module. Unreadable owes. */
export function owesCode(s: Session): boolean {
  const f = (s.user as unknown as { factors?: { status?: string }[] }).factors;
  if (!Array.isArray(f) || !f.some((x) => x && x.status === "verified")) return false;
  const c = claims(s.access_token);
  return !(c && c.aal === "aal2");
}

export interface Reader { id: string; name: string; email: string | null }

/** The signed in inCommon reader, or null. Never asks the network to sign in. */
export async function currentReader(): Promise<Reader | null> {
  if (closedWithBrowser()) return null;
  const { data } = await cloud().auth.getSession();
  const s = data.session;
  if (!s || owesCode(s)) return null;
  const meta = (s.user.user_metadata ?? {}) as { full_name?: string };
  const first = (meta.full_name ?? "").trim().split(/\s+/)[0];
  const email = s.user.email ?? null;
  return { id: s.user.id, name: first || (email ? email.split("@")[0] : "Reader"), email };
}

/** Signs out this device only, as inCommon's Log Out does. */
export async function signOutHere(): Promise<void> {
  try {
    await cloud().auth.signOut({ scope: "local" });
  } catch {
    /* the stored session is gone either way */
  }
}
