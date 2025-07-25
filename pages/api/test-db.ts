import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  message: string;
  error?: string;
  dbStatus?: string;
  envCheck?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Vérifier les variables d'environnement
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Définie' : 'Manquante',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Définie' : 'Manquante',
      NODE_ENV: process.env.NODE_ENV || 'Non définie'
    };

    // Tenter d'importer Prisma
    let dbStatus = 'Non testée';
    try {
      const { prisma } = await import('../../src/lib/prisma');
      
      // Test simple de connexion
      await prisma.$connect();
      dbStatus = 'Connexion réussie';
      
      // Test de requête simple
      const userCount = await prisma.user.count();
      dbStatus = `Connexion OK - ${userCount} utilisateurs`;
      
      await prisma.$disconnect();
    } catch (dbError) {
      dbStatus = `Erreur DB: ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Test de diagnostic réussi',
      dbStatus,
      envCheck
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du diagnostic',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
