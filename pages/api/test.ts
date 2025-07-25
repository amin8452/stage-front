import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  method: string;
  message: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accepter toutes les méthodes pour le test
  return res.status(200).json({
    success: true,
    method: req.method || 'UNKNOWN',
    message: `API de test fonctionnelle - Méthode: ${req.method}`,
    timestamp: new Date().toISOString()
  });
}
