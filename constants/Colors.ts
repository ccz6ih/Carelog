/**
 * CareLog Design System — Colors
 * Extracted from pitch deck visual language
 * Dark-first, medical-grade trust, warm family accent
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
  800: '#142842', // Card backgrounds
  900: '#0B1622', // App background — the deep dark
  950: '#070E17', // True black areas
};

const orange = {
  400: '#FFB347',
  500: '#FF9F1C', // Secondary — warnings, tier highlights
  600: '#E88B00',
};

const purple = {
  400: '#B794F6',
  500: '#9B72E8', // Tertiary — Pro tier, special features
  600: '#7C4DDB',
};

const pink = {
  400: '#FF6B8A',
  500: '#FF4069', // Accent — urgent, Family tier, alerts
  600: '#E02050',
};

const green = {
  400: '#6BCB77',
  500: '#4CAF50', // Confirmed, success states
  600: '#388E3C',
};

const red = {
  400: '#FF6B6B',
  500: '#EF4444', // Errors, denied claims
  600: '#DC2626',
};

// Semantic color tokens — what things MEAN, not what they ARE
export const Colors = {
  // Backgrounds
  background: navy[900],
  backgroundElevated: navy[800],
  backgroundCard: navy[800],
  backgroundModal: navy[700],
  surface: '#162231',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8BA3BE',
  textMuted: '#5A7A9A',
  textInverse: navy[900],

  // Brand
  primary: teal[500],
  primaryLight: teal[300],
  primaryDark: teal[700],

  // Accents (matching pitch deck border colors)
  accent: {
    orange: orange[500],
    purple: purple[500],
    pink: pink[500],
    teal: teal[500],
    green: green[500],
  },

  // Semantic
  success: green[500],
  warning: orange[500],
  error: red[500],
  info: teal[400],

  // Tier-specific (from pitch deck pricing cards)
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

  // Gradient pairs for CTAs
  gradient: {
    primary: [teal[500], teal[400]],
    warm: [orange[500], orange[400]],
    premium: [purple[500], purple[400]],
  },

  // Border colors from pitch deck card styles
  border: {
    default: 'rgba(0, 212, 170, 0.15)',
    active: teal[500],
    card: 'rgba(139, 163, 190, 0.12)',
  },

  // Tab bar
  tabBar: {
    background: navy[950],
    active: teal[500],
    inactive: navy[400],
  },
} as const;

export default Colors;
