'use client'

import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/client'
import type { UploadStep, ForecastJobInsert, WebhookPayload } from '@/types/forecast'

interface UploadResult {
  jobId: string
  filePath: string
}

interface UseFileUploadReturn {
  uploading: boolean
  step: UploadStep
  uploadProgress: number
  stepMessage: string
  error: string | null
  uploadedPath: string | null
  jobId: string | null
  uploadAndCreateJob: (file: File, userId: string) => Promise<UploadResult | null>
  reset: () => void
}

const BUCKET_NAME = 'forecasts'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const STEP_MESSAGES: Record<UploadStep, string> = {
  idle: '',
  uploading: 'Upload en cours...',
  creating_job: 'Création du job...',
  triggering_webhook: 'Déclenchement du forecast...',
  complete: 'Forecast lancé !',
  error: 'Erreur',
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState<UploadStep>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const stepMessage = STEP_MESSAGES[step]

  const reset = useCallback(() => {
    setUploading(false)
    setStep('idle')
    setUploadProgress(0)
    setError(null)
    setUploadedPath(null)
    setJobId(null)
  }, [])

  const uploadAndCreateJob = useCallback(async (file: File, userId: string): Promise<UploadResult | null> => {
    // Reset state
    setError(null)
    setUploadProgress(0)
    setUploadedPath(null)
    setJobId(null)
    setStep('idle')

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Seuls les fichiers CSV sont acceptés')
      setStep('error')
      return null
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Le fichier dépasse la limite de 50MB')
      setStep('error')
      return null
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const newJobId = uuidv4()
      const filePath = `uploads/${userId}/${newJobId}/${file.name}`

      // Step 1: Upload to Storage
      setStep('uploading')
      
      // Simulate progress for better UX (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      clearInterval(progressInterval)

      if (uploadError) {
        setError(`Erreur d'upload: ${uploadError.message}`)
        setStep('error')
        setUploading(false)
        setUploadProgress(0)
        return null
      }

      setUploadProgress(100)
      setUploadedPath(filePath)

      // Step 2: Insert into forecast_jobs
      setStep('creating_job')

      const jobData: ForecastJobInsert = {
        id: newJobId,
        user_id: userId,
        filename: file.name,
        input_path: filePath,
        file_size_bytes: file.size,
        status: 'pending',
        progress: 0,
        plan_at_run: 'standard',
      }

      const { error: insertError } = await supabase
        .schema('lumeniq')
        .from('forecast_jobs')
        .insert(jobData)

      if (insertError) {
        setError(`Erreur de création du job: ${insertError.message}`)
        setStep('error')
        setUploading(false)
        // Note: We could cleanup the uploaded file here, but leaving it for now
        console.error('Failed to create job, file already uploaded:', filePath)
        return null
      }

      setJobId(newJobId)

      // Step 3: Trigger N8N webhook
      setStep('triggering_webhook')

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

      if (webhookUrl) {
        const webhookPayload: WebhookPayload = {
          job_id: newJobId,
          user_id: userId,
          input_path: filePath,
          filename: file.name,
        }

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          })

          if (!response.ok) {
            // Log warning but don't block - N8N can retry or we can poll
            console.warn(`Webhook returned ${response.status}: ${response.statusText}`)
          }
        } catch (webhookError) {
          // Log warning but don't block the UX
          console.warn('Webhook trigger failed (non-blocking):', webhookError)
        }
      } else {
        console.warn('N8N webhook URL not configured')
      }

      // Complete
      setStep('complete')
      setUploading(false)

      return { jobId: newJobId, filePath }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(`Erreur: ${errorMessage}`)
      setStep('error')
      setUploading(false)
      setUploadProgress(0)
      return null
    }
  }, [])

  return {
    uploading,
    step,
    uploadProgress,
    stepMessage,
    error,
    uploadedPath,
    jobId,
    uploadAndCreateJob,
    reset,
  }
}
