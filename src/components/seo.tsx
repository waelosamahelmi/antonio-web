import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
}

interface RestaurantSEOData {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  slug?: string;
  logo?: string;
  features?: {
    delivery?: boolean;
    pickup?: boolean;
    dineIn?: boolean;
  };
  openingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  priceRange?: string;
}

// Generate Restaurant structured data for Google
export function generateRestaurantStructuredData(restaurant: RestaurantSEOData): Record<string, any> {
  const openingHoursSpec = restaurant.openingHours
    ? Object.entries(restaurant.openingHours)
        .filter(([, hours]) => !hours.closed)
        .map(([day, hours]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: hours.open,
          closes: hours.close,
        }))
    : undefined;

  const servesCuisine = [];
  if (restaurant.features?.delivery) servesCuisine.push('Finnish');
  if (restaurant.features?.pickup) servesCuisine.push('Pizza');
  if (restaurant.features?.dineIn) servesCuisine.push('Kebab');

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description || `${restaurant.name} - Tilaa verkossa tai syö paikan päällä`,
    url: `https://${restaurant.slug || 'ravintola'}.plateos.fi`,
    logo: restaurant.logo || '/logo.png',
    image: restaurant.logo || '/logo.png',
    telephone: restaurant.phone,
    email: restaurant.email,
    priceRange: restaurant.priceRange || '€€',
    servesCuisine: servesCuisine.length > 0 ? servesCuisine : ['Finnish', 'International'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      postalCode: restaurant.postalCode,
      addressCountry: 'FI',
    },
    ...(openingHoursSpec && { openingHoursSpecification: openingHoursSpec }),
    ...(restaurant.features?.delivery && {
      potentialAction: {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://${restaurant.slug || 'ravintola'}.plateos.fi/menu`,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        deliveryMethod: [
          ...(restaurant.features?.delivery ? ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'] : []),
          ...(restaurant.features?.pickup ? ['http://purl.org/goodrelations/v1#DeliveryModePickUp'] : []),
        ],
      },
    }),
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate menu item structured data
export function generateMenuStructuredData(
  items: Array<{
    name: string;
    description?: string;
    price: number;
    image?: string;
    category?: string;
  }>,
  restaurantName: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${restaurantName} Menu`,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'Menu Items',
        hasMenuItem: items.slice(0, 20).map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description,
          offers: {
            '@type': 'Offer',
            price: item.price.toFixed(2),
            priceCurrency: 'EUR',
          },
          ...(item.image && { image: item.image }),
        })),
      },
    ],
  };
}

// SEO Component that manages meta tags
export function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  structuredData,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper to set meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Set basic meta tags
    if (description) {
      setMetaTag('description', description);
    }

    if (keywords && keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }

    // Set Open Graph tags
    if (ogTitle) {
      setMetaTag('og:title', ogTitle, true);
    }

    if (ogDescription) {
      setMetaTag('og:description', ogDescription, true);
    }

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
    }

    if (ogUrl) {
      setMetaTag('og:url', ogUrl, true);
    }

    // Set Twitter tags
    setMetaTag('twitter:card', 'summary_large_image');
    if (ogTitle) {
      setMetaTag('twitter:title', ogTitle);
    }
    if (ogDescription) {
      setMetaTag('twitter:description', ogDescription);
    }
    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
    }

    // Set robots meta
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    }

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('#structured-data') as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Optional: Remove structured data on unmount
      // const script = document.querySelector('#structured-data');
      // if (script) script.remove();
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, structuredData, noindex]);

  return null;
}

// Helper hook to generate canonical URL
export function useCanonicalUrl(path = ''): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}${path}`;
}

// Sitemap generation helper (for server-side use)
export function generateSitemap(
  baseUrl: string,
  pages: Array<{ path: string; priority?: number; changeFreq?: string; lastMod?: string }>
): string {
  const urls = pages.map(
    (page) => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastMod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changeFreq || 'weekly'}</changefreq>
    <priority>${page.priority || 0.5}</priority>
  </url>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;
}

export default SEO;
