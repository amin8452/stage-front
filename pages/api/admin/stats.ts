import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../src/services/UserService';
import { PdfService } from '../../../src/services/PdfService';
import { verifyAdminToken } from '../../../src/utils/adminAuth';

interface StatsResponse {
  success: boolean;
  stats?: {
    users: {
      totalUsers: number;
      newUsersThisMonth: number;
      topSectors: { sector: string; count: number }[];
    };
    pdfs: {
      totalPdfs: number;
      newPdfsThisMonth: number;
      pdfsByStatus: { status: string; count: number }[];
      totalFileSize: number;
    };
    overview: {
      totalGenerations: number;
      averagePdfsPerUser: string;
      mostActiveDay: string;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    // Vérification de l'authentification admin
    const admin = await verifyAdminToken(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    // Récupération des statistiques
    const [userStats, pdfStats] = await Promise.all([
      UserService.getUserStats(),
      PdfService.getPdfStats()
    ]);

    // Calculs additionnels
    const averagePdfsPerUser = userStats.totalUsers > 0
      ? (Math.round((pdfStats.totalPdfs / userStats.totalUsers) * 100) / 100).toString()
      : '0';

    const overview = {
      totalGenerations: pdfStats.totalPdfs,
      averagePdfsPerUser,
      mostActiveDay: 'Aujourd\'hui' // Placeholder - peut être calculé avec plus de données
    };

    return res.status(200).json({
      success: true,
      stats: {
        users: userStats,
        pdfs: pdfStats,
        overview
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
