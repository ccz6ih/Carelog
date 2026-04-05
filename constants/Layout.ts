/**
 * CareLog Layout Constants
 * Responsive spacing, radii, sizing, breakpoints
 */
import { Platform } from 'react-native';

export const Layout = {
  screen: {
    isWeb: Platform.OS === 'web',
  },

  // Content max-width for web (prevents ultra-wide stretching)
  content: {
    maxWidth: 480,
    maxWidthWide: 960,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  // Clock button (the hero interaction)
  clockButton: {
    size: 220,
    borderWidth: 3,
    glowSize: 280,
  },

  // Shadows (layered for depth)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 8,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    }),
  },
} as const;

export default Layout;
