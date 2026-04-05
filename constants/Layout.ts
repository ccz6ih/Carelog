/**
 * CareLog Layout Constants
 * Responsive spacing, radii, sizing, breakpoints
 */
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive breakpoints
const isSmall = SCREEN_WIDTH < 375;
const isMedium = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isTablet = SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024;
const isDesktop = SCREEN_WIDTH >= 1024;

export const Layout = {
  screen: {
    width: SCREEN_WIDTH,
    isSmall,
    isMedium,
    isTablet,
    isDesktop,
    isWeb: Platform.OS === 'web',
  },

  // Content max-width for web (prevents ultra-wide stretching)
  content: {
    maxWidth: 480,
    maxWidthWide: 960,
    paddingHorizontal: isDesktop ? 0 : isTablet ? 40 : 24,
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
    size: isSmall ? 170 : 220,
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
