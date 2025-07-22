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

  // API publique - pas de validation de clé requise pour l'accès public
  // if (!validateInternalApiKey(req)) {
  //   return res.status(401).json({
  //     success: false,
  //     error: 'Non autorisé'
  //   });
  // }

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

    // Validation du contenu IA
    if (!aiContent || aiContent.trim().length === 0) {
      throw new Error('Contenu IA manquant ou vide');
    }

    // Génération du PDF avec gestion d'erreur améliorée
    const pdfResult = await PdfGenerator.generateModernPdf(aiContent, formData);

    if (!pdfResult || !pdfResult.pdfBlob) {
      throw new Error('Échec de génération du PDF - Blob manquant');
    }

    // Vérification de la taille du PDF
    if (pdfResult.pdfBlob.size === 0) {
      throw new Error('PDF généré est vide');
    }

    // Génération du nom de fichier sécurisé
    const safeName = formData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20);
    const filename = `Portrait-Predictif-${safeName}-${Date.now()}.pdf`;

    return res.status(200).json({
      success: true,
      downloadUrl: pdfResult.downloadUrl,
      filename: filename,
      message: `⚡ ${formData.name}, votre Portrait Prédictif a été généré avec succès ! Rapport personnalisé pour ${formData.sector} disponible.`
    });

  } catch (error) {

    // Gestion d'erreurs spécifiques
    let errorMessage = 'Erreur lors de la génération du PDF';

    if (error instanceof Error) {
      if (error.message.includes('jsPDF')) {
        errorMessage = 'Erreur de génération PDF - Problème avec jsPDF';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout lors de la génération PDF - Veuillez réessayer';
      } else if (error.message.includes('memory')) {
        errorMessage = 'Mémoire insuffisante pour générer le PDF';
      } else {
        errorMessage = error.message;
      }
    }

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

// Configuration optimisée pour Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
    responseLimit: '10mb',
  },
  maxDuration: 45, // 45 secondes max pour la génération PDF
};
