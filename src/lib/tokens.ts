// Design tokens — Signal V6 identity (copper/light)

export const tokens = {
  light: {
    bgPrimary: '#FAFAF9',
    bgSecondary: '#FFFFFF',
    bgSurface: '#F3F3F0',
    bgHover: '#E8E8E3',
    textPrimary: '#141414',
    textSecondary: '#5C5C58',
    textMuted: '#8A8A82',
    accent: '#B45309',
    accentHover: '#9A4408',
    accentMuted: 'rgba(180, 83, 9, 0.1)',
    border: '#E5E5E0',
    success: '#15803D',
    warning: '#A16207',
    danger: '#B91C1C',
  }
} as const;

export type ThemeTokens = typeof tokens.light;

// ABC Distribution colors — Signal V6 (success/warning/muted)
export const abcColors = {
  A: '#15803D',
  B: '#A16207',
  C: '#8A8A82',
} as const;

// Chart colors — Signal V6 (actual=dark, forecast=copper)
export const chartColors = {
  primary: '#B45309',
  secondary: '#92400E',
  tertiary: '#92400E',
  actual: '#141414',
  forecast: '#B45309',
} as const;
