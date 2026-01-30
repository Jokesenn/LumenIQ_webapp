'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Check, AlertCircle, FileText, X, Loader2 } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UploadStep } from '@/types/forecast'

interface FileUploadZoneProps {
  userId: string
  onUploadComplete?: (result: { jobId: string; filePath: string }) => void
  className?: string
}

interface StepIndicatorProps {
  label: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
}

function StepIndicator({ label, status }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        status === 'completed' && 'bg-[var(--success)]',
        status === 'in_progress' && 'bg-[var(--accent)]',
        status === 'pending' && 'bg-[var(--bg-surface)] border border-[var(--border)]',
        status === 'error' && 'bg-[var(--danger)]'
      )}>
        {status === 'completed' && <Check size={14} className="text-white" />}
        {status === 'in_progress' && <Loader2 size={14} className="text-white animate-spin" />}
        {status === 'error' && <X size={14} className="text-white" />}
      </div>
      <span className={cn(
        'text-sm',
        status === 'completed' && 'text-[var(--success)]',
        status === 'in_progress' && 'text-[var(--text-primary)] font-medium',
        status === 'pending' && 'text-[var(--text-muted)]',
        status === 'error' && 'text-[var(--danger)]'
      )}>
        {label}
      </span>
    </div>
  )
}

function getStepStatus(currentStep: UploadStep, targetStep: UploadStep): 'pending' | 'in_progress' | 'completed' | 'error' {
  const stepOrder: UploadStep[] = ['idle', 'uploading', 'creating_job', 'triggering_webhook', 'complete']
  
  if (currentStep === 'error') {
    const currentIndex = stepOrder.indexOf(targetStep)
    // Mark previous steps as completed, current step where error occurred as error
    // This is simplified - in real use case you'd track where error occurred
    return 'pending'
  }
  
  const currentIndex = stepOrder.indexOf(currentStep)
  const targetIndex = stepOrder.indexOf(targetStep)
  
  if (currentStep === 'complete') {
    return targetStep === 'complete' ? 'completed' : 'completed'
  }
  
  if (currentIndex > targetIndex) return 'completed'
  if (currentIndex === targetIndex) return 'in_progress'
  return 'pending'
}

export function FileUploadZone({ userId, onUploadComplete, className }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    uploading, 
    step, 
    uploadProgress, 
    error, 
    uploadedPath, 
    jobId,
    uploadAndCreateJob, 
    reset 
  } = useFileUpload()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateAndSelectFile = useCallback((file: File | null) => {
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return
    }

    setSelectedFile(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer?.files[0] || null
    validateAndSelectFile(file)
  }, [validateAndSelectFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    validateAndSelectFile(file)
  }, [validateAndSelectFile])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    const result = await uploadAndCreateJob(selectedFile, userId)
    if (result && onUploadComplete) {
      onUploadComplete(result)
    }
  }, [selectedFile, userId, uploadAndCreateJob, onUploadComplete])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    reset()
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [reset])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Success state
  if (step === 'complete' && uploadedPath && jobId) {
    return (
      <div className={cn(
        'rounded-2xl border border-[var(--success)] bg-[var(--success)]/10 p-8',
        className
      )}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--success)]/20 flex items-center justify-center">
            <Check size={28} className="text-[var(--success)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Forecast lancé !
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Job ID: <span className="font-mono">{jobId.slice(0, 8)}...</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <StepIndicator label="Fichier uploadé" status="completed" />
          <StepIndicator label="Job créé" status="completed" />
          <StepIndicator label="Forecast déclenché" status="completed" />
        </div>

        <div className="p-3 bg-[var(--bg-surface)] rounded-lg mb-6">
          <p className="text-xs text-[var(--text-muted)] mb-1">Chemin du fichier</p>
          <p className="font-mono text-xs text-[var(--text-secondary)] break-all">
            {uploadedPath}
          </p>
        </div>

        <Button variant="secondary" onClick={handleReset} className="w-full">
          Uploader un autre fichier
        </Button>
      </div>
    )
  }

  // Error state
  if (step === 'error' && error) {
    return (
      <div className={cn(
        'rounded-2xl border border-[var(--danger)] bg-[var(--danger)]/10 p-8 text-center',
        className
      )}>
        <div className="w-16 h-16 rounded-2xl bg-[var(--danger)]/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-[var(--danger)]" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
          Erreur
        </h3>
        <p className="text-sm text-[var(--danger)] mb-4">
          {error}
        </p>
        <Button variant="secondary" onClick={handleReset}>
          Réessayer
        </Button>
      </div>
    )
  }

  // Processing state (uploading, creating job, or triggering webhook)
  if (uploading && step !== 'idle') {
    return (
      <div className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8',
        className
      )}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center">
            <Loader2 size={28} className="text-[var(--accent)] animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Traitement en cours...
            </h3>
            {selectedFile && (
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <StepIndicator 
              label="Upload du fichier" 
              status={getStepStatus(step, 'uploading')} 
            />
            {step === 'uploading' && (
              <span className="text-sm text-[var(--text-muted)]">
                {Math.round(uploadProgress)}%
              </span>
            )}
          </div>
          
          {step === 'uploading' && (
            <div className="ml-9 bg-[var(--bg-surface)] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <StepIndicator 
            label="Création du job" 
            status={getStepStatus(step, 'creating_job')} 
          />
          
          <StepIndicator 
            label="Déclenchement du forecast" 
            status={getStepStatus(step, 'triggering_webhook')} 
          />
        </div>
      </div>
    )
  }

  // File selected state
  if (selectedFile) {
    return (
      <div className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8',
        className
      )}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center">
            <FileText size={24} className="text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] truncate">
              {selectedFile.name}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            Annuler
          </Button>
          <Button onClick={handleUpload} className="flex-1">
            Lancer le forecast
          </Button>
        </div>
      </div>
    )
  }

  // Default drop zone state
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all',
        isDragging
          ? 'bg-[var(--accent-muted)] border-[var(--accent)]'
          : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-hover)]',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-4">
        <Upload size={32} className="text-[var(--accent)]" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
        Glissez votre fichier CSV ici
      </h3>
      <p className="text-[var(--text-secondary)] mb-3">
        ou cliquez pour parcourir
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        Format accepté : CSV • Max 50 MB
      </p>
    </div>
  )
}
