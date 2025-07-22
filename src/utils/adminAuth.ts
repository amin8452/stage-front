import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { AdminService } from '../services/AdminService';
import { Admin, AdminRole } from '@prisma/client';

interface AdminTokenPayload {
  adminId: string;
  username: string;
  role: AdminRole;
}

/**
 * Vérifier le token d'authentification admin
 */
export async function verifyAdminToken(req: NextApiRequest): Promise<Admin | null> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    // Vérification du token JWT
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as AdminTokenPayload;

    // Récupération des informations admin
    const admin = await AdminService.getAdminById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  } catch (error) {
    return null;
  }
}

/**
 * Vérifier les permissions d'un admin
 */
export function hasPermission(admin: Admin, requiredRole: AdminRole): boolean {
  return AdminService.hasPermission(admin, requiredRole);
}

/**
 * Middleware pour vérifier l'authentification admin
 */
export function requireAdmin(requiredRole: AdminRole = 'ADMIN') {
  return async (req: NextApiRequest, res: any, next: () => void) => {
    const admin = await verifyAdminToken(req);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    if (!hasPermission(admin, requiredRole)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes'
      });
    }

    // Ajouter l'admin à la requête
    (req as any).admin = admin;
    next();
  };
}

/**
 * Générer un token JWT pour un admin
 */
export function generateAdminToken(admin: Admin): string {
  const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  
  return jwt.sign(
    {
      adminId: admin.id,
      username: admin.username,
      role: admin.role
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

/**
 * Extraire les informations admin du token sans vérification complète
 */
export function decodeAdminToken(token: string): AdminTokenPayload | null {
  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    return jwt.verify(token, jwtSecret) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}
