/**
 * CareLog Design System — Colors
 * 2026 — Dark-first, glassmorphic, medical-grade trust
 * Refined palette with luminous accents
 */

// Core palette
const teal = {
  50: '#E0FFF6',
  100: '#B3FFE8',
  200: '#80FFD9',
  300: '#4DFFC9',
  400: '#1AFFBA',
  500: '#00D4AA', // Primary — CTA, active states, success
  600: '#00B894',
  700: '#009B7D',
  800: '#007D66',
  900: '#00604F',
};

const navy = {
  50: '#E8EDF2',
  100: '#C5D0DD',
  200: '#9EB2C7',
  300: '#7793B0',
  400: '#587DA0',
  500: '#3A6790',
  600: '#2D5478',
  700: '#1E3A54',
  800: '#142842',
  850: '#101F33', // New: card surfaces
  900: '#0B1622', // App background
  950: '#070E17', // Deepest
};

const orange = {
  400: '#FFB347',
  500: '#FF9F1C',
  600: '#E88B00',
};

const purple = {
  400: '#B794F6',
  500: '#9B72E8',
  600: '#7C4DDB',
};

const pink = {
  400: '#FF6B8A',
  500: '#FF4069',
  600: '#E02050',
};

const green = {
  400: '#6BCB77',
  500: '#4CAF50',
  600: '#388E3C',
};

const red = {
  400: '#FF6B6B',
  500: '#EF4444',
  600: '#DC2626',
};

// Semantic color tokens
export const Colors = {
  // Backgrounds (layered depth system)
  background: navy[900],
  backgroundElevated: navy[850],
  backgroundCard: navy[850],
  backgroundModal: navy[800],
  surface: '#162231',
  surfaceHover: '#1A2A3D',

  // Glass effect backgrounds
  glass: {
    background: 'rgba(20, 40, 66, 0.65)',
    backgroundLight: 'rgba(20, 40, 66, 0.4)',
    border: 'rgba(139, 163, 190, 0.12)',
    borderLight: 'rgba(139, 163, 190, 0.08)',
  },

  // Text (refined contrast levels)
  textPrimary: '#F0F4F8',
  textSecondary: '#8BA3BE',
  textTertiary: '#6B8AAA',
  textMuted: '#4A6A8A',
  textInverse: navy[900],

  // Brand
  primary: teal[500],
  primaryLight: teal[300],
  primaryDark: teal[700],
  primaryGlow: teal[500] + '30',

  // Accents
  accent: {
    orange: orange[500],
    purple: purple[500],
    pink: pink[500],
    teal: teal[500],
    green: green[500],
  },

  // Semantic
  success: green[500],
  successLight: green[400],
  warning: orange[500],
  warningLight: orange[400],
  error: red[500],
  errorLight: red[400],
  info: teal[400],

  // Tier-specific
  tier: {
    basic: teal[500],
    pro: green[500],
    family: purple[500],
  },

  // EVV Status
  evv: {
    clockedIn: teal[500],
    clockedOut: navy[400],
    submitted: green[500],
    error: red[500],
    pending: orange[500],
  },

  // Gradients
  gradient: {
    primary: [teal[500], teal[300]] as const,
    primarySubtle: [teal[500] + '20', teal[300] + '05'] as const,
    warm: [orange[500], orange[400]] as const,
    premium: [purple[500], purple[400]] as const,
    surface: [navy[850], navy[900]] as const,
    glow: [teal[500] + '40', teal[500] + '00'] as const,
  },

  // Border colors
  border: {
    default: 'rgba(0, 212, 170, 0.12)',
    active: teal[500],
    card: 'rgba(139, 163, 190, 0.08)',
    cardHover: 'rgba(139, 163, 190, 0.15)',
    subtle: 'rgba(139, 163, 190, 0.05)',
  },

  // Tab bar
  tabBar: {
    background: navy[950] + 'F0',
    active: teal[500],
    inactive: navy[400],
    indicator: teal[500],
  },

  // Overlays
  overlay: {
    light: 'rgba(11, 22, 34, 0.5)',
    medium: 'rgba(11, 22, 34, 0.7)',
    heavy: 'rgba(7, 14, 23, 0.85)',
  },
} as const;

export default Colors;
