import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  method: string;
  message: string;
  body?: any;
  headers?: any;
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

  // Log pour debug
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  // Accepter POST uniquement
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      method: req.method || 'UNKNOWN',
      message: `Méthode ${req.method} non autorisée. POST requis.`,
      headers: req.headers,
      body: req.body
    });
  }

  // Simuler la logique PDF
  return res.status(200).json({
    success: true,
    method: req.method,
    message: 'Test PDF API - POST accepté avec succès',
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    }
  });
}
