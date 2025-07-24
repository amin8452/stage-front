import { getCompanyConfig } from '../config/companyConfig';


interface EmailData {
  to: string;
  subject: string;
  content: string;
  senderName?: string;
  attachment?: {
    name: string;
    data: string; // Base64 encoded data
    type: string; // MIME type
  };
}

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber?: string;
  sector?: string;
  position?: string;
  ambitions?: string;
  timestamp?: string;
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

      // Choisir la méthode d'envoi selon la présence de pièce jointe
      if (emailData.attachment) {
        return await this.tryEmailJSWithAttachment(emailData);
      } else {
        return await this.tryEmailJS(emailData);
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }

  /**
   * Envoi via EmailJS avec pièce jointe (utilise template avec base64 intégré)
   */
  private static async tryEmailJSWithAttachment(emailData: EmailData): Promise<EmailResponse> {
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_PDF_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        return { success: false, error: 'EmailJS non configuré' };
      }

      const companyConfig = getCompanyConfig();

      const templateParams: any = {
        to_email: emailData.to,
        to_name: emailData.senderName || 'Client',
        subject: emailData.subject,
        message: emailData.content,
        from_name: companyConfig.name,
        reply_to: companyConfig.email,
        company_name: companyConfig.name,
        company_website: companyConfig.website
      };

      // Ajouter les informations de pièce jointe pour le template
      if (emailData.attachment) {
        templateParams.attachment_name = emailData.attachment.name;
        templateParams.attachment_type = emailData.attachment.type;
        templateParams.attachment_size = Math.round(emailData.attachment.data.length * 0.75 / 1024); // Taille approximative en KB
        templateParams.has_attachment = 'true';

        // Pour les petits PDF (< 1MB), inclure le base64 dans le template
        if (emailData.attachment.data.length < 1000000) {
          templateParams.attachment_data = emailData.attachment.data;
        } else {
          templateParams.attachment_data = 'PDF trop volumineux pour être joint';
        }
      } else {
        templateParams.has_attachment = 'false';
      }

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
        // Si l'API avec pièce jointe échoue, essayer sans pièce jointe
        console.warn('Échec envoi avec pièce jointe, tentative sans pièce jointe...');
        return await this.tryEmailJS(emailData);
      }

      const result = await response.text();

      return {
        success: true,
        messageId: result || `emailjs_${Date.now()}`
      };

    } catch (error) {
      console.warn('Erreur envoi avec pièce jointe:', error);
      // Fallback: essayer sans pièce jointe
      return await this.tryEmailJS(emailData);
    }
  }

  /**
   * Envoi via EmailJS avec configuration sécurisée Next.js (sans pièce jointe)
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

      const templateParams: any = {
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
   * Envoie un email avec un PDF (avec lien de téléchargement intégré)
   */
  static async sendEmailWithPdf(
    email: string,
    name: string,
    pdfBlob: Blob,
    filename: string,
    userInfo?: UserInfo
  ): Promise<EmailResponse> {
    try {
      const companyConfig = getCompanyConfig();

      // Créer un lien de téléchargement temporaire pour le PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = `${window.location.origin}#pdf-download`;

      const emailData: EmailData = {
        to: email,
        subject: `🚀 Votre Portrait Prédictif IA - ${name} | ${companyConfig.name}`,
        content: this.generatePdfEmailContentWithLink(name, filename, downloadLink),
        senderName: name
      };

      // Essayer d'abord avec pièce jointe
      const pdfBase64 = await this.blobToBase64(pdfBlob);
      emailData.attachment = {
        name: filename,
        data: pdfBase64,
        type: 'application/pdf'
      };

      // Envoyer l'email
      const result = await this.sendEmail(emailData);

      // Envoyer aussi une notification à la société (sans PDF pour éviter la surcharge)
      if (result.success) {
        const companyEmailData: EmailData = {
          to: 'amineabdelkafi839@gmail.com',
          subject: `🔔 Nouveau Portrait IA généré avec PDF - ${name}`,
          content: this.generateCompanyNotificationContent(name, email, userInfo),
          senderName: 'Système MS360'
        };

        // Envoi en arrière-plan avec logging des erreurs
        this.sendEmail(companyEmailData).catch((error) => {
          console.error('❌ Erreur envoi notification société:', error);
          // Essayer un envoi de fallback simplifié
          this.sendSimpleCompanyNotification(name, email).catch(() => {
            console.error('❌ Échec total notification société');
          });
        });
      }

      return result;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email avec PDF'
      };
    }
  }

  /**
   * Envoie un email de bienvenue à l'utilisateur ET une notification à la société
   */
  static async sendWelcomeEmail(email: string, name: string, userInfo?: UserInfo): Promise<EmailResponse> {
    try {
      const companyConfig = getCompanyConfig();

      // Email à l'utilisateur
      const userEmailData: EmailData = {
        to: email,
        subject: `🚀 Votre Portrait Prédictif IA est prêt - ${name} | ${companyConfig.name}`,
        content: this.generateWelcomeContent(name),
        senderName: name
      };

      // Email de notification à la société
      const companyEmailData: EmailData = {
        to: 'amineabdelkafi839@gmail.com',
        subject: `🔔 Nouveau Portrait IA généré - ${name}`,
        content: this.generateCompanyNotificationContent(name, email, userInfo),
        senderName: 'Système MS360'
      };

      // Envoi des deux emails en parallèle
      const [userResult, companyResult] = await Promise.allSettled([
        this.sendEmail(userEmailData),
        this.sendEmail(companyEmailData)
      ]);

      // Retourner le résultat de l'email utilisateur (prioritaire)
      const userResponse = userResult.status === 'fulfilled' ? userResult.value : { success: false, error: 'Échec envoi utilisateur' };

      return userResponse;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi des emails'
      };
    }
  }

  /**
   * Convertit un Blob en base64
   */
  private static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Retirer le préfixe "data:application/pdf;base64," si présent
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Génère le contenu d'email pour l'envoi avec PDF et lien
   */
  private static generatePdfEmailContentWithLink(name: string, filename: string, downloadLink: string): string {
    const companyConfig = getCompanyConfig();

    return `🎉 Félicitations ${name} !

Votre Portrait Prédictif IA a été généré avec succès !

📎 VOTRE RAPPORT PDF : ${filename}
Votre rapport personnalisé est joint à cet email. Si vous ne voyez pas la pièce jointe, vous pouvez également le télécharger depuis notre plateforme.

📊 VOTRE RAPPORT CONTIENT :
• Analyse personnalisée de votre profil professionnel
• Recommandations stratégiques adaptées à votre secteur
• Vision prospective sur 3 ans
• Plan d'action concret et réalisable

🚀 PROCHAINES ÉTAPES :
1. Téléchargez et consultez votre rapport PDF ci-joint
2. Identifiez les opportunités prioritaires
3. Mettez en œuvre les recommandations
4. Suivez votre progression

💼 BESOIN D'ACCOMPAGNEMENT ?
Notre équipe d'experts reste à votre disposition pour vous accompagner dans la mise en œuvre de votre stratégie.

📞 CONTACT :
Email : ${companyConfig.email}
Téléphone : ${companyConfig.phone}
Site web : ${companyConfig.website}

---
${companyConfig.tagline}`;
  }

  /**
   * Génère le contenu d'email pour l'envoi avec PDF
   */
  private static generatePdfEmailContent(name: string): string {
    const companyConfig = getCompanyConfig();

    return `🎉 Félicitations ${name} !

Votre Portrait Prédictif IA a été généré avec succès et vous trouverez votre rapport personnalisé en pièce jointe de cet email.

📊 VOTRE RAPPORT PDF CONTIENT :
• Analyse personnalisée de votre profil professionnel
• Recommandations stratégiques adaptées à votre secteur
• Vision prospective sur 3 ans
• Plan d'action concret et réalisable

🚀 PROCHAINES ÉTAPES :
1. Téléchargez et consultez votre rapport PDF ci-joint
2. Identifiez les opportunités prioritaires
3. Mettez en œuvre les recommandations
4. Suivez votre progression

💼 BESOIN D'ACCOMPAGNEMENT ?
Notre équipe d'experts reste à votre disposition pour vous accompagner dans la mise en œuvre de votre stratégie.

📞 CONTACT :
Email : ${companyConfig.email}
Téléphone : ${companyConfig.phone}
Site web : ${companyConfig.website}

---
${companyConfig.tagline}`;
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
   * Génère le contenu de notification pour la société
   */
  private static generateCompanyNotificationContent(name: string, email: string, userInfo?: UserInfo): string {
    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `🔔 NOUVELLE UTILISATION DU SERVICE PORTRAIT IA

    📅 Date et heure : ${timestamp}

    👤 INFORMATIONS CLIENT :
    • Nom complet : ${name}
    • Email professionnel : ${email}
    • Numéro de téléphone : ${userInfo?.phoneNumber || 'Non renseigné'}
    • Secteur d'activité : ${userInfo?.sector || 'Non renseigné'}
    • Poste actuel : ${userInfo?.position || 'Non renseigné'}

    💼 VISION STRATÉGIQUE :
    • Ambitions à 3 ans : ${userInfo?.ambitions || 'Non renseignées'}

    📊 STATUT :
    • Portrait IA généré avec succès
    • Email de confirmation envoyé au client
    • PDF disponible pour téléchargement

    ---
    Notification automatique du système MS360
    Pour toute question, contactez l'équipe technique.`;
  }



  /**
   * Envoi simplifié de notification à la société (fallback)
   */
  private static async sendSimpleCompanyNotification(userName: string, userEmail: string): Promise<EmailResponse> {
    try {
      const simpleEmailData: EmailData = {
        to: 'amineabdelkafi839@gmail.com',
        subject: `🔔 Nouveau client - ${userName}`,
        content: `Nouveau Portrait IA généré pour:\n\nNom: ${userName}\nEmail: ${userEmail}\nDate: ${new Date().toLocaleString('fr-FR')}\n\n--\nSystème MS360`,
        senderName: 'MS360 System'
      };

      return await this.sendEmail(simpleEmailData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur notification simple'
      };
    }
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
