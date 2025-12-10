import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { env } from '@/config/env'
import type { UserProfile } from '@/types/api'

type AuthState = {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  hydrated: boolean
  setToken: (token: string | null) => void
  setUser: (user: UserProfile | null) => void
  signOut: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setToken: (token) => set({ token, isAuthenticated: Boolean(token) }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null, isAuthenticated: false, hydrated: true }),
      initialize: async () => {
        if (get().hydrated) return
        const token = get().token
        if (!token) {
          set({ hydrated: true })
          return
        }
        try {
          const response = await fetch(`${env.API_BASE_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (!response.ok) {
            throw new Error(`Failed to bootstrap auth: ${response.statusText}`)
          }
          const profile = (await response.json()) as UserProfile
          set({ user: profile, isAuthenticated: true, hydrated: true })
        } catch (error) {
          console.warn('Auth initialization failed', error)
          set({ token: null, user: null, isAuthenticated: false, hydrated: true })
        }
      },
    }),
    {
      name: 'studymind-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)

export const selectAuthToken = () => useAuthStore.getState().token
