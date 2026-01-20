import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, PlanType, ForecastJob, Profile, ForecastResult } from '@/types/database'

// ============================================
// Types
// ============================================

export interface DashboardStats {
  seriesThisMonth: number
  seriesLimit: number
  forecastsThisMonth: number
  averageSmape: number | null
  daysUntilReset: number
  plan: PlanType
}

export interface ModelPerformanceItem {
  model: string
  smape: number
  series: number
}

// Type pour le client Supabase avec le schéma lumeniq
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientType = SupabaseClient<Database, 'lumeniq', any>

// ============================================
// Constants
// ============================================

export const PLAN_LIMITS: Record<PlanType, { series: number; history: number }> = {
  standard: { series: 50, history: 30 },
  ml: { series: 150, history: 60 },
  foundation: { series: 300, history: 90 },
}

// ============================================
// Helper Functions
// ============================================

function getStartOfMonth(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

function calculateDaysUntilReset(currentPeriodStart: string | null): number {
  if (!currentPeriodStart) {
    // Default: assume period started at beginning of current month
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const periodStart = new Date(currentPeriodStart)
  // Period resets 30 days after start
  const periodEnd = new Date(periodStart)
  periodEnd.setDate(periodEnd.getDate() + 30)

  const now = new Date()
  const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, daysRemaining)
}

// ============================================
// Query Functions
// ============================================

/**
 * Récupère les statistiques du dashboard pour un utilisateur
 */
export async function getDashboardStats(
  supabase: SupabaseClientType,
  userId: string
): Promise<DashboardStats> {
  try {
    // 1. Récupérer le profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan, series_used_this_period, current_period_start')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    const profile = profileData as Pick<Profile, 'plan' | 'series_used_this_period' | 'current_period_start'> | null
    const plan: PlanType = profile?.plan ?? 'standard'
    const seriesThisMonth = profile?.series_used_this_period ?? 0
    const seriesLimit = PLAN_LIMITS[plan]?.series ?? 50

    // 2. Compter les forecasts du mois courant
    const startOfMonth = getStartOfMonth()
    const { count: forecastsCount, error: forecastsError } = await supabase
      .from('forecast_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth)

    if (forecastsError) {
      console.error('Error counting forecasts:', forecastsError)
    }

    // 3. Calculer le SMAPE moyen depuis forecast_results
    const { data: smapeRaw, error: smapeError } = await supabase
      .from('forecast_results')
      .select('smape')
      .eq('user_id', userId)
      .not('smape', 'is', null)

    if (smapeError) {
      console.error('Error fetching SMAPE:', smapeError)
    }

    const smapeData = smapeRaw as Pick<ForecastResult, 'smape'>[] | null

    let averageSmape: number | null = null
    if (smapeData && smapeData.length > 0) {
      const validSmapes = smapeData
        .filter((d) => d.smape !== null)
        .map((d) => d.smape as number)
      if (validSmapes.length > 0) {
        averageSmape = Math.round((validSmapes.reduce((a, b) => a + b, 0) / validSmapes.length) * 10) / 10
      }
    }

    // 4. Calculer les jours jusqu'au reset
    const daysUntilReset = calculateDaysUntilReset(profile?.current_period_start ?? null)

    return {
      seriesThisMonth,
      seriesLimit,
      forecastsThisMonth: forecastsCount ?? 0,
      averageSmape,
      daysUntilReset,
      plan,
    }
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      seriesThisMonth: 0,
      seriesLimit: 50,
      forecastsThisMonth: 0,
      averageSmape: null,
      daysUntilReset: 30,
      plan: 'standard',
    }
  }
}

/**
 * Récupère les derniers forecasts d'un utilisateur
 */
export async function getRecentForecasts(
  supabase: SupabaseClientType,
  userId: string,
  limit: number = 5
): Promise<ForecastJob[]> {
  try {
    const { data, error } = await supabase
      .from('forecast_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent forecasts:', error)
      return []
    }

    return (data as ForecastJob[]) ?? []
  } catch (error) {
    console.error('Error in getRecentForecasts:', error)
    return []
  }
}

/**
 * Récupère les performances par modèle pour un utilisateur
 */
export async function getModelPerformance(
  supabase: SupabaseClientType,
  userId: string
): Promise<ModelPerformanceItem[]> {
  try {
    // Récupérer tous les résultats avec champion_model et smape
    const { data: rawData, error } = await supabase
      .from('forecast_results')
      .select('champion_model, smape')
      .eq('user_id', userId)
      .not('champion_model', 'is', null)
      .not('smape', 'is', null)

    if (error) {
      console.error('Error fetching model performance:', error)
      return []
    }

    const data = rawData as Pick<ForecastResult, 'champion_model' | 'smape'>[] | null

    if (!data || data.length === 0) {
      return []
    }

    // Grouper par modèle et calculer les stats
    const modelMap = new Map<string, { totalSmape: number; count: number }>()

    for (const result of data) {
      const model = result.champion_model
      const smape = result.smape as number

      if (modelMap.has(model)) {
        const existing = modelMap.get(model)!
        existing.totalSmape += smape
        existing.count += 1
      } else {
        modelMap.set(model, { totalSmape: smape, count: 1 })
      }
    }

    // Convertir en tableau et calculer les moyennes
    const performance: ModelPerformanceItem[] = Array.from(modelMap.entries()).map(
      ([model, stats]) => ({
        model,
        smape: Math.round((stats.totalSmape / stats.count) * 10) / 10,
        series: stats.count,
      })
    )

    // Trier par nombre de séries décroissant
    return performance.sort((a, b) => b.series - a.series)
  } catch (error) {
    console.error('Error in getModelPerformance:', error)
    return []
  }
}
