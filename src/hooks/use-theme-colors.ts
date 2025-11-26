import { useRestaurant } from "@/lib/restaurant-context";

/**
 * Hook to get theme utilities and colors from restaurant config
 */
export function useThemeColors() {
  const { config } = useRestaurant();
  const theme = config.theme || {};

  return {
    // Primary colors
    primary: theme.primary || '#8B4513',
    secondary: theme.secondary || '#FF8C00',
    accent: theme.accent || '#F5E6D3',
    
    // Status colors
    success: theme.success || '#16a34a',
    warning: theme.warning || '#ea580c',
    error: theme.error || '#dc2626',
    
    // Base colors
    background: theme.background || '#ffffff',
    foreground: theme.foreground || '#1f2937',
    
    // Fonts
    fonts: theme.fonts || { heading: 'Inter', body: 'Inter' },
    
    // Utility functions
    getGradient: (from?: string, to?: string) => {
      const fromColor = from || theme.primary || '#8B4513';
      const toColor = to || theme.secondary || '#FF8C00';
      return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
    },
    
    getPrimaryGradient: () => {
      return `linear-gradient(135deg, ${theme.primary || '#8B4513'} 0%, ${theme.secondary || '#FF8C00'} 100%)`;
    },
    
    getButtonStyle: (variant: 'primary' | 'secondary' | 'success' | 'error' = 'primary') => {
      const colors = {
        primary: theme.primary || '#8B4513',
        secondary: theme.secondary || '#FF8C00',
        success: theme.success || '#16a34a',
        error: theme.error || '#dc2626'
      };
      
      return {
        backgroundColor: colors[variant],
        backgroundImage: variant === 'primary' 
          ? `linear-gradient(135deg, ${theme.primary || '#8B4513'} 0%, ${theme.secondary || '#FF8C00'} 100%)`
          : undefined
      };
    },
    
    getFontFamily: (type: 'heading' | 'body' = 'body') => {
      const fonts = theme.fonts || { heading: 'Inter', body: 'Inter' };
      return fonts[type] || 'Inter';
    }
  };
}

/**
 * Generate inline styles for themed elements
 */
export function getThemedStyles(theme: any) {
  return {
    primaryButton: {
      background: `linear-gradient(135deg, ${theme.primary || '#8B4513'} 0%, ${theme.secondary || '#FF8C00'} 100%)`,
      color: '#ffffff'
    },
    secondaryButton: {
      backgroundColor: theme.secondary || '#FF8C00',
      color: '#ffffff'
    },
    accentBackground: {
      backgroundColor: theme.accent || '#F5E6D3'
    },
    primaryText: {
      color: theme.primary || '#8B4513'
    },
    gradientText: {
      backgroundImage: `linear-gradient(135deg, ${theme.primary || '#8B4513'} 0%, ${theme.secondary || '#FF8C00'} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    headingFont: {
      fontFamily: theme.fonts?.heading || 'Inter'
    },
    bodyFont: {
      fontFamily: theme.fonts?.body || 'Inter'
    }
  };
}
