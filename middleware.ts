import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérification des API routes sécurisées
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Exclure les routes publiques si nécessaire
    const publicRoutes = ['/api/health', '/api/status'];
    
    if (!publicRoutes.includes(request.nextUrl.pathname)) {
      // Vérification de la clé API pour les routes protégées
      const authHeader = request.headers.get('authorization');
      const serverKey = process.env.API_SECRET_KEY;
      const publicKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!authHeader) {
        return NextResponse.json(
          { success: false, error: 'Non autorisé - En-tête manquant' },
          { status: 401 }
        );
      }

      const apiKey = authHeader.replace('Bearer ', '');

      // Accepter soit la clé serveur soit la clé publique
      if (apiKey !== serverKey && apiKey !== publicKey) {
        return NextResponse.json(
          { success: false, error: 'Non autorisé - Clé invalide' },
          { status: 401 }
        );
      }
    }
  }

  // Headers de sécurité pour toutes les réponses
  const response = NextResponse.next();

  // Headers de sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSP (Content Security Policy) - ajustez selon vos besoins
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Ajustez selon vos besoins
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.emailjs.com https://openrouter.ai",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
