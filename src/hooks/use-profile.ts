'use client'

import { useEffect, useState } from 'react'
import { useSupabase, useUser } from './use-supabase'
import type { Profile } from '@/types/database'

interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const { user, loading: userLoading } = useUser()
  const supabase = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .schema('lumeniq')
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userLoading) {
      fetchProfile()
    }
  }, [user, userLoading])

  return {
    profile,
    loading: loading || userLoading,
    error,
    refetch: fetchProfile,
  }
}

// Helper pour obtenir les initiales
export function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  return email.substring(0, 2).toUpperCase()
}

// Helper pour formater le nom du plan
export function formatPlanName(plan: string): string {
  const planNames: Record<string, string> = {
    standard: 'Standard',
    ml: 'ML',
    foundation: 'Foundation',
  }
  return planNames[plan] || plan
}
