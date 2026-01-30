'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Singleton pattern pour le client Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

interface UseUserReturn {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Récupérer l'utilisateur initial
    const getInitialUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          // Ignore "Auth session missing!" error - this is expected when not logged in
          if (error.message !== 'Auth session missing!') {
            setError(error)
          }
        }
        setUser(user)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get user'))
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}

export function useSupabase() {
  const supabase = useMemo(() => getSupabaseClient(), [])
  return supabase
}

// Hook pour le logout
export function useLogout() {
  const supabase = useSupabase()

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    // Le middleware redirigera automatiquement vers /login
    window.location.href = '/login'
  }

  return logout
}
