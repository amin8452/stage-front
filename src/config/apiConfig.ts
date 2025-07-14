/**
 * Configuration centralisée pour les APIs - VERSION SÉCURISÉE NEXT.JS
 * Les clés sensibles sont maintenant côté serveur uniquement
 */

export interface CompanyInfo {
  name: string;
  fullName: string;
  website: string;
  domain: string;
  email: string;
  supportEmail: string;
  logo: string;
  description: string;
  tagline: string;
  address: string;
  phone: string;
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface ApiConfig {
  internal: {
    baseUrl: string;
    apiKey: string;
  };
  email: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  company: CompanyInfo;
}

/**
 * Validation des variables d'environnement côté client
 */
function validateClientEnvironmentVariables(): void {
  const requiredVars = [
    'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
    'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
    'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = typeof window !== 'undefined'
      ? process.env[varName]
      : process.env[varName];
    return !value;
  });

  if (missingVars.length > 0) {
    console.warn(
      `Variables d'environnement publiques manquantes: ${missingVars.join(', ')}\n` +
      'Certaines fonctionnalités peuvent être limitées'
    );
  }
}

/**
 * Récupération sécurisée de la configuration API côté client
 */
export function getApiConfig(): ApiConfig {
  try {
    validateClientEnvironmentVariables();

    // Configuration pour les appels internes (vers nos API routes)
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
      internal: {
        baseUrl: `${baseUrl}/api`,
        apiKey: process.env.API_SECRET_KEY || 'development-key' // Côté serveur uniquement
      },
      email: {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      },
      company: {
        name: 'MS360',
        fullName: 'MS360 - Solutions Digitales',
        website: 'https://ms360.fr',
        domain: 'ms360.fr',
        email: 'contact@ms360.fr',
        supportEmail: 'support@ms360.fr',
        logo: '/logo-ms360.png',
        description: 'MS360 propose des solutions digitales innovantes pour accompagner votre transformation numérique et optimiser votre performance.',
        tagline: 'Votre partenaire digital de confiance',
        address: 'France',
        phone: '+33 (0)1 XX XX XX XX',
        social: {
          linkedin: 'https://linkedin.com/company/ms360',
          twitter: 'https://twitter.com/ms360',
          facebook: 'https://facebook.com/ms360'
        }
      }
    };
  } catch (error) {
    console.error('Erreur de configuration API:', error);
    throw error;
  }
}

/**
 * Vérification de la validité de la clé API
 */
export function validateApiKey(apiKey: string): boolean {
  // Validation basique du format de la clé OpenRouter
  const openRouterKeyPattern = /^sk-or-v1-[a-f0-9]{64}$/;
  return openRouterKeyPattern.test(apiKey);
}

/**
 * Masquage de la clé API pour les logs (sécurité)
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length < 10) return '***';
  return apiKey.substring(0, 8) + '***' + apiKey.substring(apiKey.length - 4);
}
