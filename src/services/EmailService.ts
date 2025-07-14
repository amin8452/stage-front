import { getCompanyConfig } from '../config/companyConfig';

interface EmailData {
  to: string;
  subject: string;
  content: string;
  senderName?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Service d'email simple avec EmailJS
 */
export class EmailService {

  /**
   * Envoie un email simple
   */
  static async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // Validation des données
      if (!emailData.to || !this.validateEmail(emailData.to)) {
        throw new Error('Adresse email invalide');
      }

      if (!emailData.subject || !emailData.content) {
        throw new Error('Sujet et contenu requis');
      }

      // Envoi via EmailJS
      return await this.tryEmailJS(emailData);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }

  /**
   * Envoi via EmailJS avec configuration sécurisée Next.js
   */
  private static async tryEmailJS(emailData: EmailData): Promise<EmailResponse> {
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        return { success: false, error: 'EmailJS non configuré' };
      }

      const companyConfig = getCompanyConfig();

      const templateParams = {
        to_email: emailData.to,
        to_name: emailData.senderName || 'Client',
        subject: emailData.subject,
        message: emailData.content,
        from_name: companyConfig.name,
        reply_to: companyConfig.email,
        company_name: companyConfig.name,
        company_website: companyConfig.website
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const result = await response.text();

      return {
        success: true,
        messageId: result || `emailjs_${Date.now()}`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur EmailJS'
      };
    }
  }

  /**
   * Envoie un email de bienvenue simple
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<EmailResponse> {
    const companyConfig = getCompanyConfig();

    const emailData: EmailData = {
      to: email,
      subject: `🚀 Votre Portrait Prédictif IA est prêt - ${name} | ${companyConfig.name}`,
      content: this.generateWelcomeContent(name),
      senderName: name
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Génère le contenu de l'email de bienvenue
   */
  private static generateWelcomeContent(name: string): string {
    const companyConfig = getCompanyConfig();

    return `Bonjour ${name},

Félicitations ! Votre Portrait Prédictif IA personnalisé a été généré avec succès par ${companyConfig.name}.

Ce rapport contient :
• Une analyse approfondie de votre profil professionnel
• Des prédictions IA pour les 3 prochaines années (2025-2027)
• Des recommandations stratégiques personnalisées
• Un plan d'action concret et actionnable
• Des opportunités de croissance spécifiques à votre secteur

Pour télécharger votre rapport PDF, retournez sur notre site web et cliquez sur le bouton "Télécharger le PDF".

Nous vous souhaitons beaucoup de succès dans la réalisation de vos ambitions professionnelles !

Pour toute question, n'hésitez pas à nous contacter à ${companyConfig.email}

Cordialement,
L'équipe ${companyConfig.name}
${companyConfig.website}

---
${companyConfig.tagline}`;
  }



  /**
   * Valide une adresse email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Nettoie et formate une adresse email
   */
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

}
