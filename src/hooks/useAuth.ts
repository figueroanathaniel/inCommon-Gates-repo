import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";
import { leave, useWho } from "@/providers/data";

type UseAuthOptions = { redirectOnUnauthenticated?: boolean; redirectPath?: string };

/** Who is reading: a signed in inCommon reader, a guest on this device, or nobody yet. */
export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } = options ?? {};
  const navigate = useNavigate();
  const w = useWho();
  const user = w.data ?? null;

  const logout = useCallback(() => {
    void leave().then(() => navigate("/"));
  }, [navigate]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !w.isLoading && !user) navigate(redirectPath);
  }, [redirectOnUnauthenticated, w.isLoading, user, navigate, redirectPath]);

  return useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading: w.isLoading, error: w.error, logout, refresh: w.refetch }),
    [user, w.isLoading, w.error, logout, w.refetch],
  );
}
