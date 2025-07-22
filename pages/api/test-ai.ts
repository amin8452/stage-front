import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  message?: string;
  config?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-distill-llama-70b';

    // Test simple avec un prompt minimal
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Test - MS360'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Dis simplement "Test réussi" en français.'
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      })
    });

    const data = await response.json();

    return res.status(200).json({
      success: response.ok,
      message: response.ok ? data.choices?.[0]?.message?.content : 'Erreur API',
      config: {
        hasApiKey: !!openRouterApiKey,
        baseUrl,
        model,
        status: response.status
      },
      error: !response.ok ? JSON.stringify(data) : undefined
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      config: {
        hasApiKey: !!process.env.OPENROUTER_API_KEY,
        baseUrl: process.env.OPENROUTER_BASE_URL,
        model: process.env.OPENROUTER_MODEL
      }
    });
  }
}
