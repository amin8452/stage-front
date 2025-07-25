/**
 * Configuration de la société MS360
 * Centralise toutes les informations de l'entreprise
 */

export interface CompanyInfo {
  name: string;
  fullName: string;
  website: string;
  domain: string;
  email: string;
  supportEmail: string;
  logo: string;
  favicon: string;
  description: string;
  tagline: string;
  address: string;
  phone: string;
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    logoAlt: string;
  };
  legal: {
    siret?: string;
    tva?: string;
    rcs?: string;
  };
}

/**
 * Configuration MS360
 */
export const MS360_CONFIG: CompanyInfo = {
  name: 'MS360',
  fullName: 'MS360 - Solutions Digitales',
  website: 'https://ms360.fr',
  domain: 'ms360.fr',
  email: 'contact@ms360.fr',
  supportEmail: 'support@ms360.fr',
  logo: '/ms360.png',
  favicon: '/favicon.ico',
  description: 'MS360 propose des solutions digitales innovantes pour accompagner votre transformation numérique et optimiser votre performance.',
  tagline: 'Votre partenaire digital de confiance',
  address: 'France',
  phone: '+33 2 30 90 98 12',
  social: {
    linkedin: 'https://linkedin.com/company/ms360',
    twitter: 'https://twitter.com/ms360',
    facebook: 'https://facebook.com/ms360',
    instagram: 'https://instagram.com/ms360'
  },
  branding: {
    primaryColor: '#1e40af', // Bleu MS360
    secondaryColor: '#0ea5e9', // Cyan
    accentColor: '#22c55e', // Vert
    logoUrl: '/logo-ms360.svg',
    logoAlt: 'Logo MS360'
  },
  legal: {
    siret: 'XXX XXX XXX XXXXX',
    tva: 'FR XX XXX XXX XXX',
    rcs: 'XXX XXX XXX RCS Paris'
  }
};

/**
 * Récupère la configuration de la société
 */
export function getCompanyConfig(): CompanyInfo {
  return MS360_CONFIG;
}

/**
 * Génère l'URL complète d'un email
 */
export function getCompanyEmailUrl(type: 'contact' | 'support' = 'contact'): string {
  const config = getCompanyConfig();
  const email = type === 'support' ? config.supportEmail : config.email;
  return `mailto:${email}`;
}

/**
 * Génère le titre complet avec le nom de la société
 */
export function getPageTitle(pageTitle?: string): string {
  const config = getCompanyConfig();
  return pageTitle ? `${pageTitle} | ${config.name}` : config.fullName;
}

/**
 * Génère la description meta avec les informations de la société
 */
export function getMetaDescription(customDescription?: string): string {
  const config = getCompanyConfig();
  return customDescription || config.description;
}

/**
 * Récupère les informations de branding
 */
export function getBrandingConfig() {
  return getCompanyConfig().branding;
}

/**
 * Récupère les liens sociaux
 */
export function getSocialLinks() {
  return getCompanyConfig().social;
}
