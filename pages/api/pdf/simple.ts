import type { NextApiRequest, NextApiResponse } from 'next';

interface SimpleResponse {
  success: boolean;
  message: string;
  method: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimpleResponse>
) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accepter POST uniquement
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      method: req.method || 'UNKNOWN',
      message: `Méthode ${req.method} non autorisée`,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse simple pour POST
  return res.status(200).json({
    success: true,
    method: req.method,
    message: 'API PDF simple - POST fonctionne !',
    timestamp: new Date().toISOString()
  });
}
