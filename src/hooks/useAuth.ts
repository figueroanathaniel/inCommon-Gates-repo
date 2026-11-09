import { useMemo } from "react";
import { useWho } from "@/providers/data";

/** Who is reading: the inCommon reader signed in on this browser, or a guest on this device. */
export function useAuth() {
  const w = useWho();
  const user = w.data ?? null;
  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isSignedIn: !!user && !user.guest,
      isLoading: w.isLoading,
      error: w.error,
      refresh: w.refetch,
    }),
    [user, w.isLoading, w.error, w.refetch],
  );
}
