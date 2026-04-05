/**
 * CareLog Layout Constants
 * Consistent spacing, radii, and sizing
 */

export const Layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Clock button (the hero interaction)
  clockButton: {
    size: 200,
    borderWidth: 4,
  },
} as const;

export default Layout;
