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
   * Génère un PDF PROPRE et COMPLET avec gestion d'erreurs améliorée
   */
  static async generateModernPdf(aiContent: string, formData: FormData): Promise<PdfGenerationResult> {
    try {
      // Validation des données d'entrée
      if (!formData || !formData.name || !formData.email) {
        throw new Error('Données du formulaire manquantes ou invalides');
      }

      if (!aiContent || aiContent.trim().length === 0) {
        throw new Error('Contenu IA manquant pour la génération PDF');
      }

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

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Échec de génération du blob PDF');
      }

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const filename = `Portrait-Predictif-${this.cleanName(formData.name)}-${Date.now()}.pdf`;

      return { pdfBlob, downloadUrl, filename };

    } catch (error) {
      throw new Error(`Erreur génération PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
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
      { title: 'RÉSUMÉ EXÉCUTIF', page: 3 },
      { title: 'ANALYSE PROFIL ACTUEL', page: 4 },
      { title: 'PRÉDICTIONS 2025-2027', page: 5 },
      { title: 'RECOMMANDATIONS STRATÉGIQUES', page: 6 },
      { title: 'OPPORTUNITÉS DE CROISSANCE', page: 7 },
      { title: 'PLAN D\'ACTION CONCRET', page: 8 },
      { title: 'CONCLUSION ET PROCHAINES ÉTAPES', page: 9 }
    ];

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    sections.forEach((section, index) => {
      const y = currentY + (index * 20);

      // Numéro et titre complet
      const fullTitle = `${index + 1}. ${section.title}`;
      pdf.setFont('helvetica', 'bold');
      pdf.text(fullTitle, margin, y);

      // Calculer la largeur du titre pour positionner les points
      const titleWidth = pdf.getTextWidth(fullTitle);
      const availableSpace = pageWidth - margin - titleWidth - 30; // 30 pour le numéro de page
      const dotCount = Math.floor(availableSpace / 2); // Approximation de la largeur d'un point

      // Points de liaison
      if (dotCount > 0) {
        const dots = '.'.repeat(dotCount);
        pdf.setFont('helvetica', 'normal');
        pdf.text(dots, margin + titleWidth + 5, y);
      }

      // Numéro de page
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.page.toString(), pageWidth - margin - 10, y, { align: 'right' });
    });
  }

  /**
   * Affiche TOUT le contenu IA de manière PROPRE et COMPLÈTE - VERSION AMÉLIORÉE
   */
  private static addCompleteContent(pdf: jsPDF, aiContent: string, pageWidth: number, pageHeight: number, margin: number): void {
    try {
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

      // Nettoyage du contenu avec gestion d'erreurs
      let cleanContent: string;
      try {
        cleanContent = aiContent
          .replace(/\*\*/g, '')
          .replace(/`{1,3}/g, '')
          .trim();
      } catch (error) {
        cleanContent = aiContent.trim();
      }

      // Essayer d'abord de parser en sections avec gestion d'erreurs
      let sections: Array<{ title: string; content: string }>;
      try {
        sections = this.parseContentSimple(cleanContent);
      } catch (error) {
        // Fallback vers contenu brut en cas d'erreur de parsing
        this.addRawContent(pdf, cleanContent, pageWidth, pageHeight, margin, currentY);
        return;
      }

      // Vérifier si le parsing a bien fonctionné
      const totalSectionContent = sections.map((s: { content: string }) => s.content).join(' ').length;
      const originalContentLength = cleanContent.length;

      // Si on perd plus de 20% du contenu OU si moins de 2 sections, utiliser le contenu brut
      if (totalSectionContent < originalContentLength * 0.8 || sections.length < 2) {
        this.addRawContent(pdf, cleanContent, pageWidth, pageHeight, margin, currentY);
        return;
      }

      // Titres fixes correspondant à la table des matières
      const fixedSections = [
        '1. RÉSUMÉ EXÉCUTIF',
        '2. ANALYSE PROFIL ACTUEL',
        '3. PRÉDICTIONS 2025-2027',
        '4. RECOMMANDATIONS STRATÉGIQUES',
        '5. OPPORTUNITÉS DE CROISSANCE',
        '6. PLAN D\'ACTION CONCRET',
        '7. CONCLUSION ET PROCHAINES ÉTAPES'
      ];

      // Affichage avec titres fixes et contenu IA correspondant
      for (let i = 0; i < fixedSections.length; i++) {
        const fixedTitle = fixedSections[i];

        // Trouver le contenu correspondant dans les sections parsées
        let sectionContent = '';
        const matchingSection = sections.find((section: { title: string; content: string }) =>
          this.normalizeSectionTitle(section.title) === this.normalizeSectionTitle(fixedTitle) ||
          section.title.includes(fixedTitle.substring(3)) || // Sans le numéro
          fixedTitle.includes(section.title.replace(/^\d+\.\s*/, '')) // Comparaison flexible
        );

        if (matchingSection && matchingSection.content) {
          sectionContent = matchingSection.content;
        } else {
          // Si pas de correspondance, prendre une partie du contenu brut
          const contentParts = cleanContent.split(/(?=\d+\.\s*[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ])|(?=^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ\s]{15,}$)/m);
          if (contentParts[i] && contentParts[i].trim()) {
            sectionContent = contentParts[i].trim();
          } else {
            sectionContent = `Contenu en cours de développement pour cette section.`;
          }
        }

        // Nouvelle page pour chaque section (sauf la première)
        if (i > 0 || currentY > maxY - 60) {
          pdf.addPage();
          currentY = margin + 20;
        }

        // Titre de section fixe
        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(fixedTitle, margin, currentY);
        currentY += 25;

        // Ligne de séparation sous le titre
        pdf.setDrawColor(30, 64, 175);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 15;

        // Contenu de section
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        // Division simple par paragraphes naturels
        const paragraphs = sectionContent.split('\n\n').filter((p: string) => p.trim().length > 0);
        const finalParagraphs = paragraphs.length > 0 ? paragraphs : [sectionContent];

        for (const paragraph of finalParagraphs) {
          if (!paragraph.trim()) continue;

          // Nettoyer le paragraphe des numéros de section en début
          let cleanParagraph = paragraph.trim().replace(/^\d+\.\s*[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ\s]*\n*/, '');
          if (!cleanParagraph) cleanParagraph = paragraph.trim();

          if (currentY > maxY - 25) {
            pdf.addPage();
            currentY = margin + 20;
          }

          const lines = pdf.splitTextToSize(cleanParagraph, contentWidth);

          for (const line of lines) {
            if (currentY > maxY - 12) {
              pdf.addPage();
              currentY = margin + 20;
            }
            pdf.text(line, margin, currentY);
            currentY += 6;
          }

          currentY += 10; // Espacement entre paragraphes
        }

        currentY += 20; // Espacement entre sections
      }

    } catch (error) {
      // Fallback d'urgence - afficher le contenu brut
      this.addRawContent(pdf, aiContent, pageWidth, pageHeight, margin, margin + 20);
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
   * Parse le contenu en sections structurées - VERSION AMÉLIORÉE
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

    // Nettoyage préalable du contenu
    const cleanContent = content
      .replace(/\*\*/g, '') // Supprime les **
      .replace(/`{1,3}/g, '') // Supprime les backticks
      .trim();

    // Tentative 1: Détection par ## (markdown)
    let parts = cleanContent.split(/(?=^##\s+)/m);

    if (parts.length <= 1) {
      // Tentative 2: Détection par numérotation (1., 2., etc.)
      parts = cleanContent.split(/(?=^\d+\.\s+[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ])/m);
    }

    if (parts.length <= 1) {
      // Tentative 3: Détection par titres courts en majuscules (max 50 caractères)
      parts = cleanContent.split(/(?=^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ\s]{10,50}$)/m);
    }

    // Si aucune division n'a fonctionné, créer une structure forcée
    if (parts.length <= 1) {
      return this.createForcedStructure(cleanContent, expectedSections);
    }

    const detectedSections: Array<{ title: string; content: string }> = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      const lines = part.split('\n');
      const firstLine = lines[0].trim();
      let title = '';
      let content = '';

      // Parsing strict pour éviter les faux titres
      if (firstLine.startsWith('##')) {
        title = firstLine.replace(/^#{2}\s*/, '').trim();
        content = lines.slice(1).join('\n').trim();
      } else if (firstLine.match(/^\d+\.\s+[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ]/)) {
        // Titre numéroté (1. TITRE)
        title = firstLine.replace(/^\d+\.\s*/, '').trim();
        content = lines.slice(1).join('\n').trim();
      } else if (
        firstLine.length >= 10 &&
        firstLine.length <= 50 &&
        firstLine === firstLine.toUpperCase() &&
        !firstLine.includes('.') && // Pas de phrases
        !firstLine.includes(',') && // Pas de listes
        lines.length > 1 // Il y a du contenu après
      ) {
        // Titre court en majuscules
        title = firstLine.trim();
        content = lines.slice(1).join('\n').trim();
      } else if (i === 0) {
        // Premier élément sans titre détecté
        title = 'RÉSUMÉ EXÉCUTIF';
        content = part;
      } else {
        // Contenu sans titre clair - l'ajouter à la section précédente ou créer une section générique
        if (detectedSections.length > 0) {
          detectedSections[detectedSections.length - 1].content += '\n\n' + part;
          continue;
        } else {
          title = `SECTION ${detectedSections.length + 1}`;
          content = part;
        }
      }

      // Validation du contenu
      if (title && content && content.length > 20) {
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
Email: ${companyConfig.email}
Site web: ${companyConfig.website}
Telephone: ${companyConfig.phone}

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
   * Génère le contenu IA via l'API route sécurisée avec gestion d'erreurs robuste
   */
  private static async generateAIContent(formData: FormData): Promise<string> {
    try {
      const config = getApiConfig();

      // Validation de la configuration
      if (!config || !config.internal || !config.internal.baseUrl) {
        throw new Error('Configuration API manquante');
      }

      // API publique - pas d'authentification requise
      // Timeout optimisé pour Vercel
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500000); // 50s timeout

      const response = await fetch(`${config.internal.baseUrl}/ai/generate-content`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(formData)
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Erreur HTTP ${response.status}: ${response.statusText}` };
        }

        // Gestion spécifique des erreurs Vercel
        if (response.status === 408) {
          throw new Error('⏱️ Génération IA trop lente. Veuillez réessayer.');
        }
        if (response.status === 504) {
          throw new Error('⏱️ Timeout serveur. Veuillez réessayer dans quelques instants.');
        }
        if (response.status === 500) {
          throw new Error('🔥 Erreur serveur interne. Veuillez réessayer.');
        }

        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Réponse API invalide - JSON malformé');
      }

      if (!data.success) {
        const errorMsg = data.error || 'Échec de génération IA';
        throw new Error(errorMsg);
      }

      if (!data.content || data.content.trim().length === 0) {
        throw new Error('L\'API IA a retourné un contenu vide. Cela peut être dû à une surcharge du service ou à un problème de configuration.');
      }

      return data.content;

    } catch (error) {
      // Gestion spécifique des erreurs d'abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('⏱️ Timeout: La génération IA a pris trop de temps');
      }

      // Re-lancer l'erreur avec plus de contexte
      throw new Error(`Erreur génération IA: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Méthode principale de génération sécurisée avec fallback
   */
  static async generateSecurePdf(formData: FormData): Promise<PdfGenerationResponse> {
    try {
      // Étape 1: Génération du contenu IA avec fallback
      let aiContent: string;
      try {
        aiContent = await this.generateAIContent(formData);
      } catch (error) {
        aiContent = this.generateFallbackContent(formData);
      }

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
        message: `✅ ${formData.name}, votre Portrait Prédictif a été généré avec succès !`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération sécurisée'
      };
    }
  }

  /**
   * Génère un PDF de fallback avec du contenu texte simple
   */
  static async generateFallbackPdf(content: string, userName: string): Promise<PdfGenerationResult> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxY = pageHeight - 30;
      let currentY = margin + 20;

      // Titre
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PORTRAIT PRÉDICTIF IA - RAPPORT DE FALLBACK', pageWidth / 2, currentY, { align: 'center' });
      currentY += 20;

      // Nom de l'utilisateur
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Rapport pour: ${userName}`, margin, currentY);
      currentY += 15;

      // Date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, margin, currentY);
      currentY += 20;

      // Contenu
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      const lines = pdf.splitTextToSize(content, pageWidth - (margin * 2));

      lines.forEach((line: string) => {
        if (currentY > maxY) {
          pdf.addPage();
          currentY = margin + 20;
        }
        pdf.text(line, margin, currentY);
        currentY += 6;
      });

      // Génération du blob
      const pdfBlob = pdf.output('blob');
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const filename = `Portrait-Predictif-Fallback-${this.cleanName(userName)}-${Date.now()}.pdf`;

      return { pdfBlob, downloadUrl, filename };

    } catch (error) {
      throw new Error(`Erreur génération PDF de fallback: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Génère un contenu de fallback en cas d'échec de l'IA - VERSION FRANÇAISE COMPLÈTE
   */
  private static generateFallbackContent(formData: FormData): string {
    const companyConfig = getCompanyConfig();

    return `1. RÉSUMÉ EXÉCUTIF

Cher(e) ${formData.name},

Ce rapport présente une analyse personnalisée et approfondie de votre profil professionnel dans le secteur ${formData.sector} en tant que ${formData.position}. Notre analyse se base sur les tendances actuelles du marché, les évolutions technologiques et les opportunités émergentes dans votre domaine d'expertise.

Votre vision professionnelle "${formData.ambitions}" constitue le fil conducteur de cette étude prédictive qui vous accompagnera dans votre développement de carrière pour les années 2025-2027.

2. ANALYSE PROFIL ACTUEL

**Profil professionnel analysé :**
• Secteur d'activité : ${formData.sector}
• Position actuelle : ${formData.position}
• Vision et ambitions : ${formData.ambitions}

**Forces identifiées :**
Votre profil présente des caractéristiques particulièrement intéressantes pour le développement dans votre secteur d'activité. Votre positionnement actuel vous offre une base solide pour évoluer vers des responsabilités accrues et des opportunités de croissance significatives.

**Contexte sectoriel :**
Le secteur ${formData.sector} connaît actuellement des transformations importantes qui créent de nouvelles opportunités pour les professionnels ayant votre profil. Les tendances actuelles du marché favorisent l'émergence de nouveaux modèles économiques et de nouvelles approches méthodologiques.

3. PRÉDICTIONS 2025-2027

**Évolution du secteur ${formData.sector} :**
• Accélération de la transformation numérique et adoption massive des nouvelles technologies
• Importance croissante des compétences transversales et de l'adaptabilité professionnelle
• Développement de nouveaux modèles économiques axés sur la durabilité et l'innovation
• Émergence de nouvelles réglementations et standards professionnels
• Renforcement de la collaboration internationale et des échanges intersectoriels

**Impact prévu sur votre position de ${formData.position} :**
• Évolution des responsabilités vers plus d'autonomie décisionnelle et de leadership
• Nécessité de développer des compétences numériques avancées et une expertise technologique
• Opportunités accrues de management d'équipes et de conduite de projets stratégiques
• Importance capitale de la formation continue et de la veille professionnelle
• Développement de nouvelles méthodes de travail collaboratives et agiles

4. RECOMMANDATIONS STRATÉGIQUES

**Axe 1 - Développement des compétences techniques**
• Formation approfondie aux outils numériques spécifiques à votre secteur d'activité
• Acquisition de certifications professionnelles reconnues dans votre domaine
• Développement d'une expertise dans les technologies émergentes de votre secteur
• Maîtrise des outils d'analyse de données et de business intelligence

**Axe 2 - Renforcement des compétences relationnelles**
• Développement des compétences de communication interpersonnelle et de présentation
• Formation au leadership et au management d'équipes multiculturelles
• Amélioration des capacités de négociation et de gestion des conflits
• Développement de l'intelligence émotionnelle et de l'empathie professionnelle

**Axe 3 - Positionnement stratégique sur le marché**
• Définition claire et différenciante de votre proposition de valeur unique
• Spécialisation progressive dans des niches porteuses et à forte valeur ajoutée
• Anticipation proactive des besoins futurs du marché et des clients
• Construction d'une réputation d'expert reconnu dans votre domaine

5. OPPORTUNITÉS DE CROISSANCE

**Analyse basée sur votre vision : "${formData.ambitions}"**

**Opportunités à court terme (6-12 mois) :**
• Optimisation et amélioration continue de vos processus de travail actuels
• Participation à des formations ciblées sur les tendances émergentes de votre secteur
• Développement et pilotage de projets pilotes innovants au sein de votre organisation
• Élargissement de votre réseau professionnel par la participation à des événements sectoriels

**Opportunités à moyen terme (1-2 ans) :**
• Évolution progressive vers des responsabilités managériales élargies
• Participation active à des projets transversaux et interdisciplinaires
• Développement de partenariats stratégiques avec des acteurs clés de votre secteur
• Prise de parole publique et partage d'expertise lors de conférences professionnelles

**Opportunités à long terme (2-3 ans) :**
• Accession à des postes de leadership sur des projets d'envergure nationale ou internationale
• Reconnaissance en tant qu'expert de référence dans votre domaine de spécialisation
• Contribution active à la transformation et à l'innovation de votre secteur d'activité
• Possibilité de création d'entreprise ou de développement d'activités entrepreneuriales

6. PLAN D'ACTION CONCRET

**Phase 1 - Consolidation et évaluation (3 premiers mois)**
1. Réalisation d'un audit complet et objectif de vos compétences actuelles
2. Identification précise des écarts à combler pour atteindre vos objectifs
3. Élaboration d'un plan de formation personnalisé et adapté à vos besoins
4. Mise en place d'indicateurs de performance et de suivi de progression

**Phase 2 - Développement et montée en compétences (6 mois suivants)**
1. Mise en œuvre systématique des formations et certifications identifiées
2. Développement et réalisation de projets concrets démontrant vos nouvelles compétences
3. Élargissement stratégique de votre réseau professionnel et de vos contacts sectoriels
4. Participation active à des groupes de travail et des communautés professionnelles

**Phase 3 - Expansion et positionnement d'expert (12 mois suivants)**
1. Prise progressive de responsabilités accrues et de mandats de leadership
2. Positionnement public en tant qu'expert reconnu dans votre domaine
3. Contribution active à l'innovation et à la transformation de votre secteur
4. Développement d'une stratégie de personal branding et de visibilité professionnelle

7. CONCLUSION ET PROCHAINES ÉTAPES

Votre profil professionnel présente un potentiel de développement particulièrement significatif pour une évolution positive et ambitieuse dans les années à venir. Les recommandations stratégiques présentées dans ce rapport vous fourniront une base méthodologique solide pour développer votre carrière de manière structurée et efficace.

**Actions prioritaires à mettre en œuvre immédiatement :**
1. Hiérarchiser et prioriser les actions du plan d'action proposé selon vos contraintes actuelles
2. Définir des indicateurs de réussite mesurables et des jalons de progression réguliers
3. Planifier des points d'étape trimestriels pour évaluer l'avancement et ajuster la stratégie
4. Adapter continuellement votre approche selon les évolutions du marché et les opportunités émergentes

**Accompagnement personnalisé disponible :**
Pour bénéficier d'un accompagnement personnalisé dans la mise en œuvre de ces recommandations, notre équipe d'experts reste à votre disposition pour vous conseiller et vous soutenir dans votre développement professionnel.

---
*Rapport d'analyse prédictive généré par ${companyConfig.name} - ${new Date().toLocaleDateString('fr-FR')}*
*Contact professionnel : ${companyConfig.email} | Téléphone : ${companyConfig.phone}*
*Site web : ${companyConfig.website}*`;
  }

  /**
   * Crée le contenu texte du PDF pour l'affichage - VERSION CORRIGÉE
   */
  private static createPdfContent(aiContent: string, formData: FormData): string {
    const companyConfig = getCompanyConfig();

    // Nettoyage du contenu AI identique à celui du PDF
    let cleanContent: string;
    try {
      cleanContent = aiContent
        .replace(/\*\*/g, '') // Supprime le markdown bold
        .replace(/`{1,3}/g, '') // Supprime les backticks
        .trim();
    } catch (error) {
      cleanContent = aiContent.trim();
    }

    // Essayer de parser en sections pour un affichage structuré
    let formattedContent: string;
    try {
      const sections = this.parseContentSimple(cleanContent);

      // Vérifier si le parsing est valide
      const totalSectionContent = sections.map(s => s.content).join(' ').length;
      const originalContentLength = cleanContent.length;

      if (totalSectionContent >= originalContentLength * 0.8 && sections.length >= 2) {
        // Parsing réussi, formater par sections
        formattedContent = sections.map(section =>
          `\n${section.title}\n${'═'.repeat(50)}\n${section.content}\n`
        ).join('\n');
      } else {
        // Parsing insuffisant, utiliser le contenu brut
        formattedContent = cleanContent;
      }
    } catch (error) {
      formattedContent = cleanContent;
    }

    return `PORTRAIT PRÉDICTIF IA - ${formData.name.toUpperCase()}
═══════════════════════════════════════════════════════════════
Généré par ${companyConfig.name} • ${new Date().toLocaleDateString('fr-FR')}

PROFIL CLIENT:
Nom: ${formData.name}
Email: ${formData.email}
Secteur: ${formData.sector}
Poste: ${formData.position}
Vision: ${formData.ambitions}

CONTENU COMPLET DU RAPPORT:
${formattedContent}

SÉCURITÉ: Ce rapport a été généré via des API routes sécurisées.
Les clés API sensibles ne sont jamais exposées côté client.

CONTACT:
${companyConfig.email}
${companyConfig.website}
${companyConfig.phone}

© ${new Date().getFullYear()} ${companyConfig.name} - ${companyConfig.tagline}`;
  }

  /**
   * Génère un PDF de fallback simple
   */
  
}
