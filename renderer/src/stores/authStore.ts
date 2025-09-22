import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, AuthSession } from '../lib/supabase'

interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setSession: (session: AuthSession | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      session: null,
      isLoading: true,
      isInitialized: false,

      // Actions
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      clearAuth: () => set({ 
        user: null, 
        session: null, 
        isLoading: false,
        isInitialized: true 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isInitialized: state.isInitialized,
      }),
    }
  )
)

// Selectors for better performance
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthSession = () => useAuthStore((state) => state.session)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user)
