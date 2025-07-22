import PDFDocument from 'pdfkit';

interface FormData {
  name: string;
  email: string;
  sector: string;
  position: string;
  ambitions: string;
}

interface PdfResult {
  success: boolean;
  pdfBuffer?: Buffer;
  filename?: string;
  error?: string;
}

export class PDFKitGenerator {
  /**
   * Génère un PDF 
   */
  static async generateProfessionalPdf(aiContent: string, formData: FormData): Promise<PdfResult> {
    try {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        const chunks: Buffer[] = [];
        
        // Collecter les chunks du PDF
        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          const filename = `Portrait-Predictif-${formData.name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;
          
          resolve({
            success: true,
            pdfBuffer,
            filename
          });
        });

        doc.on('error', (error) => {
          reject({
            success: false,
            error: error.message
          });
        });

        // === PAGE DE GARDE ===
        this.createCoverPage(doc, formData);
        
        // === NOUVELLE PAGE - SOMMAIRE ===
        doc.addPage();
        this.createTableOfContents(doc);
        
        // === NOUVELLE PAGE - CONTENU PRINCIPAL ===
        doc.addPage();
        this.createMainContent(doc, aiContent, formData);
        
        // Finaliser le document
        doc.end();
      });
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
  
  /**
   * Crée la page de garde
   */
  private static createCoverPage(doc: InstanceType<typeof PDFDocument>, formData: FormData) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Fond coloré en haut
    doc.rect(0, 0, pageWidth, 120)
       .fill('#2980b9');
    
    // Titre principal
    doc.fillColor('white')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('PORTRAIT PRÉDICTIF IA', 50, 40, {
         align: 'center',
         width: pageWidth - 100
       });
    
    doc.fontSize(14)
       .font('Helvetica')
       .text('Analyse Personnalisée de Votre Profil Professionnel', 50, 80, {
         align: 'center',
         width: pageWidth - 100
       });
    
    // Cadre pour les informations utilisateur
    doc.rect(80, 180, pageWidth - 160, 120)
       .stroke('#2980b9')
       .lineWidth(2);
    
    // Informations utilisateur
    doc.fillColor('#34495e')
       .fontSize(22)
       .font('Helvetica-Bold')
       .text(formData.name, 50, 220, {
         align: 'center',
         width: pageWidth - 100
       });
    
    doc.fontSize(14)
       .font('Helvetica')
       .text(`${formData.position} - ${formData.sector}`, 50, 250, {
         align: 'center',
         width: pageWidth - 100
       });
    
    doc.text(formData.email, 50, 270, {
      align: 'center',
      width: pageWidth - 100
    });
    
    // Date de génération
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.fillColor('#7f8c8d')
       .fontSize(12)
       .text(`Généré le ${currentDate}`, 50, pageHeight - 80, {
         align: 'center',
         width: pageWidth - 100
       });
    
    doc.text('Powered by MS360 - Intelligence Artificielle', 50, pageHeight - 60, {
      align: 'center',
      width: pageWidth - 100
    });
  }
  
  /**
   * Crée le sommaire
   */
  private static createTableOfContents(doc: InstanceType<typeof PDFDocument>) {
    const pageWidth = doc.page.width;
    let yPos = 80;
    
    // Titre du sommaire
    doc.fillColor('#2980b9')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('SOMMAIRE', 50, yPos);
    
    yPos += 40;
    
    // Éléments du sommaire
    const sommaire = [
      '1. Profil Personnel',
      '2. Analyse de Votre Secteur',
      '3. Évaluation de Votre Position',
      '4. Analyse de Vos Ambitions',
      '5. Recommandations Personnalisées',
      '6. Plan d\'Action Suggéré',
      '7. Conclusion et Perspectives'
    ];
    
    doc.fillColor('#34495e')
       .fontSize(14)
       .font('Helvetica');
    
    sommaire.forEach((item) => {
      doc.text(item, 70, yPos);
      doc.text('3', pageWidth - 100, yPos);
      
      // Ligne pointillée
      const startX = 70 + doc.widthOfString(item) + 10;
      const endX = pageWidth - 120;
      let x = startX;
      while (x < endX) {
        doc.text('.', x, yPos);
        x += 8;
      }
      
      yPos += 25;
    });
  }
  
  /**
   * Crée le contenu principal
   */
  private static createMainContent(doc: InstanceType<typeof PDFDocument>, aiContent: string, formData: FormData) {
    const pageWidth = doc.page.width;
    let yPos = 80;
    
    // Titre principal
    doc.fillColor('#2980b9')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text(`Portrait Prédictif de ${formData.name}`, 50, yPos);
    
    yPos += 40;
    
    // Section Profil
    doc.fontSize(16)
       .text('1. PROFIL PERSONNEL', 50, yPos);
    yPos += 25;
    
    doc.fillColor('#34495e')
       .fontSize(12)
       .font('Helvetica');
    
    const profilInfo = [
      `Nom: ${formData.name}`,
      `Email: ${formData.email}`,
      `Secteur: ${formData.sector}`,
      `Position: ${formData.position}`,
      `Ambitions: ${formData.ambitions}`
    ];
    
    profilInfo.forEach(info => {
      doc.text(info, 70, yPos);
      yPos += 18;
    });
    
    yPos += 20;
    
    // Section Analyse IA
    doc.fillColor('#2980b9')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('2. ANALYSE PERSONNALISÉE', 50, yPos);
    yPos += 25;
    
    // Contenu IA formaté
    doc.fillColor('#34495e')
       .fontSize(11)
       .font('Helvetica');
    
    // Diviser le contenu en paragraphes
    const paragraphs = aiContent.split('\n\n');
    
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        // Vérifier si on a assez de place sur la page
        if (yPos > doc.page.height - 100) {
          doc.addPage();
          yPos = 80;
        }
        
        // Vérifier si c'est un titre
        if (paragraph.match(/^[\d\*\-#]/)) {
          doc.font('Helvetica-Bold')
             .fontSize(12);
        } else {
          doc.font('Helvetica')
             .fontSize(11);
        }
        
        const textHeight = doc.heightOfString(paragraph.trim(), {
          width: pageWidth - 100
        });
        
        doc.text(paragraph.trim(), 50, yPos, {
          width: pageWidth - 100,
          align: 'justify'
        });
        
        yPos += textHeight + 15;
      }
    });
    
    // Section Recommandations
    if (yPos > doc.page.height - 200) {
      doc.addPage();
      yPos = 80;
    }
    
    yPos += 30;
    doc.fillColor('#2980b9')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('3. RECOMMANDATIONS', 50, yPos);
    yPos += 25;
    
    doc.fillColor('#34495e')
       .fontSize(11)
       .font('Helvetica');
    
    const recommendations = [
      '• Continuez à développer vos compétences dans votre secteur',
      '• Explorez les opportunités de formation et de certification',
      '• Développez votre réseau professionnel',
      '• Restez informé des tendances de votre industrie',
      '• Considérez des projets qui alignent avec vos ambitions'
    ];
    
    recommendations.forEach(rec => {
      doc.text(rec, 50, yPos, {
        width: pageWidth - 100
      });
      yPos += 20;
    });
    
    // Pied de page sur toutes les pages
    this.addFooterToAllPages(doc);
  }
  
  /**
   * Ajoute un pied de page (simplifié pour PDFKit)
   */
  private static addFooterToAllPages(doc: InstanceType<typeof PDFDocument>) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Ligne de séparation
    doc.moveTo(50, pageHeight - 50)
       .lineTo(pageWidth - 50, pageHeight - 50)
       .stroke('#cccccc');
    
    // Texte du pied de page
    doc.fillColor('#7f8c8d')
       .fontSize(10)
       .font('Helvetica')
       .text('MS360 - Portrait Prédictif IA', 50, pageHeight - 35);
    
    doc.text('Page 1', pageWidth - 100, pageHeight - 35);
  }
}
