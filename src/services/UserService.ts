import prisma from '../lib/prisma';
import { User } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  phoneNumber?: string;
  sector?: string;
  position?: string;
  ambitions?: string;
}

export interface UserWithPdfs extends User {
  pdfs: {
    id: string;
    filename: string;
    status: string;
    createdAt: Date;
  }[];
}

export class UserService {
  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(data: CreateUserData): Promise<User> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        // Mettre à jour les informations si l'utilisateur existe
        return await prisma.user.update({
          where: { email: data.email },
          data: {
            name: data.name,
            phoneNumber: data.phoneNumber,
            sector: data.sector,
            position: data.position,
            ambitions: data.ambitions,
            updatedAt: new Date()
          }
        });
      }

      // Créer un nouvel utilisateur
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          sector: data.sector,
          position: data.position,
          ambitions: data.ambitions
        }
      });
    } catch (error) {
      throw new Error('Impossible de créer l\'utilisateur');
    }
  }

  /**
   * Récupérer un utilisateur par email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Récupérer un utilisateur par ID avec ses PDFs
   */
  static async getUserWithPdfs(userId: string): Promise<UserWithPdfs | null> {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          pdfs: {
            select: {
              id: true,
              filename: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Lister tous les utilisateurs avec pagination
   */
  static async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: UserWithPdfs[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          include: {
            pdfs: {
              select: {
                id: true,
                filename: true,
                status: true,
                createdAt: true
              },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count()
      ]);

      return {
        users,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Impossible de récupérer les utilisateurs');
    }
  }

  /**
   * Supprimer un utilisateur et ses PDFs associés
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id: userId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Rechercher des utilisateurs
   */
  static async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    users: UserWithPdfs[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause = {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
          { sector: { contains: query, mode: 'insensitive' as const } },
          { position: { contains: query, mode: 'insensitive' as const } }
        ]
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            pdfs: {
              select: {
                id: true,
                filename: true,
                status: true,
                createdAt: true
              },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where: whereClause })
      ]);

      return {
        users,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Impossible de rechercher les utilisateurs');
    }
  }

  /**
   * Obtenir les statistiques des utilisateurs
   */
  static async getUserStats(): Promise<{
    totalUsers: number;
    newUsersThisMonth: number;
    topSectors: { sector: string; count: number }[];
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalUsers, newUsersThisMonth, sectorStats] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: startOfMonth
            }
          }
        }),
        prisma.user.groupBy({
          by: ['sector'],
          _count: {
            sector: true
          },
          where: {
            sector: {
              not: null
            }
          },
          orderBy: {
            _count: {
              sector: 'desc'
            }
          },
          take: 5
        })
      ]);

      const topSectors = sectorStats.map(stat => ({
        sector: stat.sector || 'Non spécifié',
        count: stat._count.sector
      }));

      return {
        totalUsers,
        newUsersThisMonth,
        topSectors
      };
    } catch (error) {
      throw new Error('Impossible de récupérer les statistiques');
    }
  }
}
