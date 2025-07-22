import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailService } from '../../src/services/EmailService';

interface TestEmailResponse {
  success: boolean;
  message?: string;
  userEmailResult?: any;
  companyEmailResult?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestEmailResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée'
    });
  }

  try {
    const { testType = 'welcome', userName = 'Test User', userEmail = 'test@example.com' } = req.body;

    console.log('🧪 Test email démarré:', { testType, userName, userEmail });

    if (testType === 'welcome') {
      // Test de l'email de bienvenue (qui inclut la notification société)
      const result = await EmailService.sendWelcomeEmail(userEmail, userName, {
        name: userName,
        email: userEmail,
        sector: 'Test Sector',
        position: 'Test Position',
        ambitions: 'Test Ambitions',
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        success: result.success,
        message: result.success ? 'Email de bienvenue envoyé avec succès' : 'Échec envoi email',
        userEmailResult: result,
        error: result.error
      });

    } else if (testType === 'company-only') {
      // Test direct de notification société via email simple
      const result = await EmailService.sendEmail({
        to: 'amineabdelkafi839@gmail.com',
        subject: `🧪 Test notification - ${userName}`,
        content: `Test de notification société pour:\n\nNom: ${userName}\nEmail: ${userEmail}\nDate: ${new Date().toLocaleString('fr-FR')}\n\n--\nTest MS360`,
        senderName: 'Test System'
      });

      return res.status(200).json({
        success: result.success,
        message: result.success ? 'Notification société envoyée' : 'Échec notification société',
        companyEmailResult: result,
        error: result.error
      });

    } else {
      return res.status(400).json({
        success: false,
        error: 'Type de test invalide. Utilisez "welcome" ou "company-only"'
      });
    }

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      message: 'Erreur lors du test d\'email'
    });
  }
}
