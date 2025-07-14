import type { NextApiRequest, NextApiResponse } from 'next';

interface FormData {
  name: string;
  email: string;
  sector: string;
  position: string;
  ambitions: string;
}

interface PdfGenerationRequest {
  formData: FormData;
  aiContent: string;
}

interface ApiResponse {
  success: boolean;
  pdfUrl?: string;
  downloadUrl?: string;
  filename?: string;
  message?: string;
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

// Validation des données
function validateRequest(data: any): data is PdfGenerationRequest {
  return (
    data &&
    data.formData &&
    typeof data.formData.name === 'string' &&
    typeof data.formData.email === 'string' &&
    typeof data.formData.sector === 'string' &&
    typeof data.formData.position === 'string' &&
    typeof data.formData.ambitions === 'string' &&
    typeof data.aiContent === 'string' &&
    data.aiContent.length > 0
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

  // Validation de la clé API interne
  if (!validateInternalApiKey(req)) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé'
    });
  }

  // Validation des données
  if (!validateRequest(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides'
    });
  }

  const { formData, aiContent }: PdfGenerationRequest = req.body;

  try {
    // Import dynamique pour éviter les problèmes SSR
    const { PdfGenerator } = await import('../../../src/services/PdfGeneratorOptimized');

    // Génération du PDF
    const pdfResult = await PdfGenerator.generateModernPdf(aiContent, formData);

    // Génération du nom de fichier
    const filename = `Portrait-Predictif-${formData.name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;

    return res.status(200).json({
      success: true,
      downloadUrl: pdfResult.downloadUrl,
      filename: filename,
      message: `⚡ ${formData.name}, votre Portrait Prédictif a été généré avec succès ! Rapport personnalisé pour ${formData.sector} disponible.`
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la génération du PDF'
    });
  }
}

// Configuration pour permettre les gros payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
