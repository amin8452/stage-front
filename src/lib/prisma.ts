import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

// Types utilitaires pour TypeScript
export type { User, Pdf, Admin, PdfStatus, AdminRole } from '@prisma/client';

// Types pour les formulaires et API
export interface CreateUserData {
  name: string;
  email: string;
  sector?: string;
  position?: string;
  ambitions?: string;
}

export interface CreatePdfData {
  filename: string;
  originalName?: string;
  fileSize?: number;
  content?: string;
  downloadUrl?: string;
  userId: string;
  metadata?: any;
}

export interface CreateAdminData {
  username: string;
  email: string;
  password: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
}

// Types pour les réponses API
export interface UserWithPdfs {
  id: string;
  name: string;
  email: string;
  sector?: string;
  position?: string;
  ambitions?: string;
  createdAt: Date;
  updatedAt: Date;
  pdfs: {
    id: string;
    filename: string;
    status: string;
    createdAt: Date;
  }[];
}

export interface PdfWithUser {
  id: string;
  filename: string;
  originalName?: string;
  fileSize?: number;
  content?: string;
  downloadUrl?: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
