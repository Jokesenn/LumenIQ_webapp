'use client'

import { useMemo, useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SeriesListItem, SeriesSortOption } from '@/types/forecast'

const STORAGE_KEY = 'lumeniq_series_sort'
const DEFAULT_SORT: SeriesSortOption = 'smape'
const VALID_SORTS: SeriesSortOption[] = ['alpha', 'smape', 'abc']

interface UseSeriesNavigationProps {
  allSeries: SeriesListItem[]
  currentSeriesId?: string
  jobId: string
}

interface UseSeriesNavigationReturn {
  sortedSeries: SeriesListItem[]
  sortOption: SeriesSortOption
  setSortOption: (option: SeriesSortOption) => void
  currentIndex: number
  hasPrevious: boolean
  hasNext: boolean
  previousSeries: SeriesListItem | null
  nextSeries: SeriesListItem | null
  goToPrevious: () => void
  goToNext: () => void
  goToSeries: (seriesId: string) => void
}

function isValidSort(value: string | null): value is SeriesSortOption {
  return value !== null && VALID_SORTS.includes(value as SeriesSortOption)
}

function getInitialSort(urlSort: string | null): SeriesSortOption {
  if (isValidSort(urlSort)) return urlSort

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isValidSort(stored)) return stored
  }

  return DEFAULT_SORT
}

function sortSeries(series: SeriesListItem[], sortBy: SeriesSortOption): SeriesListItem[] {
  const sorted = [...series]

  switch (sortBy) {
    case 'alpha':
      return sorted.sort((a, b) => a.series_id.localeCompare(b.series_id, 'fr'))

    case 'smape':
      return sorted.sort((a, b) => {
        const aVal = a.smape ?? a.wape ?? Infinity
        const bVal = b.smape ?? b.wape ?? Infinity
        return aVal - bVal
      })

    case 'abc': {
      const abcOrder: Record<string, number> = { A: 1, B: 2, C: 3 }
      const xyzOrder: Record<string, number> = { X: 1, Y: 2, Z: 3 }
      return sorted.sort((a, b) => {
        const abcCmp = (abcOrder[a.abc_class] ?? 9) - (abcOrder[b.abc_class] ?? 9)
        if (abcCmp !== 0) return abcCmp
        const xyzCmp = (xyzOrder[a.xyz_class] ?? 9) - (xyzOrder[b.xyz_class] ?? 9)
        if (xyzCmp !== 0) return xyzCmp
        return (a.smape ?? a.wape ?? Infinity) - (b.smape ?? b.wape ?? Infinity)
      })
    }

    default:
      return sorted
  }
}

export function useSeriesNavigation({
  allSeries,
  currentSeriesId,
  jobId,
}: UseSeriesNavigationProps): UseSeriesNavigationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSort = searchParams.get('sort')

  // Fallback stocké en state pour le cas où l'URL n'a pas de param sort
  const [storedSort] = useState<SeriesSortOption>(() => getInitialSort(urlSort))

  // Source de vérité : URL param > storedSort (from localStorage/default)
  const sortOption: SeriesSortOption = isValidSort(urlSort) ? urlSort : storedSort

  const sortedSeries = useMemo(
    () => sortSeries(allSeries, sortOption),
    [allSeries, sortOption]
  )

  const currentIndex = useMemo(() => {
    if (!currentSeriesId) return -1
    return sortedSeries.findIndex((s) => s.series_id === currentSeriesId)
  }, [sortedSeries, currentSeriesId])

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < sortedSeries.length - 1

  const previousSeries = hasPrevious ? sortedSeries[currentIndex - 1] : null
  const nextSeries = hasNext ? sortedSeries[currentIndex + 1] : null

  const buildSeriesUrl = useCallback(
    (seriesId: string, sort: SeriesSortOption) => {
      return `/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(seriesId)}&sort=${sort}`
    },
    [jobId]
  )

  const setSortOption = useCallback(
    (option: SeriesSortOption) => {
      localStorage.setItem(STORAGE_KEY, option)

      // Mettre à jour l'URL sans ajouter à l'historique
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', option)
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const goToPrevious = useCallback(() => {
    if (previousSeries) {
      router.push(buildSeriesUrl(previousSeries.series_id, sortOption))
    }
  }, [previousSeries, router, buildSeriesUrl, sortOption])

  const goToNext = useCallback(() => {
    if (nextSeries) {
      router.push(buildSeriesUrl(nextSeries.series_id, sortOption))
    }
  }, [nextSeries, router, buildSeriesUrl, sortOption])

  const goToSeries = useCallback(
    (seriesId: string) => {
      router.push(buildSeriesUrl(seriesId, sortOption))
    },
    [router, buildSeriesUrl, sortOption]
  )

  return {
    sortedSeries,
    sortOption,
    setSortOption,
    currentIndex,
    hasPrevious,
    hasNext,
    previousSeries,
    nextSeries,
    goToPrevious,
    goToNext,
    goToSeries,
  }
}
