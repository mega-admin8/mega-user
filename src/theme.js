export const theme = {
  colors: {
    primary: '#6a0dad',       // The MegaPlay Purple
    primaryLight: '#f0e6fa',  // Muted background for active elements
    background: '#f8f9fa',    // 60% - The off-white app background
    surface: '#ffffff',       // 30% - The pure white cards
    textDark: '#1e293b',      // Instead of harsh pure black, use dark slate
    textMuted: '#64748b',     // Secondary text
    border: '#e2e8f0',        // Extremely subtle borders
    success: '#10b981',       // Soft Emerald Green
    successLight: '#d1fae5',
    danger: '#ef4444',        // Soft Rose Red
    dangerLight: '#fee2e2',
  },
  
  // 8-Point Grid System
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  
  // Standardized rounded corners
  radius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 999,
  },
  
  // One universal shadow to use everywhere
  shadows: {
    card: {
      shadowColor: '#64748b',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08, // Very subtle!
      shadowRadius: 16,
      elevation: 3, // For Android
    }
  }
};