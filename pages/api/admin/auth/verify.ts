import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AdminService } from '../../../../src/services/AdminService';

interface VerifyResponse {
  success: boolean;
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
  res: NextApiResponse<VerifyResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token manquant'
      });
    }

    // Vérification du token JWT
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Récupération des informations admin
    const admin = await AdminService.getAdminById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide ou compte désactivé'
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
}
