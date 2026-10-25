import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CONTACT_INFO } from '../src/constants/contact';

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
  title = 'Dream Avenue Event Hall | Bespoke Event Venue in Calicut',
  description = 'Premier contemporary event hall in Calicut (Kozhikode) offering refined spaces for weddings, receptions, corporate conclaves, and celebrations. Capacity 1,000+ guests with modern amenities.',
  keywords = 'event hall, wedding hall, Calicut function hall, reception hall, banquet hall, Dream Avenue Event Hall, Calicut events, Kozhikode event venue',
  image = '/og-image.jpg',
  url = 'https://dreamavenue.in',
  type = 'website',
  noindex = false,
}) => {
  // Structured Data (JSON-LD) - Dynamic based on type
  let schemaData: any;

  if (type === 'event') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      "name": "Dream Avenue Event Hall",
      "description": description,
      "url": url,
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Dream Avenue, Kozhikode Bypass",
        "addressLocality": "Calicut",
        "addressRegion": "Kerala",
        "addressCountry": "India"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "11.2588",
        "longitude": "75.7804"
      },
      "telephone": CONTACT_INFO.phones.main,
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Air Conditioning",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Parking Plaza",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Dining Banquet",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Bridal Suite",
          "value": true
        }
      ],
      "maximumAttendeeCapacity": 1000
    };
  } else if (type === 'article') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": image,
      "url": url
    };
  } else {
    // Default to WebSite schema
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Dream Avenue Event Hall",
      "description": description,
      "url": url
    };
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Dream Avenue Event Hall" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical link */}
      <link rel="canonical" href={url} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
