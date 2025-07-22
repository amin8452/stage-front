import prisma, { CreatePdfData, PdfWithUser } from '../lib/prisma';
import { Pdf, PdfStatus } from '@prisma/client';

export class PdfService {
  /**
   * Créer un nouveau PDF
   */
  static async createPdf(data: CreatePdfData): Promise<Pdf> {
    try {
      return await prisma.pdf.create({
        data: {
          filename: data.filename,
          originalName: data.originalName,
          fileSize: data.fileSize,
          content: data.content,
          downloadUrl: data.downloadUrl,
          userId: data.userId,
          metadata: data.metadata,
          status: 'GENERATED'
        }
      });
    } catch (error) {
      throw new Error('Impossible de créer le PDF');
    }
  }

  /**
   * Récupérer un PDF par ID avec les informations utilisateur
   */
  static async getPdfWithUser(pdfId: string): Promise<PdfWithUser | null> {
    try {
      return await prisma.pdf.findUnique({
        where: { id: pdfId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Lister tous les PDFs avec pagination
   */
  static async getAllPdfs(page: number = 1, limit: number = 10): Promise<{
    pdfs: PdfWithUser[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [pdfs, total] = await Promise.all([
        prisma.pdf.findMany({
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.pdf.count()
      ]);

      return {
        pdfs,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Impossible de récupérer les PDFs');
    }
  }

  /**
   * Récupérer les PDFs d'un utilisateur
   */
  static async getPdfsByUser(userId: string): Promise<Pdf[]> {
    try {
      return await prisma.pdf.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      return [];
    }
  }

  /**
   * Mettre à jour le statut d'un PDF
   */
  static async updatePdfStatus(pdfId: string, status: PdfStatus): Promise<Pdf | null> {
    try {
      return await prisma.pdf.update({
        where: { id: pdfId },
        data: { status, updatedAt: new Date() }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Supprimer un PDF
   */
  static async deletePdf(pdfId: string): Promise<boolean> {
    try {
      await prisma.pdf.delete({
        where: { id: pdfId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Rechercher des PDFs
   */
  static async searchPdfs(query: string, page: number = 1, limit: number = 10): Promise<{
    pdfs: PdfWithUser[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause = {
        OR: [
          { filename: { contains: query, mode: 'insensitive' as const } },
          { originalName: { contains: query, mode: 'insensitive' as const } },
          { user: { 
            OR: [
              { name: { contains: query, mode: 'insensitive' as const } },
              { email: { contains: query, mode: 'insensitive' as const } }
            ]
          }}
        ]
      };

      const [pdfs, total] = await Promise.all([
        prisma.pdf.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.pdf.count({ where: whereClause })
      ]);

      return {
        pdfs,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Impossible de rechercher les PDFs');
    }
  }

  /**
   * Obtenir les statistiques des PDFs
   */
  static async getPdfStats(): Promise<{
    totalPdfs: number;
    newPdfsThisMonth: number;
    pdfsByStatus: { status: string; count: number }[];
    totalFileSize: number;
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalPdfs, newPdfsThisMonth, statusStats, fileSizeSum] = await Promise.all([
        prisma.pdf.count(),
        prisma.pdf.count({
          where: {
            createdAt: {
              gte: startOfMonth
            }
          }
        }),
        prisma.pdf.groupBy({
          by: ['status'],
          _count: {
            status: true
          },
          orderBy: {
            _count: {
              status: 'desc'
            }
          }
        }),
        prisma.pdf.aggregate({
          _sum: {
            fileSize: true
          }
        })
      ]);

      const pdfsByStatus = statusStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      }));

      return {
        totalPdfs,
        newPdfsThisMonth,
        pdfsByStatus,
        totalFileSize: fileSizeSum._sum.fileSize || 0
      };
    } catch (error) {
      throw new Error('Impossible de récupérer les statistiques PDF');
    }
  }

  /**
   * Nettoyer les anciens PDFs (plus de 30 jours)
   */
  static async cleanupOldPdfs(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await prisma.pdf.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          },
          status: 'GENERATED'
        }
      });

      return result.count;
    } catch (error) {
      return 0;
    }
  }
}
