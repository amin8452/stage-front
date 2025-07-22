import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminService } from '../../../src/services/AdminService';

interface InitResponse {
  success: boolean;
  message?: string;
  admin?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InitResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    // Vérifier si c'est un environnement de développement ou si une clé spéciale est fournie
    const initKey = req.headers['x-init-key'] || req.body.initKey;
    const expectedKey = process.env.ADMIN_INIT_KEY || 'init-admin-ms360';
    
    if (initKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Clé d\'initialisation invalide'
      });
    }

    // Initialiser le premier administrateur
    const admin = await AdminService.initializeFirstAdmin();
    
    if (!admin) {
      return res.status(400).json({
        success: false,
        error: 'Un administrateur existe déjà ou erreur lors de la création'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Premier administrateur créé avec succès',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
