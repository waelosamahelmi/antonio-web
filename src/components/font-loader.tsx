import { useEffect } from 'react';
import { useRestaurant } from '@/lib/restaurant-context';

/**
 * Component that dynamically loads Google Fonts based on restaurant config
 * Place this at the root of your app (in App.tsx or main layout)
 */
export function FontLoader() {
  const { config } = useRestaurant();
  
  useEffect(() => {
    const fonts = config.theme?.fonts;
    if (!fonts) return;
    
    const { heading, body, display } = fonts as { heading?: string; body?: string; display?: string };
    const fontsToLoad = new Set<string>();
    
    // Collect unique fonts
    if (heading) fontsToLoad.add(heading);
    if (body) fontsToLoad.add(body);
    if (display) fontsToLoad.add(display);
    
    // Remove existing Google Fonts link if any
    const existingLink = document.getElementById('google-fonts-link');
    if (existingLink) {
      existingLink.remove();
    }
    
    if (fontsToLoad.size === 0) return;
    
    // Create Google Fonts URL
    const fontFamilies = Array.from(fontsToLoad)
      .map(font => `family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900`)
      .join('&');
    
    const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;
    
    // Create and append link element
    const link = document.createElement('link');
    link.id = 'google-fonts-link';
    link.rel = 'stylesheet';
    link.href = googleFontsUrl;
    document.head.appendChild(link);
    
    // Apply font-family CSS custom properties to :root
    const root = document.documentElement;
    if (heading) root.style.setProperty('--font-heading', `"${heading}", sans-serif`);
    if (body) root.style.setProperty('--font-body', `"${body}", sans-serif`);
    if (display) root.style.setProperty('--font-display', `"${display}", sans-serif`);
    
    // Cleanup function
    return () => {
      const linkToRemove = document.getElementById('google-fonts-link');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [config.theme?.fonts]);
  
  return null; // This component doesn't render anything
}
