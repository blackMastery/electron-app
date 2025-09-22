import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseUrl = "https://vlplrdjuzxmgtbflpgeg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscGxyZGp1enhtZ3RiZmxwZ2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMzUzNzAsImV4cCI6MjAyOTcxMTM3MH0.ZoBKgxdo_nG6WecfREa_QuyNi1-XS4kkTVH7kIVRs04"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Auth types
export type AuthUser = {
  id: string
  email?: string
  user_metadata?: {
    [key: string]: any
  }
}

export type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: AuthUser
}
