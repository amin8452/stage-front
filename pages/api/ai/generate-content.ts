import type { NextApiRequest, NextApiResponse } from 'next';
import { validateApiKey } from '../../../src/config/apiConfig';

interface FormData {
  name: string;
  email: string;
  sector: string;
  position: string;
  ambitions: string;
}

interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ApiResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// Validation de la clé API interne
function validateInternalApiKey(req: NextApiRequest): boolean {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const serverKey = process.env.API_SECRET_KEY || 'development-key';
  const publicKey = process.env.NEXT_PUBLIC_API_KEY || 'public-dev-key';

  // Accepter soit la clé serveur soit la clé publique
  if (!apiKey || (apiKey !== serverKey && apiKey !== publicKey)) {
    return false;
  }

  return true;
}

// Validation des données du formulaire
function validateFormData(data: any): data is FormData {
  return (
    data &&
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    typeof data.sector === 'string' &&
    typeof data.position === 'string' &&
    typeof data.ambitions === 'string' &&
    data.name.length > 0 &&
    data.email.includes('@') &&
    data.sector.length > 0 &&
    data.position.length > 0 &&
    data.ambitions.length > 0
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  // API publique - pas de validation de clé requise pour l'accès public
  // if (!validateInternalApiKey(req)) {
  //   return res.status(401).json({
  //     success: false,
  //     error: 'Non autorisé'
  //   });
  // }

  // Validation des données
  if (!validateFormData(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides'
    });
  }

  const formData: FormData = req.body;

  try {
    // Configuration sécurisée côté serveur
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free';

    if (!openRouterApiKey) {
      throw new Error('Clé API OpenRouter non configurée');
    }

    // Validation du format de la clé
    if (!validateApiKey(openRouterApiKey)) {
      // Format de clé API potentiellement invalide
    }

    // Construction du prompt optimisé
    const prompt = `Tu es un expert en analyse prédictive et conseil stratégique. Génère un rapport détaillé et personnalisé pour:

PROFIL CLIENT:
- Nom: ${formData.name}
- Secteur: ${formData.sector}
- Poste actuel: ${formData.position}
- Ambitions: ${formData.ambitions}

Crée un rapport structuré avec ces sections exactes:

1. RÉSUMÉ EXÉCUTIF
Synthèse en 3-4 phrases des points clés et du potentiel identifié.

2. ANALYSE PROFIL ACTUEL
Évaluation des forces, compétences et positionnement actuel dans ${formData.sector}.

3. PRÉDICTIONS 2025-2027
Tendances sectorielles, évolutions technologiques et opportunités spécifiques à ${formData.sector}.

4. RECOMMANDATIONS STRATÉGIQUES
Actions concrètes pour atteindre les ambitions: ${formData.ambitions}

5. OPPORTUNITÉS DE CROISSANCE
Niches émergentes, partenariats potentiels et axes de développement.

6. PLAN D'ACTION
Étapes prioritaires avec timeline sur 6-12-24 mois.

7. CONCLUSION
Vision inspirante et encourageante pour ${formData.name}.

Utilise un ton professionnel mais accessible, avec des données concrètes et des conseils actionnables. Minimum 800 mots.`;

    // Appel à l'API OpenRouter avec timeout optimisé
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://stage-front-main-amineabdelkafi839-4526s-projects.vercel.app',
        'X-Title': 'AI Portrait Pro - MS360'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse prédictive et conseil stratégique. Réponds en français avec un style professionnel et structuré.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6,
        top_p: 0.8,
        stream: false
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erreur inconnue');
      throw new Error(`Erreur API OpenRouter: ${response.status} - ${errorText}`);
    }

    const data: DeepseekResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Réponse API invalide');
    }

    const content = data.choices[0].message.content;

    // Validation du contenu généré
    if (!content || content.trim().length === 0) {
      throw new Error('L\'API IA a retourné un contenu vide. Veuillez réessayer.');
    }

    return res.status(200).json({
      success: true,
      content: content
    });

  } catch (error) {

    // Gestion spécifique des timeouts
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        error: 'Timeout: La génération IA a pris trop de temps. Veuillez réessayer.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    });
  }
}

// Configuration pour optimiser les performances Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
  maxDuration: 60, // 60 secondes max pour Vercel Pro
};
