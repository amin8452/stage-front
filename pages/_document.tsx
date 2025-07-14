import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="MS360 - Portrait Prédictif IA | Solutions Digitales" />
        <meta name="keywords" content="MS360, IA, portrait prédictif, intelligence artificielle, solutions digitales, transformation numérique" />
        <meta name="author" content="MS360" />
        <meta name="creator" content="MS360" />
        <meta name="publisher" content="MS360" />

        {/* MS360 Branding */}
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="apple-mobile-web-app-title" content="MS360" />
        <meta name="application-name" content="MS360" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Sécurité */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Préchargement des polices si nécessaire */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* MS360 Contact Info */}
        <meta name="contact:email" content="contact@ms360.fr" />
        <meta name="contact:phone" content="+33 (0)1 XX XX XX XX" />
        <meta name="geo.region" content="FR" />
        <meta name="geo.country" content="France" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
