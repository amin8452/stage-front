import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../src/services/UserService';
import { verifyAdminToken } from '../../../src/utils/adminAuth';

interface UsersResponse {
  success: boolean;
  data?: {
    users: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>
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
        result = await UserService.searchUsers(search, page, limit);
      } else {
        result = await UserService.getAllUsers(page, limit);
      }

      return res.status(200).json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
          totalPages: result.totalPages,
          currentPage: page
        }
      });
    }

    if (req.method === 'DELETE') {
      const userId = req.query.id as string;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur requis'
        });
      }

      const deleted = await UserService.deleteUser(userId);
      
      if (deleted) {
        return res.status(200).json({
          success: true
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });

  } catch (error) {
    console.error('Erreur dans l\'API users:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
