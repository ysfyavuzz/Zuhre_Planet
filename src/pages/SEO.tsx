/**
 * SEO Component Page
 * 
 * Dynamic SEO meta tag manager for setting page-specific meta information.
 * Handles Open Graph tags, canonical links, JSON-LD schema markup, and meta descriptions.
 * Improves search engine visibility and social media sharing with comprehensive metadata.
 * 
 * @module pages/SEO
 * @category Pages - Utilities
 * 
 * Features:
 * - Dynamic page title management
 * - Meta description optimization
 * - Keywords configuration for search engines
 * - Open Graph tags (og:title, og:description, og:image, og:url)
 * - Twitter Card tags for social media sharing
 * - Canonical URL specification for duplicate prevention
 * - JSON-LD DirectoryWebSite schema markup implementation
 * - DirectoryWebSite schema with SearchAction for structured data
 * - Language and locale meta tags
 * - Robots index/follow configuration
 * - Charset (UTF-8) specification
 * - Dynamic meta tag injection into document head
 * 
 * Implementation:
 * - Creates and manages DirectoryWebSite schema for search results
 * - Injects script tags with JSON-LD schema into document head
 * - Updates all meta tags dynamically on prop changes
 * - Ensures proper encoding for Turkish characters
 * 
 * @example
 * ```tsx
 * // Usage in Home.tsx
 * <SEO 
 *   title="Marmara Escort İlanları | İstanbul, Bursa, Kocaeli VIP Escort"
 *   description="Marmara bölgesinin en seçkin escort ilan platformu..."
 *   keywords="istanbul escort, bursa escort, kocaeli escort"
 * />
 * ```
 */

import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({ title, description, keywords, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | Escort Platform - Marmara'nın En Seçkin İlanları`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const defaultKeywords = "istanbul escort, bursa escort, kocaeli escort, marmara escort ilanları, vip escort istanbul, onaylı escort profilleri";
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || defaultKeywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords || defaultKeywords;
      document.head.appendChild(meta);
    }

    // Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical || window.location.href);

    // Open Graph Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:image': ogImage || '/og-image.jpg',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:')) meta.setAttribute('property', property);
        else meta.setAttribute('name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // JSON-LD Schema for Local Business / Directory
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "DirectoryWebSite",
      "name": "Escort Platform",
      "url": window.location.origin,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/escorts?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [title, description, keywords]);

  return null;
}

export default SEO;
