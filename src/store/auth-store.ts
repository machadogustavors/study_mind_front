import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserProfile } from '@/types/api'

type AuthState = {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setUser: (user: UserProfile | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: Boolean(token) }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'studymind-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)

export const selectAuthToken = () => useAuthStore.getState().token
