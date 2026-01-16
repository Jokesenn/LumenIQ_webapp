// Design tokens extracted from LumenIQ_Website_SaaS_v3.jsx

export const tokens = {
  dark: {
    bgPrimary: '#0B1020',
    bgSecondary: '#0D1428',
    bgSurface: '#111A30',
    bgHover: '#1A2340',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A8C0',
    textMuted: '#5A6380',
    accent: '#4F5BD5',
    accentHover: '#6370E8',
    accentMuted: 'rgba(79, 91, 213, 0.15)',
    border: '#1E2A45',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  light: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FC',
    bgSurface: '#EEF0F5',
    bgHover: '#E4E7EF',
    textPrimary: '#0B1020',
    textSecondary: '#4A5068',
    textMuted: '#8891A8',
    accent: '#4F5BD5',
    accentHover: '#3D49B8',
    accentMuted: 'rgba(79, 91, 213, 0.1)',
    border: '#D0D4E0',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
  }
} as const;

export type ThemeTokens = typeof tokens.dark;
export type Theme = 'dark' | 'light';

// ABC Distribution colors
export const abcColors = {
  A: '#4F5BD5',
  B: '#6370E8',
  C: '#8B94E8',
} as const;

// Chart colors
export const chartColors = {
  primary: '#4F5BD5',
  secondary: '#6370E8',
  tertiary: '#8B94E8',
  actual: '#A0A8C0',
  forecast: '#4F5BD5',
} as const;
