import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#FFFFFF',
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#E2E8F0',
  },
  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: '#94A3B8',
  },
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: '#64748B',
  },
  label: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#CBD5E1',
  },
  button: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};
