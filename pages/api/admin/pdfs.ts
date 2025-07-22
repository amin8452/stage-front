import type { NextApiRequest, NextApiResponse } from 'next';
import { PdfService } from '../../../src/services/PdfService';
import { verifyAdminToken } from '../../../src/utils/adminAuth';

interface PdfsResponse {
  success: boolean;
  data?: {
    pdfs: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PdfsResponse>
) {
  try {
    // Vérification de l'authentification admin
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    if (req.method === 'GET') {
      // Récupération des paramètres de pagination et recherche
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let result;
      if (search) {
        result = await PdfService.searchPdfs(search, page, limit);
      } else {
        result = await PdfService.getAllPdfs(page, limit);
      }

      return res.status(200).json({
        success: true,
        data: {
          pdfs: result.pdfs,
          total: result.total,
          totalPages: result.totalPages,
          currentPage: page
        }
      });
    }

    if (req.method === 'DELETE') {
      const pdfId = req.query.id as string;
      
      if (!pdfId) {
        return res.status(400).json({
          success: false,
          error: 'ID PDF requis'
        });
      }

      const deleted = await PdfService.deletePdf(pdfId);
      
      if (deleted) {
        return res.status(200).json({
          success: true
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'PDF non trouvé'
        });
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });

  } catch (error) {
    console.error('Erreur dans l\'API pdfs:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
