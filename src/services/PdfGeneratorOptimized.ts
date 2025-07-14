import jsPDF from 'jspdf';
import { getApiConfig } from '../config/apiConfig';
import { getCompanyConfig } from '../config/companyConfig';

interface FormData {
  name: string;
  email: string;
  sector: string;
  position: string;
  ambitions: string;
}

interface PdfGenerationResult {
  pdfBlob: Blob;
  downloadUrl: string;
  filename: string;
}

interface PdfGenerationResponse {
  success: boolean;
  pdfUrl?: string;
  downloadUrl?: string;
  pdfContent?: string;
  pdfBlob?: Blob;
  filename?: string;
  message?: string;
  error?: string;
}

/**
 * Générateur PDF Optimisé - Version Production
 * Toutes les fonctionnalités sans debug pour l'hébergement
 */
export class PdfGenerator {
  
  /**
   * Génère un PDF PROPRE et COMPLET
   */
  static async generateModernPdf(aiContent: string, formData: FormData): Promise<PdfGenerationResult> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // 1. PAGE DE COUVERTURE
    this.addCoverPage(pdf, formData, pageWidth, pageHeight);

    // 2. SOMMAIRE
    pdf.addPage();
    this.addTableOfContents(pdf, pageWidth, pageHeight, margin);

    // 3. CONTENU COMPLET
    pdf.addPage();
    this.addCompleteContent(pdf, aiContent, pageWidth, pageHeight, margin);

    // 4. CONCLUSION
    pdf.addPage();
    this.addConclusion(pdf, formData, pageWidth, pageHeight, margin);

    // 5. PIEDS DE PAGE
    this.addFooters(pdf, formData, pageWidth, pageHeight);

    const pdfBlob = pdf.output('blob');
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const filename = `Portrait-Predictif-${this.cleanName(formData.name)}-${Date.now()}.pdf`;

