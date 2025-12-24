import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  noindex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Dream Avenue Convention Center - Luxury Event Venue',
  description = 'Premium luxury event venue in Calicut (Kozhikode) offering world-class facilities for weddings, corporate events, and grand celebrations. Capacity 500+ guests with modern amenities.',
  keywords = 'event venue, convention center, luxury venue, wedding hall, corporate events, Dream Avenue, banquet hall, Calicut events, wedding destination',
  image = '/og-image.jpg',
  url = 'https://dreamavenue.in',
  type = 'website',
  noindex = false,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.startsWith('meta[property')) {
          tag.setAttribute('property', selector.split('"')[1]);
        } else {
          tag.setAttribute('name', selector.split('"')[1]);
        }
        document.head.appendChild(tag);
      }
      
      tag.content = content;
    };

    // Standard meta tags
    updateMetaTag('meta[name="description"]', 'name', description);
    updateMetaTag('meta[name="keywords"]', 'name', keywords);
    updateMetaTag('meta[name="robots"]', 'name', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'property', title);
    updateMetaTag('meta[property="og:description"]', 'property', description);
    updateMetaTag('meta[property="og:image"]', 'property', image);
    updateMetaTag('meta[property="og:url"]', 'property', url);
    updateMetaTag('meta[property="og:type"]', 'property', type);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'Dream Avenue Convention Center');

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Structured Data (JSON-LD)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      "name": "Dream Avenue Convention Center",
      "description": description,
      "url": url,
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Dream Avenue",
        "addressLocality": "Calicut",
        "addressRegion": "Kerala",
        "addressCountry": "India"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "11.2588",
        "longitude": "75.7804"
      },
      "telephone": "+91 0000 000000",
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Air Conditioning",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Parking",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Catering",
          "value": true
        }
      ],
      "maximumAttendeeCapacity": 500
    };

    let scriptTag = document.querySelector('#seo-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

  }, [title, description, keywords, image, url, type, noindex]);

  return null;
};

