import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AdminService } from '../../../../src/services/AdminService';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  admin?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    const { username, password }: LoginRequest = req.body;

    // Validation des données
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    // Authentification
    const admin = await AdminService.authenticateAdmin(username, password);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Compte désactivé'
      });
    }

    // Génération du token JWT
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        role: admin.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
