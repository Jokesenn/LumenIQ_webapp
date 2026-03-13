'use client'

import { useState } from 'react'
import { FileUploadZone } from '@/components/upload/file-upload-zone'

interface UploadResult {
  jobId: string
  filePath: string
}

export default function TestUploadPage() {
  const [lastUpload, setLastUpload] = useState<UploadResult | null>(null)

  const handleUploadComplete = (result: UploadResult) => {
    setLastUpload(result)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Test Upload + Forecast Job
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Upload CSV &rarr; Insert forecast_jobs &rarr; Trigger N8N webhook
          </p>
        </div>

        <FileUploadZone
          userId="69822d58-b005-4231-8aa4-b240e16cfe7f"
          onUploadComplete={handleUploadComplete}
        />

        {lastUpload && (
          <div className="mt-8 p-6 card-signal">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Informations de debug
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Job ID</p>
                <p className="font-mono text-sm text-[var(--color-text)] break-all">
                  {lastUpload.jobId}
                </p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">File Path (Storage)</p>
                <p className="font-mono text-sm text-[var(--color-text)] break-all">
                  {lastUpload.filePath}
                </p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Bucket</p>
                <p className="font-mono text-sm text-[var(--color-text)]">
                  forecasts
                </p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Table</p>
                <p className="font-mono text-sm text-[var(--color-text)]">
                  forecast_jobs (status: pending)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-[var(--color-copper)]/10 border border-[var(--color-copper)]/30 rounded-lg">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-copper)]">Flux complet :</strong>
            </p>
            <ol className="mt-2 text-sm text-[var(--color-text-secondary)] list-decimal list-inside space-y-1">
              <li>Upload fichier &rarr; Supabase Storage</li>
              <li>Insert &rarr; forecast_jobs (status: pending)</li>
              <li>POST &rarr; webhook N8N (async)</li>
            </ol>
          </div>

          <div className="p-4 bg-[var(--color-copper)]/10 border border-[var(--color-copper)]/30 rounded-lg">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-copper)]">Configuration requise :</strong>
            </p>
            <ul className="mt-2 text-sm text-[var(--color-text-secondary)] list-disc list-inside space-y-1">
              <li>
                <code className="px-1 py-0.5 bg-[var(--color-bg-surface)] rounded text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code> dans .env.local
              </li>
              <li>
                <code className="px-1 py-0.5 bg-[var(--color-bg-surface)] rounded text-xs">
                  N8N_WEBHOOK_URL
                </code> dans .env.local (server-only)
              </li>
              <li>Politique RLS sur forecast_jobs (INSERT)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
