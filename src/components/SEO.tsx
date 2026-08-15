import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'app';
  ogImage?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_BASE_URL = 'https://reclaimr.app';
const DEFAULT_TITLE = 'ReclaimR — Stop the Rot. Start the Growth. | Subscription Decay & Wealth Diversion Agent';
const DEFAULT_DESCRIPTION =
  "ReclaimR detects unused debit mandates and forgotten subscriptions on-device, terminates them with 1 tap, and diverts wasted monthly cash into high-yield Nifty 50 SIPs. Zero cloud upload.";
const DEFAULT_OG_IMAGE = `${DEFAULT_BASE_URL}/favicon.svg`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalPath,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  structuredData,
}) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | ReclaimR` : DEFAULT_TITLE;
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${DEFAULT_BASE_URL}${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper function to update or create a meta tag
    const updateMetaTag = (selector: string, keyName: string, keyValue: string, contentValue: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(keyName, keyValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper function to update or create a link tag
    const updateLinkTag = (relValue: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${relValue}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relValue);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    // 2. Meta Tags
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (keywords && keywords.length > 0) {
      updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }

    // 3. Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ReclaimR');

    // 4. Twitter / X Cards
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 5. Canonical Link
    updateLinkTag('canonical', canonicalUrl);

    // 6. JSON-LD Structured Data
    const scriptId = 'reclaimr-json-ld';
    let scriptElem = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptElem) {
        scriptElem = document.createElement('script');
        scriptElem.id = scriptId;
        scriptElem.type = 'application/ld+json';
        document.head.appendChild(scriptElem);
      }
      scriptElem.textContent = JSON.stringify(structuredData);
    } else if (scriptElem) {
      scriptElem.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogType, ogImage, noindex, structuredData]);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};
