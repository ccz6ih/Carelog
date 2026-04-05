/**
 * CareLog Typography System
 * 2026 — clean, confident, high-contrast
 * System font stack with precise weight/tracking control
 */
import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  default: undefined,
});

export const Typography = {
  // Hero numbers (like $2.7B, 33.3%)
  heroStat: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily,
    letterSpacing: -1.5,
    lineHeight: 52,
  } as TextStyle,

  // Display — oversized for impact
  display: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily,
    letterSpacing: -1,
    lineHeight: 40,
  } as TextStyle,

  // Screen titles
  h1: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily,
    letterSpacing: -0.5,
    lineHeight: 34,
  } as TextStyle,

  // Section headers
  h2: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily,
    letterSpacing: -0.3,
    lineHeight: 28,
  } as TextStyle,

  // Card titles
  h3: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily,
    letterSpacing: -0.2,
    lineHeight: 22,
  } as TextStyle,

  // Body text
  body: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily,
    lineHeight: 22,
  } as TextStyle,

  bodySm: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily,
    lineHeight: 18,
  } as TextStyle,

  // Labels, captions
  caption: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily,
    letterSpacing: 0.3,
    lineHeight: 16,
  } as TextStyle,

  // Micro — smallest readable
  micro: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily,
    letterSpacing: 0.5,
    lineHeight: 12,
  } as TextStyle,

  // Section label (spaced uppercase)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    lineHeight: 14,
  } as TextStyle,

  // Button text
  button: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily,
    letterSpacing: 0.2,
    lineHeight: 20,
  } as TextStyle,

  buttonSm: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily,
    letterSpacing: 0.2,
    lineHeight: 18,
  } as TextStyle,

  // Monospace (for timers, codes)
  mono: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ web: '"SF Mono", "Fira Code", "Courier New", monospace', default: undefined }),
    letterSpacing: 1,
    lineHeight: 20,
  } as TextStyle,
} as const;

export default Typography;
