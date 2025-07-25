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

  // Configuration API pour Vercel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Headers pour CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
