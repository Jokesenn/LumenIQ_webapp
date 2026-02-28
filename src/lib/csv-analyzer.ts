/**
 * Utilitaire d'analyse de fichiers CSV pour la configuration forecast
 * Supporte les formats Wide et Long (tidy)
 */

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'unknown'
export type CsvFormat = 'long' | 'wide'

export interface CsvAnalysis {
  seriesCount: number
  rowCount: number
  frequency: Frequency
  historyPeriods: number
  dateColumn: string | null
  valueColumns: string[]
  hasSeasonality: boolean
  seasonalityPeriod: number | null
  sampleDates: string[]
  errors: string[]
  format: CsvFormat
  seriesIdColumn: string | null
}

// Noms de colonnes typiques pour identifier les séries en format long
const SERIES_ID_PATTERNS = [
  'series_id',
  'serie_id',
  'unique_id',
  'sku',
  'product_id',
  'item_id',
  'product',
  'item',
  'series',
  'serie',
  'sku_id',
  'article',
  'reference',
]

// Noms de colonnes typiques pour les dates
const DATE_COLUMN_PATTERNS = ['ds', 'date', 'datetime', 'timestamp', 'time', 'period']

// Noms de colonnes typiques pour les valeurs
const VALUE_COLUMN_PATTERNS = ['y', 'value', 'values', 'target', 'sales', 'quantity', 'qty', 'amount']

/**
 * Lit et parse un fichier CSV
 */
async function readCsvFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        resolve(text)
      } else {
        reject(new Error('Impossible de lire le fichier'))
      }
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsText(file)
  })
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCsvLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

/**
 * Détecte le délimiteur CSV (virgule ou point-virgule)
 */
function detectDelimiter(firstLine: string): string {
  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length
  return semicolonCount > commaCount ? ';' : ','
}

/**
 * Vérifie si une chaîne est une date valide
 */
function isDateString(value: string): boolean {
  if (!value || value.trim() === '') return false

  // Patterns de date courants
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY ou MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
    /^\d{4}-\d{2}$/, // YYYY-MM (monthly)
    /^\d{4}$/, // YYYY (yearly)
  ]

  const trimmed = value.trim()
  if (datePatterns.some((p) => p.test(trimmed))) {
    return true
  }

  // Essayer de parser comme date
  const parsed = Date.parse(trimmed)
  if (!isNaN(parsed)) {
    const date = new Date(parsed)
    // Vérifier que c'est une date raisonnable (entre 1900 et 2100)
    const year = date.getFullYear()
    return year >= 1900 && year <= 2100
  }

  return false
}

/**
 * Vérifie si une chaîne est un nombre
 */
function isNumericString(value: string): boolean {
  if (!value || value.trim() === '') return false
  const trimmed = value.trim().replace(',', '.') // Support format européen
  return !isNaN(parseFloat(trimmed)) && isFinite(parseFloat(trimmed))
}

/**
 * Parse une date depuis différents formats
 */
function parseDate(value: string): Date | null {
  if (!value || value.trim() === '') return null

  const trimmed = value.trim()

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed)
  }

  // Format DD-MM-YYYY (comme 01-01-2019)
  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // Format DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // Format YYYY-MM (monthly)
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed + '-01')
  }

  // Fallback: essayer Date.parse
  const parsed = Date.parse(trimmed)
  if (!isNaN(parsed)) {
    return new Date(parsed)
  }

  return null
}

/**
 * Détecte la fréquence à partir d'un tableau d'écarts en jours
 */
function detectFrequencyFromGaps(gaps: number[]): { frequency: Frequency; seasonalityPeriod: number | null } {
  if (gaps.length === 0) {
    return { frequency: 'unknown', seasonalityPeriod: null }
  }

  // Calculer la médiane des écarts
  const sortedGaps = [...gaps].sort((a, b) => a - b)
  const median = sortedGaps[Math.floor(sortedGaps.length / 2)]

  // Déterminer la fréquence et la saisonnalité
  if (median <= 1.5) {
    return { frequency: 'daily', seasonalityPeriod: 365 }
  } else if (median <= 8) {
    return { frequency: 'weekly', seasonalityPeriod: 52 }
  } else if (median <= 35) {
    return { frequency: 'monthly', seasonalityPeriod: 12 }
  } else if (median <= 100) {
    return { frequency: 'quarterly', seasonalityPeriod: 4 }
  } else {
    return { frequency: 'yearly', seasonalityPeriod: null }
  }
}

/**
 * Calcule la fréquence à partir des écarts entre dates consécutives
 */
function detectFrequency(dates: Date[]): { frequency: Frequency; seasonalityPeriod: number | null } {
  if (dates.length < 2) {
    return { frequency: 'unknown', seasonalityPeriod: null }
  }

  // Trier les dates
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())

  // Calculer les écarts en jours
  const gaps: number[] = []
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    if (diff > 0) {
      gaps.push(diff)
    }
  }

  return detectFrequencyFromGaps(gaps)
}

/**
 * Détecte si le CSV est en format long et retourne l'index de la colonne series_id
 * Retourne -1 si format wide
 */
