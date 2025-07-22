/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuration des images
  images: {
    domains: ['localhost', 'vercel.app', 'stage-front-main.vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },

  // Optimisations pour Vercel
  serverExternalPackages: ['jspdf'],

  // Optimisations de build
  compress: true,

  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://stage-front-main.vercel.app',
  },
};

export default nextConfig;
