import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { updateManifest } from "./lib/manifest-updater";

// Function to update page meta tags and manifest dynamically
async function updatePageMeta() {
  try {
    // Fetch restaurant config from API
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/restaurant-config`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const config = await response.json();
      
      // Update title
      const title = `${config.name || 'Restaurant'} - ${config.tagline || 'Order Online'}`;
      document.title = title;
      
      // Update meta description
      const descriptionParts = [config.description || 'Order delicious food online'];
      if (config.phone) descriptionParts.push(`Call ${config.phone}`);
      if (config.address?.street) descriptionParts.push(`${config.address.street}, ${config.address.postalCode} ${config.address.city}`);
      const description = descriptionParts.join('. ');
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
      
      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      }
      
      // Update Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
      
      // Update PWA manifest
      await updateManifest(config);
      
      console.log('✅ Page meta tags and manifest updated dynamically');
    } else {
      // Use default title when config not available
      document.title = 'Ravintola Babylon - Order Online';
      console.log('ℹ️ Using default page title');
    }
  } catch (error) {
    console.warn('⚠️ Could not update page meta tags:', error);
    // Fallback to default values if API fails
    document.title = 'Ravintola Babylon - Order Online';
  }
}

// Update meta tags before rendering
updatePageMeta();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Enhanced error handling for app initialization
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to initialize React app:", error);
  // Fallback error display
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Sivuston lataus epäonnistui / Page Load Failed</h1>
      <p>Päivitä sivu tai yritä myöhemmin uudelleen / Please refresh the page or try again later</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">
        Päivitä sivu / Refresh Page
      </button>
    </div>
  `;
}
