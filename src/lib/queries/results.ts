import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Database,
  ForecastJob,
  ForecastResult,
  ForecastResultMonth,
  JobSummary,
  AbcClass,
  XyzClass,
} from '@/types/database'

// Type pour le client Supabase avec le schéma lumeniq
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientType = SupabaseClient<Database, 'lumeniq', any>

// ============================================
// Types pour les stats agrégées
// ============================================

export interface JobStats {
  avgSmape: number | null
  avgWape: number | null
  avgBias: number | null
  seriesCount: number
  seriesProcessed: number
  topChampionModel: string | null
  computeTime: number | null
}

export interface AbcDistribution {
  class: AbcClass
  count: number
  percentage: number
}

export interface XyzDistribution {
  class: XyzClass
  count: number
  percentage: number
}

export interface ModelPerformance {
  model: string
  count: number
  avgSmape: number
}

export interface AbcXyzMatrix {
  abcClass: AbcClass
  xyzClass: XyzClass
  count: number
}

// ============================================
// Fonctions de query
// ============================================

/**
 * Récupère un job par son ID
 */
export async function getJobById(
  supabase: SupabaseClientType,
  jobId: string
): Promise<ForecastJob | null> {
  try {
    const { data, error } = await supabase
      .from('forecast_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      console.error('Error fetching job:', error)
      return null
    }

    return data as ForecastJob
  } catch (error) {
    console.error('Error in getJobById:', error)
    return null
  }
}

/**
 * Récupère le summary d'un job (métriques agrégées)
 */
export async function getJobSummary(
  supabase: SupabaseClientType,
  jobId: string
): Promise<JobSummary | null> {
  try {
    const { data, error } = await supabase
      .from('job_summaries')
      .select('*')
      .eq('job_id', jobId)
      .single()

    if (error) {
      // Pas d'erreur si pas de summary (peut ne pas exister)
      if (error.code !== 'PGRST116') {
        console.error('Error fetching job summary:', error)
      }
      return null
    }

    return data as JobSummary
  } catch (error) {
    console.error('Error in getJobSummary:', error)
    return null
  }
}

/**
 * Récupère les derniers jobs d'un utilisateur
 */
export async function getRecentJobs(
  supabase: SupabaseClientType,
  userId: string,
  limit: number = 10
): Promise<ForecastJob[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent jobs:', error)
      return []
    }

    return (data as ForecastJob[]) ?? []
  } catch (error) {
    console.error('Error in getRecentJobs:', error)
    return []
  }
}

/**
 * Récupère les résultats par série d'un job
 */
export async function getJobResults(
  supabase: SupabaseClientType,
  jobId: string
): Promise<ForecastResult[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_results')
      .select('*')
      .eq('job_id', jobId)
      .order('series_id', { ascending: true })

    if (error) {
      console.error('Error fetching job results:', error)
      return []
    }

    return (data as ForecastResult[]) ?? []
  } catch (error) {
    console.error('Error in getJobResults:', error)
    return []
  }
}

/**
 * Récupère les forecasts mensuels d'un job (pour les graphiques)
 */
