import { useEffect } from 'react';
import { useRestaurant } from '@/lib/restaurant-context';

/**
 * Component that injects theme colors as CSS custom properties
 * Supports both light and dark modes
 * Place this at the root of your app alongside FontLoader
 */
export function ThemeInjector() {
  const { config } = useRestaurant();
  
  useEffect(() => {
    const theme = config.theme;
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Light mode colors (default)
    if (theme.light) {
      root.style.setProperty('--background', theme.light.background || '#ffffff');
      root.style.setProperty('--foreground', theme.light.foreground || '#1f2937');
      root.style.setProperty('--card', theme.light.card || '#ffffff');
      root.style.setProperty('--card-foreground', theme.light.cardForeground || '#1f2937');
      root.style.setProperty('--popover', theme.light.popover || '#ffffff');
      root.style.setProperty('--popover-foreground', theme.light.popoverForeground || '#1f2937');
      root.style.setProperty('--primary', theme.light.primary || '#8B4513');
      root.style.setProperty('--primary-foreground', theme.light.primaryForeground || '#ffffff');
      root.style.setProperty('--secondary', theme.light.secondary || '#FF8C00');
      root.style.setProperty('--secondary-foreground', theme.light.secondaryForeground || '#ffffff');
      root.style.setProperty('--muted', theme.light.muted || '#f3f4f6');
      root.style.setProperty('--muted-foreground', theme.light.mutedForeground || '#6b7280');
      root.style.setProperty('--accent', theme.light.accent || '#F5E6D3');
      root.style.setProperty('--accent-foreground', theme.light.accentForeground || '#1f2937');
      root.style.setProperty('--destructive', theme.light.destructive || '#dc2626');
      root.style.setProperty('--destructive-foreground', theme.light.destructiveForeground || '#ffffff');
      root.style.setProperty('--border', theme.light.border || '#e5e7eb');
      root.style.setProperty('--input', theme.light.input || '#e5e7eb');
      root.style.setProperty('--ring', theme.light.ring || '#8B4513');
    }
    
    // Base theme colors (for backward compatibility and gradients)
    if (theme.primary) root.style.setProperty('--color-primary', theme.primary);
    if (theme.secondary) root.style.setProperty('--color-secondary', theme.secondary);
    if (theme.accent) root.style.setProperty('--color-accent', theme.accent);
    if (theme.success) root.style.setProperty('--color-success', theme.success);
    if (theme.warning) root.style.setProperty('--color-warning', theme.warning);
    if (theme.error) root.style.setProperty('--color-error', theme.error);
    
    // Create CSS for dark mode
    const darkModeStyles = theme.dark ? `
      .dark {
        --background: ${theme.dark.background || '#1f2937'};
        --foreground: ${theme.dark.foreground || '#f9fafb'};
        --card: ${theme.dark.card || '#374151'};
        --card-foreground: ${theme.dark.cardForeground || '#f9fafb'};
        --popover: ${theme.dark.popover || '#1f2937'};
        --popover-foreground: ${theme.dark.popoverForeground || '#f9fafb'};
        --primary: ${theme.dark.primary || '#D2691E'};
        --primary-foreground: ${theme.dark.primaryForeground || '#ffffff'};
        --secondary: ${theme.dark.secondary || '#FFA500'};
        --secondary-foreground: ${theme.dark.secondaryForeground || '#1f2937'};
        --muted: ${theme.dark.muted || '#374151'};
        --muted-foreground: ${theme.dark.mutedForeground || '#9ca3af'};
        --accent: ${theme.dark.accent || '#4b5563'};
        --accent-foreground: ${theme.dark.accentForeground || '#f9fafb'};
        --destructive: ${theme.dark.destructive || '#dc2626'};
        --destructive-foreground: ${theme.dark.destructiveForeground || '#ffffff'};
        --border: ${theme.dark.border || '#4b5563'};
        --input: ${theme.dark.input || '#4b5563'};
        --ring: ${theme.dark.ring || '#D2691E'};
      }
    ` : '';
    
    // Inject or update dark mode stylesheet
    let darkModeStyleElement = document.getElementById('theme-dark-mode-styles') as HTMLStyleElement;
    if (!darkModeStyleElement) {
      darkModeStyleElement = document.createElement('style');
      darkModeStyleElement.id = 'theme-dark-mode-styles';
      document.head.appendChild(darkModeStyleElement);
    }
    darkModeStyleElement.textContent = darkModeStyles;
    
    // Cleanup
    return () => {
      // Keep styles on unmount, but could remove if needed
    };
  }, [config.theme]);
  
  return null; // This component doesn't render anything
}