function detectSeriesIdColumn(headers: string[]): number {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim())

  for (let i = 0; i < lowerHeaders.length; i++) {
    const header = lowerHeaders[i]
    // Vérifier si le nom de colonne correspond à un pattern de series_id
    if (SERIES_ID_PATTERNS.some((p) => header === p || header.includes(p))) {
      return i
    }
  }

  return -1
}

/**
 * Détecte la colonne de date par nom ou par contenu
 */
function detectDateColumn(
  headers: string[],
  dataRows: string[][]
): { index: number; name: string | null } {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim())

  // D'abord essayer par nom de colonne
  for (let i = 0; i < lowerHeaders.length; i++) {
    if (DATE_COLUMN_PATTERNS.some((p) => lowerHeaders[i] === p || lowerHeaders[i].includes(p))) {
      return { index: i, name: headers[i] }
    }
  }

  // Sinon, chercher par contenu (première colonne avec >80% de dates)
  for (let col = 0; col < headers.length; col++) {
    const values = dataRows.map((row) => row[col]).filter(Boolean)
    const dateCount = values.filter(isDateString).length
    if (values.length > 0 && dateCount / values.length > 0.8) {
      return { index: col, name: headers[col] }
    }
  }

  return { index: -1, name: null }
}

/**
 * Analyse un fichier CSV et retourne les statistiques
 * Supporte les formats Wide et Long (tidy)
 */
