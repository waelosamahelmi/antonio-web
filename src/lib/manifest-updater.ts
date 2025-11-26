/**
 * Dynamic Manifest Updater
 * Updates PWA manifest.json with restaurant-specific information at runtime
 */

import type { RestaurantConfig } from '@/config/restaurant-config';

export async function updateManifest(config: RestaurantConfig) {
  try {
    // Create dynamic manifest
    const manifest = {
      name: config.name || 'Ravintola Babylon',
      short_name: config.name?.split(' ').pop() || 'Babylon',
      description: config.description || 'Finnish restaurant offering pizza, kebab, and traditional cuisine',
      theme_color: "#dc2626",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      categories: ["food", "shopping"],
      screenshots: []
    };

    // Convert to JSON string
    const manifestJson = JSON.stringify(manifest);
    const blob = new Blob([manifestJson], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);

    // Update manifest link in document
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    // Set the new manifest URL
    manifestLink.href = manifestURL;

    console.log('✅ PWA Manifest updated dynamically with restaurant info');
  } catch (error) {
    console.warn('⚠️ Could not update PWA manifest:', error);
  }
}