export async function getJobForecasts(
  supabase: SupabaseClientType,
  jobId: string,
  seriesId?: string
): Promise<ForecastResultMonth[]> {
  try {
    let query = supabase
      .from('forecast_results_months')
      .select('*')
      .eq('job_id', jobId)
      .order('ds', { ascending: true })

    if (seriesId) {
      query = query.eq('series_id', seriesId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching job forecasts:', error)
      return []
    }

    return (data as ForecastResultMonth[]) ?? []
  } catch (error) {
    console.error('Error in getJobForecasts:', error)
    return []
  }
}

/**
 * Récupère la distribution ABC d'un job
 */
export async function getAbcDistribution(
  supabase: SupabaseClientType,
  jobId: string
): Promise<AbcDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_results')
      .select('abc_class')
      .eq('job_id', jobId)
      .not('abc_class', 'is', null)

    if (error) {
      console.error('Error fetching ABC distribution:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Compter par classe
    const counts: Record<AbcClass, number> = { A: 0, B: 0, C: 0 }
    for (const row of data) {
      if (row.abc_class) {
        counts[row.abc_class as AbcClass]++
      }
    }

    const total = data.length
    const result: AbcDistribution[] = (['A', 'B', 'C'] as AbcClass[]).map((cls) => ({
      class: cls,
      count: counts[cls],
      percentage: total > 0 ? Math.round((counts[cls] / total) * 100) : 0,
    }))

    return result
  } catch (error) {
    console.error('Error in getAbcDistribution:', error)
    return []
  }
}

/**
 * Récupère la distribution XYZ d'un job
 */
export async function getXyzDistribution(
  supabase: SupabaseClientType,
  jobId: string
): Promise<XyzDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_results')
      .select('xyz_class')
      .eq('job_id', jobId)
      .not('xyz_class', 'is', null)

    if (error) {
      console.error('Error fetching XYZ distribution:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Compter par classe
    const counts: Record<XyzClass, number> = { X: 0, Y: 0, Z: 0 }
    for (const row of data) {
      if (row.xyz_class) {
        counts[row.xyz_class as XyzClass]++
      }
    }

    const total = data.length
    const result: XyzDistribution[] = (['X', 'Y', 'Z'] as XyzClass[]).map((cls) => ({
      class: cls,
      count: counts[cls],
      percentage: total > 0 ? Math.round((counts[cls] / total) * 100) : 0,
    }))

    return result
  } catch (error) {
    console.error('Error in getXyzDistribution:', error)
    return []
  }
}

/**
 * Récupère la matrice ABC/XYZ d'un job
 */
export async function getAbcXyzMatrix(
  supabase: SupabaseClientType,
  jobId: string
): Promise<AbcXyzMatrix[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_results')
      .select('abc_class, xyz_class')
      .eq('job_id', jobId)
      .not('abc_class', 'is', null)
      .not('xyz_class', 'is', null)

    if (error) {
      console.error('Error fetching ABC/XYZ matrix:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Créer la matrice
    const matrix: Record<string, number> = {}
    for (const row of data) {
      const key = `${row.abc_class}-${row.xyz_class}`
      matrix[key] = (matrix[key] || 0) + 1
    }

    // Convertir en tableau
    const result: AbcXyzMatrix[] = []
    for (const abcClass of ['A', 'B', 'C'] as AbcClass[]) {
      for (const xyzClass of ['X', 'Y', 'Z'] as XyzClass[]) {
        const key = `${abcClass}-${xyzClass}`
        result.push({
          abcClass,
          xyzClass,
          count: matrix[key] || 0,
        })
      }
    }

    return result
  } catch (error) {
    console.error('Error in getAbcXyzMatrix:', error)
    return []
  }
}

/**
 * Récupère les performances par modèle d'un job
 */
export async function getModelPerformance(
  supabase: SupabaseClientType,
  jobId: string
): Promise<ModelPerformance[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_results')
      .select('champion_model, smape')
      .eq('job_id', jobId)
      .not('champion_model', 'is', null)

    if (error) {
      console.error('Error fetching model performance:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Grouper par modèle
    const modelStats: Record<string, { totalSmape: number; count: number }> = {}
    for (const row of data) {
      const model = row.champion_model
      const smape = row.smape as number | null

      if (!modelStats[model]) {
        modelStats[model] = { totalSmape: 0, count: 0 }
      }

      modelStats[model].count++
      if (smape !== null) {
        modelStats[model].totalSmape += smape
      }
    }

    // Convertir en tableau et calculer les moyennes
    const result: ModelPerformance[] = Object.entries(modelStats)
      .map(([model, stats]) => ({
        model,
        count: stats.count,
        avgSmape:
          stats.count > 0
            ? Math.round((stats.totalSmape / stats.count) * 10) / 10
            : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return result
  } catch (error) {
    console.error('Error in getModelPerformance:', error)
    return []
  }
}

/**
 * Récupère toutes les données agrégées d'un job en une fois
 */
export async function getJobFullData(
  supabase: SupabaseClientType,
  jobId: string
) {
  const [job, summary, results, abcDist, xyzDist, matrix, modelPerf, chartData] = await Promise.all([
    getJobById(supabase, jobId),
    getJobSummary(supabase, jobId),
    getJobResults(supabase, jobId),
    getAbcDistribution(supabase, jobId),
    getXyzDistribution(supabase, jobId),
    getAbcXyzMatrix(supabase, jobId),
    getModelPerformance(supabase, jobId),
    getChartData(supabase, jobId),
  ])

  return {
    job,
    summary,
    results,
    abcDistribution: abcDist,
    xyzDistribution: xyzDist,
    abcXyzMatrix: matrix,
    modelPerformance: modelPerf,
    chartData,
  }
}

// ============================================
// Données pour le graphique agrégé
// ============================================

export interface AggregatedChartData {
  ds: string
  date: string // Format lisible pour l'affichage
  actual: number | null
  forecast: number | null
  lower: number | null
  upper: number | null
}

/**
 * Normalise une date au format YYYY-MM-DD
 * Gère le cas où le mois est encodé dans le jour (format legacy: YYYY-01-MM)
 */
function normalizeDateFromActuals(ds: string): string {
  const parts = ds.split('-')
  if (parts.length < 3) return ds
  
  const year = parts[0]
  const monthPart = parseInt(parts[1], 10)
  const dayPart = parseInt(parts[2], 10)
  
  // Détecter le format legacy : mois=01 et jour entre 1-12
  // Dans ce cas, le jour représente le mois réel
  if (monthPart === 1 && dayPart >= 1 && dayPart <= 12) {
    // Format legacy : YYYY-01-MM -> convertir en YYYY-MM-01
    return `${year}-${String(dayPart).padStart(2, '0')}-01`
  }
  
  // Format standard : garder tel quel
  return ds
}

/**
 * Récupère l'historique agrégé (somme de toutes les séries par date)
 */
export async function getAggregatedActuals(
  supabase: SupabaseClientType,
  jobId: string
): Promise<{ ds: string; total: number }[]> {
  try {
    // Supabase limite à 1000 lignes par défaut côté serveur
    // On doit paginer pour récupérer toutes les données
    const allData: { ds: string; y: number | null }[] = []
    const pageSize = 1000
    let from = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('series_actuals')
        .select('ds, y')
        .eq('job_id', jobId)
        .order('ds', { ascending: true })
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Error fetching actuals:', error)
        return []
      }

      if (!data || data.length === 0) {
        hasMore = false
      } else {
        allData.push(...data)
        from += pageSize
        hasMore = data.length === pageSize
      }
    }

    if (allData.length === 0) {
      return []
    }

    // Convertir les dates en strings ISO (Supabase peut retourner Date ou string)
    const normalizeToString = (ds: unknown): string => {
      if (ds instanceof Date) {
        return ds.toISOString().split('T')[0]
      }
      return String(ds)
    }

    // Détecter si on a le format legacy (vérifier si toutes les dates ont mois=01)
    const hasLegacyFormat = allData.every((row) => {
      const dsStr = normalizeToString(row.ds)
      const parts = dsStr.split('-')
      return parts.length >= 2 && parts[1] === '01'
    })

    console.log(`[getAggregatedActuals] job=${jobId}, rows=${allData.length}, hasLegacyFormat=${hasLegacyFormat}`)
    if (allData.length > 0) {
      console.log(`[getAggregatedActuals] sample dates:`, allData.slice(0, 3).map(r => normalizeToString(r.ds)))
    }

    // Agréger par date (SUM), avec normalisation si format legacy
    const aggregated: Record<string, number> = {}
    for (const row of allData) {
      const dsStr = normalizeToString(row.ds)
      const ds = hasLegacyFormat ? normalizeDateFromActuals(dsStr) : dsStr
      const y = Number(row.y) || 0
      aggregated[ds] = (aggregated[ds] || 0) + y
    }

    // Convertir en tableau trié
    return Object.entries(aggregated)
      .map(([ds, total]) => ({ ds, total }))
      .sort((a, b) => a.ds.localeCompare(b.ds))
  } catch (error) {
    console.error('Error in getAggregatedActuals:', error)
    return []
  }
}

/**
 * Récupère les forecasts agrégés (somme de toutes les séries par date)
 */
export async function getAggregatedForecasts(
  supabase: SupabaseClientType,
  jobId: string
): Promise<{ ds: string; yhat: number; lower: number; upper: number }[]> {
  try {
    // Supabase limite à 1000 lignes par défaut côté serveur
    // On pagine pour récupérer toutes les données
    const allData: { ds: string; yhat: number; yhat_lower: number | null; yhat_upper: number | null }[] = []
    const pageSize = 1000
    let from = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('forecast_results_months')
        .select('ds, yhat, yhat_lower, yhat_upper')
        .eq('job_id', jobId)
        .order('ds', { ascending: true })
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Error fetching forecasts:', error)
        return []
      }

      if (!data || data.length === 0) {
        hasMore = false
      } else {
        allData.push(...data)
        from += pageSize
        hasMore = data.length === pageSize
      }
    }

    if (allData.length === 0) {
      return []
    }

    // Agréger par date (SUM)
    const aggregated: Record<string, { yhat: number; lower: number; upper: number }> = {}
    for (const row of allData) {
      const ds = row.ds
      const yhat = Number(row.yhat) || 0
      const lower = Number(row.yhat_lower) || 0
      const upper = Number(row.yhat_upper) || 0

      if (!aggregated[ds]) {
        aggregated[ds] = { yhat: 0, lower: 0, upper: 0 }
      }
      aggregated[ds].yhat += yhat
      aggregated[ds].lower += lower
      aggregated[ds].upper += upper
    }

    // Convertir en tableau trié
    return Object.entries(aggregated)
      .map(([ds, values]) => ({ ds, ...values }))
      .sort((a, b) => a.ds.localeCompare(b.ds))
  } catch (error) {
    console.error('Error in getAggregatedForecasts:', error)
    return []
  }
}

// Formater la date pour l'affichage (format: "Jan 19")
function formatDate(ds: string): string {
  const parts = ds.split('-')
  if (parts.length < 2) return ds
  
  const year = parts[0]
  const month = parseInt(parts[1], 10)
  
  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ]
  
  const monthName = monthNames[month - 1] || String(month).padStart(2, '0')
  const shortYear = year.slice(-2) // "2019" -> "19"
  
  return `${monthName} ${shortYear}`
}

/**
 * Récupère les données du graphique depuis la table pré-agrégée job_monthly_aggregates
 * Cette méthode est beaucoup plus rapide (1 requête, ~72 lignes au lieu de 2400+)
 */
async function getChartDataFromAggregates(
  supabase: SupabaseClientType,
  jobId: string
): Promise<AggregatedChartData[]> {
  try {
    const { data, error } = await supabase
      .from('job_monthly_aggregates')
      .select('ds, actual_sum, forecast_sum, forecast_lower_sum, forecast_upper_sum')
      .eq('job_id', jobId)
      .order('ds', { ascending: true })

    if (error) {
      console.error('Error fetching from job_monthly_aggregates:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    console.log(`[getChartDataFromAggregates] job=${jobId}, rows=${data.length}`)

    return data.map(row => ({
      ds: String(row.ds),
      date: formatDate(String(row.ds)),
      actual: row.actual_sum != null ? Number(row.actual_sum) : null,
      forecast: row.forecast_sum != null ? Number(row.forecast_sum) : null,
      lower: row.forecast_lower_sum != null ? Number(row.forecast_lower_sum) : null,
      upper: row.forecast_upper_sum != null ? Number(row.forecast_upper_sum) : null,
    }))
  } catch (error) {
    console.error('Error in getChartDataFromAggregates:', error)
    return []
  }
}

/**
 * Combine les actuals et forecasts pour créer les données du graphique
 * Utilise la table pré-agrégée job_monthly_aggregates si disponible (rapide),
 * sinon fallback sur l'ancienne méthode avec pagination (lent mais compatible)
 */
export async function getChartData(
  supabase: SupabaseClientType,
  jobId: string
): Promise<AggregatedChartData[]> {
  try {
    // Essayer d'abord la table pré-agrégée (rapide: 1 requête, ~72 lignes)
    const aggregatedData = await getChartDataFromAggregates(supabase, jobId)
    if (aggregatedData.length > 0) {
      return aggregatedData
    }

    // Fallback sur l'ancienne méthode avec pagination (lent mais compatible)
    console.log(`[getChartData] Fallback to pagination for job=${jobId}`)
    
    const [actuals, forecasts] = await Promise.all([
      getAggregatedActuals(supabase, jobId),
      getAggregatedForecasts(supabase, jobId),
    ])

    // Créer un map de toutes les dates
    const allDates = new Set<string>()
    actuals.forEach((a) => allDates.add(a.ds))
    forecasts.forEach((f) => allDates.add(f.ds))

    // Créer des maps pour lookup rapide
    const actualsMap = new Map(actuals.map((a) => [a.ds, a.total]))
    const forecastsMap = new Map(forecasts.map((f) => [f.ds, f]))

    // Combiner les données
    const result: AggregatedChartData[] = Array.from(allDates)
      .sort()
      .map((ds) => {
        const actual = actualsMap.get(ds) ?? null
        const forecast = forecastsMap.get(ds)

        return {
          ds,
          date: formatDate(ds),
          actual,
          forecast: forecast?.yhat ?? null,
          lower: forecast?.lower ?? null,
          upper: forecast?.upper ?? null,
        }
      })

    return result
  } catch (error) {
    console.error('Error in getChartData:', error)
    return []
  }
}