export async function analyzeCsvFile(file: File): Promise<CsvAnalysis> {
  const errors: string[] = []

  try {
    const content = await readCsvFile(file)
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '')

    if (lines.length < 2) {
      return {
        seriesCount: 0,
        rowCount: 0,
        frequency: 'unknown',
        historyPeriods: 0,
        dateColumn: null,
        valueColumns: [],
        hasSeasonality: false,
        seasonalityPeriod: null,
        sampleDates: [],
        errors: ['Le fichier doit contenir au moins un en-tête et une ligne de données'],
        format: 'wide',
        seriesIdColumn: null,
      }
    }

    // Détecter le délimiteur
    const delimiter = detectDelimiter(lines[0])

    // Parser l'en-tête
    const headers = parseCsvLine(lines[0], delimiter)

    // Parser TOUTES les lignes pour le comptage des séries uniques
    const allDataRows: string[][] = []
    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i], delimiter)
      if (row.length > 0 && row.some((cell) => cell.trim() !== '')) {
        allDataRows.push(row)
      }
    }

    const rowCount = allDataRows.length

    // Détecter le format : Long ou Wide
    const seriesIdColumnIndex = detectSeriesIdColumn(headers)
    const isLongFormat = seriesIdColumnIndex >= 0
    const format: CsvFormat = isLongFormat ? 'long' : 'wide'
    const seriesIdColumn = isLongFormat ? headers[seriesIdColumnIndex] : null

    // Détecter la colonne date
    const { index: dateColumnIndex, name: dateColumn } = detectDateColumn(headers, allDataRows.slice(0, 100))

    if (dateColumnIndex === -1) {
      errors.push('Aucune colonne de date détectée')
    }

    let seriesCount = 0
    let historyPeriods = 0
    let valueColumns: string[] = []
    const dates: Date[] = []
    const sampleDates: string[] = []
    const intraSeriesGaps: number[] = []
    let globalMinDate: Date | null = null
    let globalMaxDate: Date | null = null

    if (isLongFormat) {
      // === FORMAT LONG (TIDY) ===
      // Compter les séries uniques et collecter les dates par série
      const uniqueSeries = new Set<string>()
      const datesBySeries = new Map<string, Date[]>()

      for (const row of allDataRows) {
        const seriesId = row[seriesIdColumnIndex]
        if (!seriesId || seriesId.trim() === '') continue

        const trimmedId = seriesId.trim()
        uniqueSeries.add(trimmedId)

        if (dateColumnIndex >= 0) {
          const dateStr = row[dateColumnIndex]
          const date = parseDate(dateStr)
          if (date) {
            if (!datesBySeries.has(trimmedId)) {
              datesBySeries.set(trimmedId, [])
              // Collecter les dates d'exemple sur la première série rencontrée
              if (sampleDates.length < 5) sampleDates.push(dateStr)
            }
            datesBySeries.get(trimmedId)!.push(date)

            // Tracker la plage temporelle globale (toutes séries confondues)
            if (!globalMinDate || date < globalMinDate) globalMinDate = date
            if (!globalMaxDate || date > globalMaxDate) globalMaxDate = date
          }
        }
      }

      seriesCount = uniqueSeries.size

      // Calculer tous les écarts intra-séries pour une détection de fréquence robuste.
      // Utiliser toutes les séries évite le biais dû aux séries creuses/intermittentes
      // qui peuvent avoir des écarts anormalement grands.
      for (const [, seriesDates] of datesBySeries) {
        const sorted = [...seriesDates].sort((a, b) => a.getTime() - b.getTime())
        for (let i = 1; i < sorted.length; i++) {
          const diffDays = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
          if (diffDays > 0) intraSeriesGaps.push(diffDays)
        }
      }

      // Trouver la colonne de valeur
      for (let col = 0; col < headers.length; col++) {
        if (col === dateColumnIndex || col === seriesIdColumnIndex) continue

        const lowerHeader = headers[col].toLowerCase()
        // Vérifier si c'est une colonne de valeur par nom
        if (VALUE_COLUMN_PATTERNS.some((p) => lowerHeader === p || lowerHeader.includes(p))) {
          valueColumns.push(headers[col])
          continue
        }

        // Ou par contenu numérique
        const values = allDataRows.slice(0, 100).map((row) => row[col]).filter(Boolean)
        const numericCount = values.filter(isNumericString).length
        if (values.length > 0 && numericCount / values.length > 0.7) {
          valueColumns.push(headers[col])
        }
      }
    } else {
      // === FORMAT WIDE ===
      // Chaque colonne numérique (hors date) est une série
      for (let col = 0; col < headers.length; col++) {
        if (col === dateColumnIndex) continue

        const values = allDataRows.slice(0, 100).map((row) => row[col]).filter(Boolean)
        const numericCount = values.filter(isNumericString).length
        if (values.length > 0 && numericCount / values.length > 0.7) {
          valueColumns.push(headers[col])
        }
      }

      seriesCount = valueColumns.length

      // Parser toutes les dates pour la détection de fréquence et la plage temporelle
      if (dateColumnIndex >= 0) {
        for (const row of allDataRows) {
          const dateStr = row[dateColumnIndex]
          const date = parseDate(dateStr)
          if (date) {
            dates.push(date)
            if (sampleDates.length < 5) {
              sampleDates.push(dateStr)
            }
            if (!globalMinDate || date < globalMinDate) globalMinDate = date
            if (!globalMaxDate || date > globalMaxDate) globalMaxDate = date
          }
        }
      }
    }

    // Détecter la fréquence
    // Format long : utiliser les écarts intra-séries (toutes séries confondues) pour éviter
    // le biais des séries intermittentes/creuses qui fausseraient la médiane globale.
    // Format wide : les dates sont déjà celles d'une unique série par colonne.
    const { frequency, seasonalityPeriod } = isLongFormat
      ? detectFrequencyFromGaps(intraSeriesGaps)
      : detectFrequency(dates)

    // Calculer l'historique à partir de la plage temporelle réelle (min → max toutes séries),
    // convertie en nombre de périodes selon la fréquence détectée.
    // L'ancienne formule (rowCount / seriesCount) donnait la moyenne de points par série,
    // pas la couverture temporelle réelle — sous-estimant fortement pour les datasets mixtes.
    if (globalMinDate && globalMaxDate && frequency !== 'unknown') {
      const spanDays = (globalMaxDate.getTime() - globalMinDate.getTime()) / (1000 * 60 * 60 * 24)
      historyPeriods = Math.round(spanDays / frequencyToPeriodDays(frequency))
    }

    return {
      seriesCount,
      rowCount,
      frequency,
      historyPeriods,
      dateColumn,
      valueColumns,
      hasSeasonality: seasonalityPeriod !== null,
      seasonalityPeriod,
      sampleDates,
      errors,
      format,
      seriesIdColumn,
    }
  } catch (error) {
    return {
      seriesCount: 0,
      rowCount: 0,
      frequency: 'unknown',
      historyPeriods: 0,
      dateColumn: null,
      valueColumns: [],
      hasSeasonality: false,
      seasonalityPeriod: null,
      sampleDates: [],
      errors: [error instanceof Error ? error.message : "Erreur lors de l'analyse du fichier"],
      format: 'wide',
      seriesIdColumn: null,
    }
  }
}

/**
 * Retourne le nombre de jours correspondant à une période de la fréquence donnée
 */
function frequencyToPeriodDays(frequency: Frequency): number {
  switch (frequency) {
    case 'daily': return 1
    case 'weekly': return 7
    case 'monthly': return 30.44
    case 'quarterly': return 91.31
    case 'yearly': return 365.25
    default: return 1
  }
}

/**
 * Retourne le label français pour une fréquence
 */
export function getFrequencyLabel(frequency: Frequency): string {
  const labels: Record<Frequency, string> = {
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuelle',
    quarterly: 'Trimestrielle',
    yearly: 'Annuelle',
    unknown: 'Non détectée',
  }
  return labels[frequency]
}

/**
 * Retourne le label de période pour une fréquence
 */
export function getFrequencyPeriodLabel(frequency: Frequency, count: number): string {
  const labels: Record<Frequency, string> = {
    daily: count === 1 ? 'jour' : 'jours',
    weekly: count === 1 ? 'semaine' : 'semaines',
    monthly: 'mois',
    quarterly: count === 1 ? 'trimestre' : 'trimestres',
    yearly: count === 1 ? 'an' : 'ans',
    unknown: count === 1 ? 'période' : 'périodes',
  }
  return `${count} ${labels[frequency]}`
}
