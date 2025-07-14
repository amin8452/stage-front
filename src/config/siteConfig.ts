import { getCompanyConfig } from './companyConfig';

/**
 * Configuration du site avec les informations MS360
 */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  author: string;
  creator: string;
  publisher: string;
  robots: string;
  language: string;
  locale: string;
  themeColor: string;
}

/**
 * Configuration du site MS360
 */
export function getSiteConfig(): SiteConfig {
  const companyConfig = getCompanyConfig();
  
  return {
    name: `${companyConfig.name} - Portrait Prédictif IA`,
    title: `${companyConfig.name} - Portrait Prédictif IA | Solutions Digitales`,
    description: `${companyConfig.description} Découvrez notre outil de Portrait Prédictif IA pour analyser votre profil professionnel et obtenir des prédictions personnalisées pour 2025-2027.`,
    url: companyConfig.website,
    ogImage: `${companyConfig.website}/og-image-ms360.jpg`,
    keywords: [
      'MS360',
      'intelligence artificielle',
      'portrait prédictif',
      'analyse professionnelle',
      'prédictions IA',
      'solutions digitales',
      'transformation numérique',
      'carrière professionnelle',
      'recommandations stratégiques',
      'France'
    ],
    author: companyConfig.name,
    creator: companyConfig.name,
    publisher: companyConfig.name,
    robots: 'index, follow',
    language: 'fr',
    locale: 'fr_FR',
    themeColor: companyConfig.branding.primaryColor
  };
}

/**
 * Génère les métadonnées pour une page spécifique
 */
export function generatePageMetadata(pageTitle?: string, pageDescription?: string) {
  const siteConfig = getSiteConfig();
  const companyConfig = getCompanyConfig();
  
  return {
    title: pageTitle ? `${pageTitle} | ${companyConfig.name}` : siteConfig.title,
    description: pageDescription || siteConfig.description,
    keywords: siteConfig.keywords.join(', '),
    author: siteConfig.author,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    robots: siteConfig.robots,
    language: siteConfig.language,
    'og:title': pageTitle ? `${pageTitle} | ${companyConfig.name}` : siteConfig.title,
    'og:description': pageDescription || siteConfig.description,
    'og:url': siteConfig.url,
    'og:image': siteConfig.ogImage,
    'og:type': 'website',
    'og:locale': siteConfig.locale,
    'og:site_name': companyConfig.name,
    'twitter:card': 'summary_large_image',
    'twitter:title': pageTitle ? `${pageTitle} | ${companyConfig.name}` : siteConfig.title,
    'twitter:description': pageDescription || siteConfig.description,
    'twitter:image': siteConfig.ogImage,
    'theme-color': siteConfig.themeColor,
    'msapplication-TileColor': siteConfig.themeColor,
    'apple-mobile-web-app-title': companyConfig.name,
    'application-name': companyConfig.name
  };
}

/**
 * Génère le JSON-LD pour le SEO structuré
 */
export function generateStructuredData() {
  const companyConfig = getCompanyConfig();
  const siteConfig = getSiteConfig();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyConfig.name,
    description: companyConfig.description,
    url: companyConfig.website,
    logo: `${companyConfig.website}${companyConfig.logo}`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyConfig.phone,
      contactType: 'customer service',
      email: companyConfig.email,
      availableLanguage: 'French'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: companyConfig.address
    },
    sameAs: Object.values(companyConfig.social).filter(Boolean),
    founder: {
      '@type': 'Organization',
      name: companyConfig.name
    },
    foundingDate: '2024',
    knowsAbout: [
      'Intelligence Artificielle',
      'Analyse Prédictive',
      'Solutions Digitales',
      'Transformation Numérique'
    ],
    serviceType: 'Digital Solutions',
    areaServed: 'France'
  };
}
