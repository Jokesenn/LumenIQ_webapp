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
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Test Upload + Forecast Job
          </h1>
          <p className="text-zinc-400">
            Upload CSV &rarr; Insert forecast_jobs &rarr; Trigger N8N webhook
          </p>
        </div>

        <FileUploadZone
          userId="69822d58-b005-4231-8aa4-b240e16cfe7f"
          onUploadComplete={handleUploadComplete}
        />

        {lastUpload && (
          <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-white/[0.08]">
            <h2 className="text-lg font-semibold text-white mb-4">
              Informations de debug
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">Job ID</p>
                <p className="font-mono text-sm text-white break-all">
                  {lastUpload.jobId}
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">File Path (Storage)</p>
                <p className="font-mono text-sm text-white break-all">
                  {lastUpload.filePath}
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">Bucket</p>
                <p className="font-mono text-sm text-white">
                  forecasts
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">Table</p>
                <p className="font-mono text-sm text-white">
                  forecast_jobs (status: pending)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
            <p className="text-sm text-zinc-400">
              <strong className="text-indigo-400">Flux complet :</strong>
            </p>
            <ol className="mt-2 text-sm text-zinc-400 list-decimal list-inside space-y-1">
              <li>Upload fichier &rarr; Supabase Storage</li>
              <li>Insert &rarr; forecast_jobs (status: pending)</li>
              <li>POST &rarr; webhook N8N (async)</li>
            </ol>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-zinc-400">
              <strong className="text-amber-400">Configuration requise :</strong>
            </p>
            <ul className="mt-2 text-sm text-zinc-400 list-disc list-inside space-y-1">
              <li>
                <code className="px-1 py-0.5 bg-white/5 rounded text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code> dans .env.local
              </li>
              <li>
                <code className="px-1 py-0.5 bg-white/5 rounded text-xs">
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
