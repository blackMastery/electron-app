import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { AuthUser, AuthSession } from '../lib/supabase'

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Get current session
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    },
    staleTime: Infinity,
  })
}

// Get current user
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    },
    staleTime: Infinity,
  })
}

// Sign in mutation
export function useSignIn() {
  const queryClient = useQueryClient()
  const { setUser, setSession } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      setUser(data.user)
      setSession(data.session)
      queryClient.setQueryData(authKeys.user(), data.user)
      queryClient.setQueryData(authKeys.session(), data.session)
    },
    onError: (error) => {
      console.error('Sign in error:', error)
    },
  })
}

// Sign up mutation
export function useSignUp() {
  const queryClient = useQueryClient()
  const { setUser, setSession } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data.user && data.session) {
        setUser(data.user)
        setSession(data.session)
        queryClient.setQueryData(authKeys.user(), data.user)
        queryClient.setQueryData(authKeys.session(), data.session)
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error)
    },
  })
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Sign out error:', error)
    },
  })
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    },
    onError: (error) => {
      console.error('Reset password error:', error)
    },
  })
}
