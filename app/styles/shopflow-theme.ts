// Storvana Design System — Warm Amber + Deep Charcoal Luxury Dark Theme
// Author: Mohit Lakhara

export const ShopColors = {
  // Brand Core
  primary: '#F59E0B',        // Amber 400 — luxury gold
  primaryDark: '#D97706',    // Amber 600
  primaryLight: '#FDE68A',   // Amber 200
  accent: '#EC4899',         // Pink 500 — sale accent
  accentDark: '#BE185D',

  // Backgrounds
  bg: '#0C0B0A',             // Rich charcoal black
  bgCard: '#1A1712',         // Warm dark card
  bgCardBorder: 'rgba(245, 158, 11, 0.2)',
  bgSurface: '#141210',
  bgInput: 'rgba(255,255,255,0.07)',
  bgOverlay: 'rgba(0,0,0,0.6)',

  // Semantic
  success: '#10B981',
  danger: '#EF4444',
  sale: '#EC4899',
  badge: '#F59E0B',

  // Text
  textPrimary: '#FAFAF9',
  textSecondary: '#D6D3D1',
  textMuted: '#78716C',
  textGold: '#FCD34D',
  textInverse: '#0C0B0A',

  // Gradients
  gradHero: ['#1A1712', '#2D2416'],
  gradGold: ['#F59E0B', '#D97706'],
  gradCard: ['#1A1712', '#0C0B0A'],
  gradOverlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'],

  // Effects
  glass: 'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(245,158,11,0.15)',
  glow: 'rgba(245,158,11,0.3)',
};

export const ShopTypography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    display: 'PlayfairDisplay_700Bold', // luxury serif for product names
  },
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
};

export const ShopSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const ShopRadii = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const ShopShadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  goldGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};