    return { pdfBlob, downloadUrl, filename };
  }

  /**
   * Page de couverture moderne
   */
  private static addCoverPage(pdf: jsPDF, formData: FormData, pageWidth: number, pageHeight: number): void {
    const centerX = pageWidth / 2;
    const companyConfig = getCompanyConfig();

    // Fond dégradé simulé avec les couleurs MS360
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Logo MS360 (si disponible)
    // TODO: Ajouter le logo MS360 ici quand il sera disponible

    // Titre principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PORTRAIT PRÉDICTIF IA', centerX, 80, { align: 'center' });

    // Sous-titre
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Analyse Personnalisée & Prédictions 2025-2027', centerX, 100, { align: 'center' });

    // Nom du client
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94);
    pdf.text(formData.name.toUpperCase(), centerX, 140, { align: 'center' });

    // Informations client
    pdf.setFontSize(12);
    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${formData.position} • ${formData.sector}`, centerX, 160, { align: 'center' });

    // Date
    pdf.setFontSize(10);
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, centerX, 250, { align: 'center' });

    // Footer avec informations MS360
    pdf.setFontSize(8);
    pdf.text(`© ${new Date().getFullYear()} ${companyConfig.name} - ${companyConfig.tagline}`, centerX, 270, { align: 'center' });
    pdf.text(`${companyConfig.website} • ${companyConfig.email}`, centerX, 280, { align: 'center' });
  }

  /**
   * Sommaire professionnel
   */
  private static addTableOfContents(pdf: jsPDF, pageWidth: number, pageHeight: number, margin: number): void {
    let currentY = margin + 30;

    // Titre
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SOMMAIRE', pageWidth / 2, currentY, { align: 'center' });
    currentY += 40;

    const sections = [
      { title: '1. RÉSUMÉ EXÉCUTIF', page: 3 },
      { title: '2. ANALYSE PROFIL ACTUEL', page: 4 },
      { title: '3. PRÉDICTIONS 2025-2027', page: 5 },
      { title: '4. RECOMMANDATIONS STRATÉGIQUES', page: 6 },
      { title: '5. OPPORTUNITÉS DE CROISSANCE', page: 7 },
      { title: '6. PLAN D\'ACTION CONCRET', page: 8 },
      { title: '7. CONCLUSION ET PROCHAINES ÉTAPES', page: 9 }
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    sections.forEach((section, index) => {
      const y = currentY + (index * 20);
      
      // Numéro et titre
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.title, margin, y);
      
      // Points de liaison
      const dots = '.'.repeat(Math.floor((pageWidth - margin * 2 - 100) / 2));
      pdf.setFont('helvetica', 'normal');
      pdf.text(dots, margin + 120, y);
      
      // Numéro de page
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.page.toString(), pageWidth - margin - 10, y, { align: 'right' });
    });
  }

  /**
   * Affiche TOUT le contenu IA de manière PROPRE et COMPLÈTE - VERSION AMÉLIORÉE
   */
  private static addCompleteContent(pdf: jsPDF, aiContent: string, pageWidth: number, pageHeight: number, margin: number): void {
    let currentY = margin + 20;
    const maxY = pageHeight - 50;
    const contentWidth = pageWidth - (margin * 2);

    if (!aiContent || aiContent.trim().length === 0) {
      pdf.setTextColor(255, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ERREUR: Contenu IA non disponible', margin, currentY);
      return;
    }

    // Nettoyage du contenu
    const cleanContent = aiContent
      .replace(/\*\*/g, '')
      .replace(/`{1,3}/g, '')
      .trim();

    // Essayer d'abord de parser en sections
    const sections = this.parseContentSimple(cleanContent);

    // Vérifier si le parsing a bien fonctionné
    const totalSectionContent = sections.map(s => s.content).join(' ').length;
    const originalContentLength = cleanContent.length;

    // Si on a perdu plus de 30% du contenu, afficher le contenu brut
    if (totalSectionContent < originalContentLength * 0.7) {
      this.addRawContent(pdf, cleanContent, pageWidth, pageHeight, margin, currentY);
      return;
    }

    // Affichage de chaque section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Vérification espace pour nouvelle section
      if (currentY > maxY - 60) {
        pdf.addPage();
        currentY = margin + 20;
      }

      // Titre de section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');

      const titleLines = pdf.splitTextToSize(`${i + 1}. ${section.title}`, contentWidth);
      for (const line of titleLines) {
        if (currentY > maxY - 20) {
          pdf.addPage();
          currentY = margin + 20;
        }
        pdf.text(line, margin, currentY);
        currentY += 10;
      }

      currentY += 10;

      // Contenu de la section - AFFICHAGE GARANTI
      if (section.content && section.content.trim()) {
        currentY = this.addSectionContent(pdf, section.content, margin, currentY, maxY, contentWidth);
      }

      currentY += 15;
    }
  }

  /**
   * Affiche le contenu brut sans parsing (fallback)
   */
  private static addRawContent(pdf: jsPDF, content: string, pageWidth: number, pageHeight: number, margin: number, startY: number): void {
    let currentY = startY;
    const maxY = pageHeight - 50;
    const contentWidth = pageWidth - (margin * 2);

    // Titre
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONTENU COMPLET', margin, currentY);
    currentY += 30;

    // Contenu
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const paragraphs = this.smartParagraphSplit(content);

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;

      const lines = pdf.splitTextToSize(paragraph, contentWidth);

      for (const line of lines) {
        if (currentY > maxY - 10) {
          pdf.addPage();
          currentY = margin + 20;
        }

        pdf.text(line, margin, currentY);
        currentY += 7;
      }

      currentY += 10; // Espacement entre paragraphes
    }
  }

  /**
   * Affiche le contenu d'une section de manière garantie
   */
  private static addSectionContent(pdf: jsPDF, content: string, margin: number, startY: number, maxY: number, contentWidth: number): number {
    let currentY = startY;

    const paragraphs = this.smartParagraphSplit(content);

    for (let p = 0; p < paragraphs.length; p++) {
      const paragraph = paragraphs[p].trim();
      if (!paragraph) continue;

      // Vérification espace
      const estimatedHeight = Math.ceil(paragraph.length / 80) * 7 + 10;
      if (currentY + estimatedHeight > maxY) {
        pdf.addPage();
        currentY = margin + 20;
      }

      // Affichage du paragraphe
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const lines = pdf.splitTextToSize(paragraph, contentWidth);

      for (let l = 0; l < lines.length; l++) {
        const line = lines[l];

        if (currentY > maxY - 10) {
          pdf.addPage();
          currentY = margin + 20;
        }

        pdf.text(line, margin, currentY);
        currentY += 7;
      }

      currentY += 8; // Espacement entre paragraphes
    }

    return currentY;
  }

  /**
   * Parse le contenu en sections structurées
   */
  private static parseContentSimple(content: string): Array<{ title: string; content: string }> {
    const expectedSections = [
      'RÉSUMÉ EXÉCUTIF',
      'ANALYSE PROFIL ACTUEL',
      'PRÉDICTIONS 2025-2027',
      'RECOMMANDATIONS STRATÉGIQUES',
      'OPPORTUNITÉS DE CROISSANCE',
      'PLAN D\'ACTION CONCRET',
      'CONCLUSION ET PROCHAINES ÉTAPES'
    ];

    // Détection par ##
    let parts = content.split(/(?=^##\s+)/m);

    if (parts.length <= 1) {
      // Détection par titres en majuscules
      parts = content.split(/(?=^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ\s]{15,}$)/m);
    }

    if (parts.length <= 1) {
      return this.createForcedStructure(content, expectedSections);
    }

    const detectedSections: Array<{ title: string; content: string }> = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      const lines = part.split('\n');
      const firstLine = lines[0].trim();
      let title = '';
      let content = '';

      if (firstLine.startsWith('##')) {
        title = firstLine.replace(/^#{2}\s*/, '').trim();
        content = lines.slice(1).join('\n').trim();
      } else if (firstLine.length > 10 && firstLine === firstLine.toUpperCase()) {
        title = firstLine.trim();
        content = lines.slice(1).join('\n').trim();
      } else if (i === 0) {
        title = 'RÉSUMÉ EXÉCUTIF';
        content = part;
      } else {
        title = `SECTION ${detectedSections.length + 1}`;
        content = part;
      }

      if (title && content) {
        detectedSections.push({
          title: this.normalizeSectionTitle(title),
          content: content.trim()
        });
      }
    }

    return this.mapToExpectedStructure(detectedSections, expectedSections);
  }

  /**
   * Normalise le titre de section
   */
  private static normalizeSectionTitle(title: string): string {
    const normalized = title
      .replace(/^#{1,6}\s*/, '')
      .replace(/^\d+\.\s*/, '')
      .trim()
      .toUpperCase();

    const mappings: { [key: string]: string } = {
      'RESUME EXECUTIF': 'RÉSUMÉ EXÉCUTIF',
      'RÉSUMÉ EXECUTIF': 'RÉSUMÉ EXÉCUTIF',
      'EXECUTIVE SUMMARY': 'RÉSUMÉ EXÉCUTIF',
      'PROFIL ACTUEL': 'ANALYSE PROFIL ACTUEL',
      'ANALYSE PROFIL': 'ANALYSE PROFIL ACTUEL',
      'PREDICTIONS': 'PRÉDICTIONS 2025-2027',
      'PRÉDICTIONS': 'PRÉDICTIONS 2025-2027',
      'RECOMMANDATIONS': 'RECOMMANDATIONS STRATÉGIQUES',
      'OPPORTUNITES': 'OPPORTUNITÉS DE CROISSANCE',
      'OPPORTUNITÉS': 'OPPORTUNITÉS DE CROISSANCE',
      'PLAN ACTION': 'PLAN D\'ACTION CONCRET',
      'PLAN D\'ACTION': 'PLAN D\'ACTION CONCRET',
      'CONCLUSION': 'CONCLUSION ET PROCHAINES ÉTAPES'
    };

    return mappings[normalized] || normalized;
  }

  /**
   * Mappe vers la structure attendue
   */
  private static mapToExpectedStructure(
    detectedSections: Array<{ title: string; content: string }>,
    expectedSections: string[]
  ): Array<{ title: string; content: string }> {
    const mappedSections: Array<{ title: string; content: string }> = [];

    for (const expectedTitle of expectedSections) {
      let assignedContent = '';
      let found = false;

      // Recherche exacte
      for (const detected of detectedSections) {
        if (detected.title === expectedTitle) {
          assignedContent = detected.content;
          found = true;
          break;
        }
      }

      // Recherche par mots-clés
      if (!found && detectedSections.length > 0) {
        const keywords = expectedTitle.toLowerCase().split(' ');
        for (const detected of detectedSections) {
          const detectedLower = detected.title.toLowerCase();
          if (keywords.some(keyword => detectedLower.includes(keyword))) {
            assignedContent = detected.content;
            found = true;
            break;
          }
        }
      }

      // Contenu par défaut
      if (!found) {
        assignedContent = `Contenu de la section "${expectedTitle}" en cours de génération par l'IA.`;
      }

      mappedSections.push({
        title: expectedTitle,
        content: assignedContent
      });
    }

    return mappedSections;
  }

  /**
   * Crée une structure forcée
   */
  private static createForcedStructure(
    content: string,
    expectedSections: string[]
  ): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    const contentLength = content.length;
    const sectionLength = Math.ceil(contentLength / expectedSections.length);

    for (let i = 0; i < expectedSections.length; i++) {
      const start = i * sectionLength;
      const end = Math.min(start + sectionLength, contentLength);
      const sectionContent = content.substring(start, end).trim();

      sections.push({
        title: expectedSections[i],
        content: sectionContent || `Contenu de la section "${expectedSections[i]}" à développer.`
      });
    }

    return sections;
  }

  /**
   * Division intelligente en paragraphes - VERSION CORRIGÉE
   */
  private static smartParagraphSplit(content: string): string[] {
    if (!content || content.trim().length === 0) {
      return [];
    }

    // Nettoyage initial du contenu
    const cleanContent = content
      .replace(/\*\*/g, '') // Supprime les **
      .replace(/`{1,3}/g, '') // Supprime les backticks
      .trim();

    // 1. Essayer division par double saut de ligne
    let paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 0);

    // 2. Si pas assez de divisions, essayer par saut de ligne simple
    if (paragraphs.length <= 2 && cleanContent.length > 200) {
      paragraphs = cleanContent.split('\n').filter(p => p.trim().length > 10);
    }

    // 3. Si toujours pas assez, division par phrases longues
    if (paragraphs.length <= 1 && cleanContent.length > 300) {
      paragraphs = cleanContent.split(/(?<=[.!?])\s+(?=[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ])/)
        .filter(p => p.trim().length > 20);
    }

    // 4. Dernier recours : division par longueur fixe
    if (paragraphs.length <= 1 && cleanContent.length > 500) {
      const chunkSize = 400;
      paragraphs = [];
      for (let i = 0; i < cleanContent.length; i += chunkSize) {
        const chunk = cleanContent.substring(i, i + chunkSize);
        if (chunk.trim()) {
          paragraphs.push(chunk.trim());
        }
      }
    }

    // Nettoyage final - SANS regroupement complexe qui peut perdre du contenu
    const finalParagraphs = paragraphs
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // Si aucun paragraphe n'a été créé, retourner le contenu complet
    if (finalParagraphs.length === 0) {
      return [cleanContent];
    }

    return finalParagraphs;
  }

  /**
   * Conclusion
   */
  private static addConclusion(pdf: jsPDF, formData: FormData, pageWidth: number, pageHeight: number, margin: number): void {
    let currentY = margin + 20;
    const companyConfig = getCompanyConfig();

    // Titre
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONCLUSION ET PROCHAINES ÉTAPES', pageWidth / 2, currentY, { align: 'center' });
    currentY += 40;

    // Contenu de conclusion
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const conclusionText = `Cher(e) ${formData.name},

Ce rapport d'analyse prédictive personnalisé vous offre une vision claire de votre potentiel professionnel et des opportunités qui s'offrent à vous dans le secteur ${formData.sector}.

Les recommandations stratégiques présentées dans ce document sont basées sur une analyse approfondie de votre profil actuel et des tendances du marché pour la période 2025-2027.

PROCHAINES ÉTAPES RECOMMANDÉES :

1. Révision et intégration des recommandations stratégiques
2. Mise en place du plan d'action proposé
3. Suivi régulier des indicateurs de performance
4. Adaptation continue selon l'évolution du marché

Nous vous souhaitons plein succès dans la réalisation de vos ambitions professionnelles.

Pour toute question ou accompagnement personnalisé, n'hésitez pas à nous contacter :
📧 ${companyConfig.email}
🌐 ${companyConfig.website}
📞 ${companyConfig.phone}

Cordialement,
L'équipe ${companyConfig.name}
${companyConfig.tagline}`;

    const lines = pdf.splitTextToSize(conclusionText, pageWidth - (margin * 2));

    lines.forEach((line: string) => {
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = margin + 20;
      }
      pdf.text(line, margin, currentY);
      currentY += 7;
    });
  }

  /**
   * Ajoute les pieds de page
   */
  private static addFooters(pdf: jsPDF, formData: FormData, pageWidth: number, pageHeight: number): void {
    const totalPages = pdf.getNumberOfPages();
    const companyConfig = getCompanyConfig();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Ligne de séparation
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

      // Texte du pied de page
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');

      // Gauche: nom du rapport avec société
      pdf.text(`${companyConfig.name} - Portrait Prédictif IA - ${formData.name}`, 20, pageHeight - 15);

      // Centre: date
      pdf.text(new Date().toLocaleDateString('fr-FR'), pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Droite: numéro de page
      pdf.text(`Page ${i}/${totalPages}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
    }
  }

  /**
   * Nettoie le nom pour le fichier
   */
  private static cleanName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
  }

  /**
   * Génère le contenu IA via l'API route sécurisée
   */
  private static async generateAIContent(formData: FormData): Promise<string> {
    try {
      const config = getApiConfig();

      // Use the public API key for client-side requests
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'public-dev-key';

      const response = await fetch(`${config.internal.baseUrl}/ai/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.content) {
        throw new Error(data.error || 'Contenu IA non généré');
      }

      return data.content;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Méthode principale de génération sécurisée
   */
  static async generateSecurePdf(formData: FormData): Promise<PdfGenerationResponse> {
    try {
      // Étape 1: Génération du contenu IA
      const aiContent = await this.generateAIContent(formData);

      // Étape 2: Génération du PDF
      const pdfResult = await this.generateModernPdf(aiContent, formData);

      // Étape 3: Création du contenu texte pour l'affichage
      const pdfContent = this.createPdfContent(aiContent, formData);

      return {
        success: true,
        downloadUrl: pdfResult.downloadUrl,
        pdfBlob: pdfResult.pdfBlob,
        filename: pdfResult.filename,
        pdfContent: pdfContent,
        message: `✅ ${formData.name}, votre Portrait Prédictif a été généré de manière sécurisée !`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération sécurisée'
      };
    }
  }

  /**
   * Crée le contenu texte du PDF pour l'affichage
   */
  private static createPdfContent(aiContent: string, formData: FormData): string {
    const companyConfig = getCompanyConfig();

    return `PORTRAIT PRÉDICTIF IA - ${formData.name.toUpperCase()}
═══════════════════════════════════════════════════════════════
Généré par ${companyConfig.name} • ${new Date().toLocaleDateString('fr-FR')}

PROFIL CLIENT:
👤 Nom: ${formData.name}
📧 Email: ${formData.email}
🏢 Secteur: ${formData.sector}
💼 Poste: ${formData.position}
🎯 Vision: ${formData.ambitions}

STRUCTURE DU RAPPORT:
📊 1. RÉSUMÉ EXÉCUTIF
👤 2. ANALYSE PROFIL ACTUEL
🔮 3. PRÉDICTIONS 2025-2027
🎯 4. RECOMMANDATIONS STRATÉGIQUES
📈 5. OPPORTUNITÉS CROISSANCE
🚀 6. PLAN D'ACTION
✅7. CONCLUSION

CONTENU DÉTAILLÉ:
${aiContent}

🔒 SÉCURITÉ: Ce rapport a été généré via des API routes sécurisées.
Les clés API sensibles ne sont jamais exposées côté client.

CONTACT:
📧 ${companyConfig.email}
🌐 ${companyConfig.website}
📞 ${companyConfig.phone}

© ${new Date().getFullYear()} ${companyConfig.name} - ${companyConfig.tagline}`;
  }

  /**
   * Génère un PDF de fallback simple
   */
  static async generateFallbackPdf(content: string, userName: string): Promise<PdfGenerationResult> {
    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(content, 180);
    let cursorY = 20;

    lines.forEach((line: string) => {
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, 15, cursorY);
      cursorY += 7;
    });

    const pdfBlob = doc.output('blob');
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const filename = `Portrait-Predictif-${this.cleanName(userName)}-${Date.now()}.pdf`;

    return { pdfBlob, downloadUrl, filename };
  }
}
