import { create } from "zustand";
import { PublicUser } from "@/types";

// Deliberately NOT persisted to localStorage/sessionStorage — the access
// token lives in memory only, per docs/AUTH_STRATEGY.md. On a hard refresh
// this store resets and `AuthProvider` silently calls /auth/refresh (which
// relies on the httpOnly refresh cookie) to re-hydrate it.
interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  isHydrating: boolean; // true until the initial refresh attempt resolves
  setSession: (user: PublicUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  setHydrating: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrating: true,
  setSession: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => set({ user: null, accessToken: null }),
  setHydrating: (isHydrating) => set({ isHydrating }),
}));
