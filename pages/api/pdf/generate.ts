import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../src/services/UserService';
import { PdfService } from '../../../src/services/PdfService';

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
    // 1. Créer ou mettre à jour l'utilisateur dans la base de données
    const user = await UserService.createUser({
      name: formData.name,
      email: formData.email,
      sector: formData.sector,
      position: formData.position,
      ambitions: formData.ambitions
    });

    // 2. Import dynamique pour éviter les problèmes SSR
    const { PDFKitGenerator } = await import('../../../src/services/PDFKitGenerator');

    // Validation du contenu IA
    if (!aiContent || aiContent.trim().length === 0) {
      throw new Error('Contenu IA manquant ou vide');
    }

    // 3. Génération du PDF professionnel avec PDFKit
    const pdfResult = await PDFKitGenerator.generateProfessionalPdf(aiContent, formData);

    if (!pdfResult || !pdfResult.pdfBuffer) {
      throw new Error('Échec de génération du PDF - Buffer manquant');
    }

    // Vérification de la taille du PDF
    if (pdfResult.pdfBuffer.length === 0) {
      throw new Error('PDF généré est vide');
    }

    // 4. Utiliser le nom de fichier généré par PDFKit
    const filename = pdfResult.filename!;

    // 5. Convertir le PDF buffer en base64 pour le téléchargement
    const pdfBase64 = pdfResult.pdfBuffer!.toString('base64');
    const downloadUrl = `data:application/pdf;base64,${pdfBase64}`;

    // 6. Sauvegarder les informations du PDF dans la base de données
    const savedPdf = await PdfService.createPdf({
      filename: filename,
      originalName: `Portrait Prédictif - ${formData.name}`,
      fileSize: pdfResult.pdfBuffer!.length,
      content: aiContent,
      downloadUrl: downloadUrl,
      userId: user.id,
      metadata: {
        generatedAt: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        formData: formData
      }
    });

    return res.status(200).json({
      success: true,
      downloadUrl: downloadUrl,
      filename: filename,
      pdfId: savedPdf.id,
      userId: user.id,
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

    // En cas d'erreur, essayer quand même de sauvegarder l'utilisateur
    try {
      await UserService.createUser({
        name: formData.name,
        email: formData.email,
        sector: formData.sector,
        position: formData.position,
        ambitions: formData.ambitions
      });
    } catch (userError) {
      // Erreur silencieuse pour la sauvegarde utilisateur
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      message: `❌ Désolé ${formData.name}, une erreur est survenue lors de la génération de votre Portrait Prédictif. Veuillez réessayer.`
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
