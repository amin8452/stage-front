import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  message: string;
  method: string;
  timestamp: string;
  body?: any;
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

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      method: req.method || 'UNKNOWN',
      message: `Méthode ${req.method} non autorisée`,
      timestamp: new Date().toISOString()
    });
  }

  // Test POST simple sans base de données
  return res.status(200).json({
    success: true,
    method: req.method,
    message: 'API PDF test simple - POST fonctionne sans DB !',
    timestamp: new Date().toISOString(),
    body: req.body
  });
}
