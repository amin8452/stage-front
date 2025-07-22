import prisma, { CreateAdminData } from '../lib/prisma';
import { Admin, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class AdminService {
  /**
   * Créer un nouvel administrateur
   */
  static async createAdmin(data: CreateAdminData): Promise<Admin> {
    try {
      // Vérifier si l'admin existe déjà
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingAdmin) {
        throw new Error('Un administrateur avec ce nom d\'utilisateur ou email existe déjà');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(data.password, 12);

      return await prisma.admin.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'ADMIN'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authentifier un administrateur
   */
  static async authenticateAdmin(username: string, password: string): Promise<Admin | null> {
    try {
      const admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username },
            { email: username }
          ],
          isActive: true
        }
      });

      if (!admin) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return null;
      }

      // Mettre à jour la dernière connexion
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() }
      });

      return admin;
    } catch (error) {
      return null;
    }
  }

  /**
   * Récupérer un administrateur par ID
   */
  static async getAdminById(adminId: string): Promise<Admin | null> {
    try {
      return await prisma.admin.findUnique({
        where: { id: adminId }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Lister tous les administrateurs
   */
  static async getAllAdmins(): Promise<Admin[]> {
    try {
      return await prisma.admin.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      return [];
    }
  }

  /**
   * Mettre à jour un administrateur
   */
  static async updateAdmin(adminId: string, data: Partial<CreateAdminData>): Promise<Admin | null> {
    try {
      const updateData: any = {
        username: data.username,
        email: data.email,
        role: data.role,
        updatedAt: new Date()
      };

      // Hasher le nouveau mot de passe si fourni
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 12);
      }

      return await prisma.admin.update({
        where: { id: adminId },
        data: updateData
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Désactiver un administrateur
   */
  static async deactivateAdmin(adminId: string): Promise<boolean> {
    try {
      await prisma.admin.update({
        where: { id: adminId },
        data: { isActive: false }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Supprimer un administrateur
   */
  static async deleteAdmin(adminId: string): Promise<boolean> {
    try {
      await prisma.admin.delete({
        where: { id: adminId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialiser le premier administrateur
   */
  static async initializeFirstAdmin(): Promise<Admin | null> {
    try {
      // Vérifier s'il y a déjà des administrateurs
      const adminCount = await prisma.admin.count();
      if (adminCount > 0) {
        return null; // Il y a déjà des administrateurs
      }

      // Créer le premier administrateur avec les variables d'environnement
      const adminData: CreateAdminData = {
        username: process.env.ADMIN_USERNAME ,
        email: process.env.ADMIN_EMAIL ,
        password: process.env.ADMIN_PASSWORD ,
        role: 'SUPER_ADMIN'
      };

      return await this.createAdmin(adminData);
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifier les permissions d'un administrateur
   */
  static hasPermission(admin: Admin, requiredRole: AdminRole): boolean {
    const roleHierarchy: Record<AdminRole, number> = {
      'VIEWER': 1,
      'ADMIN': 2,
      'SUPER_ADMIN': 3
    };

    return roleHierarchy[admin.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Changer le mot de passe d'un administrateur
   */
  static async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const admin = await prisma.admin.findUnique({
        where: { id: adminId }
      });

      if (!admin) {
        return false;
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return false;
      }

      // Hasher et sauvegarder le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await prisma.admin.update({
        where: { id: adminId },
        data: { password: hashedNewPassword }
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
