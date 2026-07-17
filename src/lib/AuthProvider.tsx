"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

// On first mount (app load / hard refresh), the Zustand store is empty even
// if the user has a valid httpOnly refresh cookie from a previous session.
// This silently tries /auth/refresh once, and if it succeeds, follows up
// with /auth/profile to restore the user object — giving a seamless
// "still logged in" experience without ever touching localStorage.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const setHydrating = useAuthStore((s) => s.setHydrating);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const { accessToken } = await authService.refresh();
        console.log("Hydrating session with access token:", accessToken);
        useAuthStore.getState().setAccessToken(accessToken);
        const user = await authService.getProfile();
        if (!cancelled) setSession(user, accessToken);
      } catch {
        // No valid refresh cookie — user is simply logged out. Not an error.
      } finally {
        if (!cancelled) setHydrating(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
