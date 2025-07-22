import type { NextApiRequest, NextApiResponse } from 'next';
import { PdfService } from '../../../../src/services/PdfService';
import { verifyAdminToken } from '../../../../src/utils/adminAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    // Vérification de l'authentification admin (token dans header ou query)
    let admin = await verifyAdminToken(req);

    // Si pas de token dans header, essayer dans query
    if (!admin && req.query.token) {
      req.headers.authorization = `Bearer ${req.query.token}`;
      admin = await verifyAdminToken(req);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    const { pdfId } = req.query;
    
    if (!pdfId || typeof pdfId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'ID PDF requis'
      });
    }

    // Récupérer le PDF
    const pdf = await PdfService.getPdfWithUser(pdfId);
    
    if (!pdf) {
      return res.status(404).json({
        success: false,
        error: 'PDF non trouvé'
      });
    }

    if (!pdf.downloadUrl) {
      return res.status(404).json({
        success: false,
        error: 'URL de téléchargement non disponible'
      });
    }

    // Extraire le base64 du data URL
    if (pdf.downloadUrl && pdf.downloadUrl.startsWith('data:application/pdf;base64,')) {
      const base64Data = pdf.downloadUrl.replace('data:application/pdf;base64,', '');
      const pdfBuffer = Buffer.from(base64Data, 'base64');

      // Définir les headers pour le téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('Cache-Control', 'no-cache');

      return res.end(pdfBuffer);
    } else if (pdf.downloadUrl) {
      // Si c'est une URL normale, rediriger
      return res.redirect(pdf.downloadUrl);
    } else {
      return res.status(404).json({
        success: false,
        error: 'URL de téléchargement non disponible'
      });
    }

  } catch (error) {
    console.error('Erreur lors du téléchargement PDF:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
