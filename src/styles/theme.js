export const theme = {
  colors: {
    // Brand & Highlights
    primary: '#1E3A8A',      // Deep Navy Blue
    primaryDark: '#0F172A',  // Slate 900
    primaryLight: '#3B82F6', // Vibrant Blue
    primarySoft: '#EFF6FF',  // Light Blue Tint
    
    accent: '#10B981',       // Football Pitch Emerald Green
    accentDark: '#059669',
    accentLight: '#ECFDF5',  // Emerald Tint
    
    warning: '#F59E0B',      // Amber
    warningLight: '#FEF3C7',
    
    danger: '#EF4444',       // Crimson Red
    dangerLight: '#FEE2E2',
    
    // Backgrounds & Surfaces
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    
    // Borders & Dividers
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    borderFocus: '#2563EB',
    
    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textWhite: '#FFFFFF',
    
    // Scout Badges
    badgeGold: '#F59E0B',
    badgeSilver: '#94A3B8',
    badgeBronze: '#D97706',
    
    // Overlays
    overlay: 'rgba(15, 23, 42, 0.55)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 2,
    },
    hover: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 4,
    },
    modal: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 8,
    },
  },

  typography: {
    fontFamily: {
      regular: 'System',
    },
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      title: 28,
    },
  },
};
