'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ForecastJob, JobStatus } from '@/types/database'

interface UseJobStatusReturn {
  job: ForecastJob | null
  loading: boolean
  error: string | null
  isComplete: boolean
  isFailed: boolean
  isProcessing: boolean
  isPending: boolean
  refetch: () => Promise<void>
}

/**
 * Hook pour poller le statut d'un job forecast
 * @param jobId - L'ID du job à surveiller
 * @param pollInterval - Intervalle de polling en ms (défaut: 3000ms)
 * @param enabled - Activer/désactiver le polling (défaut: true)
 */
export function useJobStatus(
  jobId: string | null,
  pollInterval: number = 3000,
  enabled: boolean = true
): UseJobStatusReturn {
  const [job, setJob] = useState<ForecastJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  const jobStatusRef = useRef<string | null>(null)

  const fetchJobStatus = useCallback(async () => {
    if (!jobId) {
      setJob(null)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .schema('lumeniq')
        .from('forecast_jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (!isMountedRef.current) return

      if (fetchError) {
        console.error('Error fetching job status:', fetchError)
        setError(fetchError.message)
        setJob(null)
      } else {
        // Colonnes numeric PostgreSQL arrivent comme string via Supabase JS
        // Les valeurs restent en ratio (0-1), la conversion en % se fait dans la couche d'affichage
        const parsed = {
          ...data,
          avg_wape: data.avg_wape != null ? Number(data.avg_wape) : null,
          avg_smape: data.avg_smape != null ? Number(data.avg_smape) : null,
          avg_bias: data.avg_bias != null ? Number(data.avg_bias) : null,
        }
        setJob(parsed as ForecastJob)
        setError(null)
      }
    } catch (err) {
      if (!isMountedRef.current) return
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      setJob(null)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [jobId])

  // Mettre à jour la ref du statut quand job change
  useEffect(() => {
    jobStatusRef.current = job?.status ?? null
  }, [job?.status])

  // Démarrer/arrêter le polling
  useEffect(() => {
    isMountedRef.current = true

    if (!jobId || !enabled) {
      setLoading(false)
      return
    }

    // Fetch initial
    setLoading(true)
    fetchJobStatus()

    // Démarrer le polling
    intervalRef.current = setInterval(() => {
      // Arrêter si le job est terminé ou en erreur (utilise la ref pour éviter la dépendance)
      const currentStatus = jobStatusRef.current
      if (currentStatus === 'completed' || currentStatus === 'failed' || currentStatus === 'cancelled') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      fetchJobStatus()
    }, pollInterval)

    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [jobId, enabled, pollInterval, fetchJobStatus])

  const isComplete = job?.status === 'completed'
  const isFailed = job?.status === 'failed' || job?.status === 'cancelled'
  const isProcessing = job?.status === 'processing' || job?.status === 'queued'
  const isPending = job?.status === 'pending'

  return {
    job,
    loading,
    error,
    isComplete,
    isFailed,
    isProcessing,
    isPending,
    refetch: fetchJobStatus,
  }
}

/**
 * Helper pour obtenir un label lisible pour le statut
 */
export function getJobStatusLabel(status: JobStatus | null | undefined): string {
  if (!status) return 'Inconnu'
  
  const labels: Record<JobStatus, string> = {
    pending: 'En attente',
    queued: 'Dans la file',
    processing: 'En cours',
    completed: 'Terminé',
    failed: 'Échoué',
    cancelled: 'Annulé',
  }
  
  return labels[status] || status
}

/**
 * Helper pour obtenir la couleur associée au statut
 */
export function getJobStatusColor(status: JobStatus | null | undefined): string {
  if (!status) return 'text-[var(--text-muted)]'
  
  const colors: Record<JobStatus, string> = {
    pending: 'text-[var(--text-muted)]',
    queued: 'text-[var(--warning)]',
    processing: 'text-[var(--accent)]',
    completed: 'text-[var(--success)]',
    failed: 'text-red-500',
    cancelled: 'text-[var(--text-muted)]',
  }
  
  return colors[status] || 'text-[var(--text-muted)]'
}
