/**
 * CareLog Typography System
 * Clean, medical-grade clarity. High contrast for accessibility.
 */
import { TextStyle } from 'react-native';

export const Typography = {
  // Hero numbers (like $2.7B, 33.3%)
  heroStat: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 52,
  } as TextStyle,

  // Screen titles
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
  } as TextStyle,

  // Section headers
  h2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 28,
  } as TextStyle,

  // Card titles
  h3: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 24,
  } as TextStyle,

  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodySm: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  // Labels, captions
  caption: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: 16,
  } as TextStyle,

  // Spaced label (THE PROBLEM, THE MARKET — pitch deck section headers)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    lineHeight: 14,
  } as TextStyle,

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 20,
  } as TextStyle,

  buttonSm: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 18,
  } as TextStyle,
} as const;

export default Typography;
