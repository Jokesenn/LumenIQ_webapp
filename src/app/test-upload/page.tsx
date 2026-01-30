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
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Test Upload + Forecast Job
          </h1>
          <p className="text-[var(--text-secondary)]">
            Upload CSV → Insert forecast_jobs → Trigger N8N webhook
          </p>
        </div>

        <FileUploadZone
          userId="69822d58-b005-4231-8aa4-b240e16cfe7f"
          onUploadComplete={handleUploadComplete}
        />

        {lastUpload && (
          <div className="mt-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Informations de debug
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">Job ID</p>
                <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                  {lastUpload.jobId}
                </p>
              </div>
              <div className="p-3 bg-[var(--bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">File Path (Storage)</p>
                <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                  {lastUpload.filePath}
                </p>
              </div>
              <div className="p-3 bg-[var(--bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">Bucket</p>
                <p className="font-mono text-sm text-[var(--text-primary)]">
                  forecasts
                </p>
              </div>
              <div className="p-3 bg-[var(--bg-surface)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">Table</p>
                <p className="font-mono text-sm text-[var(--text-primary)]">
                  forecast_jobs (status: pending)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-[var(--accent-muted)] border border-[var(--accent)]/30 rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--accent)]">Flux complet :</strong>
            </p>
            <ol className="mt-2 text-sm text-[var(--text-secondary)] list-decimal list-inside space-y-1">
              <li>Upload fichier → Supabase Storage</li>
              <li>Insert → forecast_jobs (status: pending)</li>
              <li>POST → webhook N8N (async)</li>
            </ol>
          </div>

          <div className="p-4 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--warning)]">Configuration requise :</strong>
            </p>
            <ul className="mt-2 text-sm text-[var(--text-secondary)] list-disc list-inside space-y-1">
              <li>
                <code className="px-1 py-0.5 bg-[var(--bg-surface)] rounded text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code> dans .env.local
              </li>
              <li>
                <code className="px-1 py-0.5 bg-[var(--bg-surface)] rounded text-xs">
                  NEXT_PUBLIC_N8N_WEBHOOK_URL
                </code> dans .env.local
              </li>
              <li>Politique RLS sur forecast_jobs (INSERT)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
