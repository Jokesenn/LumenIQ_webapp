'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase, useUser } from './use-supabase'
import type { ForecastConfigOverride, HorizonMonths, ConfidenceInterval } from '@/types/preferences'
import { DEFAULT_PREFERENCES } from '@/types/preferences'

interface UseUserPreferencesReturn {
  preferences: ForecastConfigOverride
  loading: boolean
  error: Error | null
  save: (newPrefs: ForecastConfigOverride) => Promise<void>
  hasChanged: (current: ForecastConfigOverride) => boolean
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const { user, loading: userLoading } = useUser()
  const supabase = useSupabase()
  const [preferences, setPreferences] = useState<ForecastConfigOverride>(DEFAULT_PREFERENCES)
  const [savedPreferences, setSavedPreferences] = useState<ForecastConfigOverride>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(DEFAULT_PREFERENCES)
      setSavedPreferences(DEFAULT_PREFERENCES)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Essayer de récupérer les préférences existantes
      const { data, error: selectError } = await supabase
        .schema('lumeniq')
        .from('user_preferences')
        .select('horizon_months, gating_enabled, confidence_interval')
        .eq('user_id', user.id)
        .maybeSingle()

      if (selectError) {
        throw selectError
      }

      if (data) {
        const prefs: ForecastConfigOverride = {
          horizon_months: data.horizon_months as HorizonMonths,
          gating_enabled: data.gating_enabled,
          confidence_interval: data.confidence_interval as ConfidenceInterval,
        }
        setPreferences(prefs)
        setSavedPreferences(prefs)
      }
      // Si pas de data, on garde DEFAULT_PREFERENCES (première visite)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des préférences'))
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!userLoading) {
      fetchPreferences()
    }
  }, [userLoading, fetchPreferences])

  const save = useCallback(async (newPrefs: ForecastConfigOverride) => {
    if (!user) return

    const { error: upsertError } = await supabase
      .schema('lumeniq')
      .from('user_preferences')
      .upsert(
        {
          user_id: user.id,
          horizon_months: newPrefs.horizon_months,
          gating_enabled: newPrefs.gating_enabled,
          confidence_interval: newPrefs.confidence_interval,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      throw upsertError
    }

    setSavedPreferences(newPrefs)
  }, [user, supabase])

  const hasChanged = useCallback((current: ForecastConfigOverride): boolean => {
    return (
      current.horizon_months !== savedPreferences.horizon_months ||
      current.gating_enabled !== savedPreferences.gating_enabled ||
      current.confidence_interval !== savedPreferences.confidence_interval
    )
  }, [savedPreferences])

  return {
    preferences,
    loading: loading || userLoading,
    error,
    save,
    hasChanged,
  }
}
