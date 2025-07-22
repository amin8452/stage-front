import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Shield, CheckCircle, Zap, Brain, Download, Bot, ArrowLeft, Eye } from "lucide-react";

import { EmailService, UserInfo } from "@/services/EmailService";

import PdfViewer from "./PdfViewer";

import NotificationBar from "./NotificationBar";


const LeadForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sector: "",
    position: "",
    ambitions: ""
  });
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    sector: "",
    position: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfData, setPdfData] = useState<{
    downloadUrl: string;
    pdfContent: string;
    pdfBlob?: Blob;
    filename?: string;
  } | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // États pour le suivi du processus
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showNotificationBar, setShowNotificationBar] = useState(false);

  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPdfGenerated(false);
    setEmailSent(false);
    setShowNotificationBar(true);

    try {
      // 1. Générer le contenu IA d'abord
      const aiResponse = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const aiData = await aiResponse.json();

      if (!aiData.success) {
        throw new Error(aiData.error || 'Erreur lors de la génération du contenu IA');
      }

      // 2. Générer le PDF avec sauvegarde en base de données
      const pdfResponse = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formData,
          aiContent: aiData.content
        }),
      });

      const pdfResult = await pdfResponse.json();

      if (pdfResult.success) {
        setPdfGenerated(true);
        if (pdfResult.pdfId) {
          // Utiliser l'endpoint de téléchargement au lieu de l'URL base64
          const downloadUrl = `/api/pdf/download/${pdfResult.pdfId}`;
          setPdfData({
            downloadUrl: downloadUrl,
            pdfContent: aiData.content, // Utiliser le contenu IA généré
            pdfBlob: null, // Pas de blob côté client maintenant
            filename: pdfResult.filename
          });
        }

        // Sauvegarder les infos utilisateur AVANT de réinitialiser le formulaire
        setUserInfo({
          name: formData.name,
          email: formData.email,
          sector: formData.sector,
          position: formData.position
        });

        // Envoyer automatiquement l'email avec PDF en pièce jointe + notification société
        try {
          const userInfo: UserInfo = {
            name: formData.name,
            email: formData.email,
            sector: formData.sector,
            position: formData.position,
            ambitions: formData.ambitions,
            timestamp: new Date().toISOString()
          };

          // Pour l'instant, envoyer un email de bienvenue standard
          // Le PDF est maintenant géré côté serveur
          const emailResult = await EmailService.sendWelcomeEmail(
            formData.email,
            formData.name,
            userInfo
          );

          if (emailResult.success) {
            setEmailSent(true);
            toast({
              title: "🎉 Génération Réussie !",
              description: `✨ ${formData.name}, votre Portrait Prédictif IA a été généré avec succès ! Un email de confirmation a été envoyé à ${formData.email}.`,
            });
          } else {
            setEmailSent(false);
            toast({
              title: "📄 PDF Généré !",
              description: `✨ ${formData.name}, votre Portrait Prédictif IA a été généré avec succès ! (Email non envoyé: ${emailResult.error})`,
            });
          }
        } catch (emailError) {
          setEmailSent(false);
          toast({
            title: "📄 PDF Généré !",
            description: `✨ ${formData.name}, votre Portrait Prédictif IA a été généré avec succès ! (Email non envoyé)`,
          });
        }

        // Réinitialiser le formulaire pour une nouvelle génération
        setFormData({
          name: "",
          email: "",
          sector: "",
          position: "",
          ambitions: ""
        });
        setCurrentStep(1);
      } else {
        // En cas d'erreur, on cache la notification bar
        setShowNotificationBar(false);
        toast({
          title: "❌ Échec de Génération",
          description: `💥 Impossible de générer le PDF pour ${formData.name}. ${pdfResult.error || "Erreur inconnue"}. Veuillez réessayer.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setShowNotificationBar(false);
      toast({
        title: "❌ Erreur Technique Critique",
        description: `🔧 Problème technique lors de la génération du Portrait Prédictif pour ${formData.name}. Vérifiez votre connexion et réessayez.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    // Vérification SSR - s'assurer que nous sommes côté client
    if (typeof window === 'undefined') return;

    try {
      if (pdfData?.pdfBlob && pdfData?.filename) {
        // Utilise le PDF moderne généré

        // Vérifier que le blob est valide
        if (pdfData.pdfBlob.size === 0) {
          throw new Error('Le fichier PDF est vide');
        }

        const url = URL.createObjectURL(pdfData.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = pdfData.filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Nettoie l'URL temporaire après un délai
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        toast({
          title: "📥 PDF Téléchargé !",
          description: "Votre rapport PDF moderne avec UI professionnelle a été téléchargé.",
        });
      } else if (pdfData?.downloadUrl) {
        // Fallback vers l'ancien système si le nouveau n'est pas disponible

        const link = document.createElement('a');
        link.href = pdfData.downloadUrl;
        link.download = `Portrait-Predictif-${formData.name || 'Demo'}.txt`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "📥 Téléchargement démarré",
          description: "Votre rapport est en cours de téléchargement...",
        });
      } else {
        // Générer un PDF de fallback avec le contenu texte
        await generateFallbackPdf();
      }
    } catch (error) {
      toast({
        title: "❌ Erreur de téléchargement",
        description: "Impossible de télécharger le PDF. Tentative de génération alternative...",
        variant: "destructive",
      });

      // Essayer le fallback en cas d'erreur
      await generateFallbackPdf();
    }
  };

  const generateFallbackPdf = async () => {
    try {
      if (!pdfData?.pdfContent) {
        throw new Error('Aucun contenu disponible');
      }

      // Utiliser l'API pour générer le PDF
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }

      const result = await response.json();

      if (result.success && result.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.filename || 'portrait-predictif.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "📥 PDF Généré !",
          description: "Votre rapport PDF a été téléchargé.",
        });
      } else {
        throw new Error(result.error || 'Erreur de génération');
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToStep2 = formData.name && formData.email;
  const canProceedToStep3 = canProceedToStep2 && formData.sector && formData.position;
  const canSubmit = canProceedToStep3 && formData.ambitions;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Informations personnelles",
    "Profil professionnel", 
    "Vision stratégique"
  ];

  return (
    <section id="lead-form" className="py-32 px-4 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm border border-cyan-500/30 rounded-full text-sm font-bold text-cyan-300 mb-8 shadow-lg">
              <Bot className="w-5 h-5 mr-2 animate-pulse" />
               • IA PRÉDICTIVE • PDF PREMIUM
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Générez votre{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Portrait Prédictif IA
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
              Complétez ce formulaire pour recevoir votre analyse prédictive personnalisée de{" "}
              <span className="font-bold text-cyan-400">12-15 pages</span> générée par l'IA 
            </p>

            {/* Progress Section */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Étape {currentStep} sur {totalSteps}</span>
                <span>{Math.round(progress)}% complété</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" />
              <div className="flex justify-between mt-3">
                {stepTitles.map((title, index) => (
                  <div key={index} className={`text-xs ${currentStep > index ? 'text-cyan-400' : currentStep === index + 1 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      currentStep > index + 1 ? 'bg-cyan-500 text-white' : 
                      currentStep === index + 1 ? 'bg-white text-black' : 'bg-slate-600 text-slate-400'
                    }`}>
                      {currentStep > index + 1 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="hidden md:block">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>



          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Informations personnelles
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-semibold text-white">Nom complet *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Jean Dupont"
                      required
                      className="h-14 text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white/10 rounded-xl transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-semibold text-white">Email professionnel *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="jean.dupont@entreprise.com"
                      required
                      className="h-14 text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white/10 rounded-xl transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedToStep2}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Profile */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Profil professionnel
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="sector" className="text-lg font-semibold text-white">Secteur d'activité *</Label>
                    <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                      <SelectTrigger className="h-14 text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white focus:border-cyan-400 rounded-xl">
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl">
                        <SelectItem value="tech" className="text-white hover:bg-white/10 rounded-lg">Technologie / IA</SelectItem>
                        <SelectItem value="finance" className="text-white hover:bg-white/10 rounded-lg">Finance / FinTech</SelectItem>
                        <SelectItem value="industrie" className="text-white hover:bg-white/10 rounded-lg">Industrie 4.0</SelectItem>
                        <SelectItem value="sante" className="text-white hover:bg-white/10 rounded-lg">Santé / MedTech</SelectItem>
                        <SelectItem value="commerce" className="text-white hover:bg-white/10 rounded-lg">E-commerce / Retail</SelectItem>
                        <SelectItem value="consulting" className="text-white hover:bg-white/10 rounded-lg">Conseil / Services</SelectItem>
                        <SelectItem value="media" className="text-white hover:bg-white/10 rounded-lg">Média / Communication</SelectItem>
                        <SelectItem value="autre" className="text-white hover:bg-white/10 rounded-lg">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="position" className="text-lg font-semibold text-white">Poste actuel *</Label>
                    <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                      <SelectTrigger className="h-14 text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white focus:border-cyan-400 rounded-xl">
                        <SelectValue placeholder="Sélectionnez votre poste" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl">
                        <SelectItem value="ceo" className="text-white hover:bg-white/10 rounded-lg">CEO / Fondateur</SelectItem>
                        <SelectItem value="cto" className="text-white hover:bg-white/10 rounded-lg">CTO / Chief Technology Officer</SelectItem>
                        <SelectItem value="cmo" className="text-white hover:bg-white/10 rounded-lg">CMO / Chief Marketing Officer</SelectItem>
                        <SelectItem value="manager" className="text-white hover:bg-white/10 rounded-lg">VP / Director</SelectItem>
                        <SelectItem value="consultant" className="text-white hover:bg-white/10 rounded-lg">Consultant Senior</SelectItem>
                        <SelectItem value="entrepreneur" className="text-white hover:bg-white/10 rounded-lg">Entrepreneur</SelectItem>
                        <SelectItem value="autre" className="text-white hover:bg-white/10 rounded-lg">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedToStep3}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Strategic Vision */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Vision stratégique
                </h3>
                
                <div className="space-y-4">
                  <Label htmlFor="ambitions" className="text-lg font-semibold text-white">Vision stratégique à 3 ans *</Label>
                  <Textarea
                    id="ambitions"
                    value={formData.ambitions}
                    onChange={(e) => handleInputChange("ambitions", e.target.value)}
                    placeholder="Décrivez vos objectifs stratégiques, projets d'innovation, ou défis de transformation que vous souhaitez relever..."
                    className="min-h-[120px] text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white/10 rounded-xl transition-all duration-300"
                  />
                </div>

                <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">Vos données sont cryptées et protégées. L'IA  génère un contenu 100% personnalisé</span>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-xl font-bold rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-500/25"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Bot className="mr-3 h-6 w-6 animate-spin" />
                        IA  en cours...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Bot className="mr-3 h-6 w-6" />
                        Générer avec l'IA 
                        <Download className="ml-3 h-6 w-6" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              {[
                { icon: Bot, text: "IA ", color: "text-purple-400" },
                { icon: Zap, text: "Génération <3min", color: "text-yellow-400" },
                { icon: Shield, text: "100% Sécurisé", color: "text-cyan-400" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center text-center">
                  <item.icon className={`w-5 h-5 mr-2 ${item.color}`} />
                  <span className="font-semibold text-white">{item.text}</span>
                </div>
              ))}
            </div>
          </form>

          {/* Results Section */}
          {pdfData && (
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl animate-fade-in">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Votre rapport est prêt !
                </h3>
                <p className="text-slate-300 mb-6">
                  Téléchargez et visualisez votre Portrait Prédictif IA personnalisé. Un email de confirmation a été envoyé automatiquement.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  
                  <Button
                    onClick={() => setShowPdfViewer(true)}
                    variant="outline"
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </Button>
                  

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {pdfData && (
        <PdfViewer
          isOpen={showPdfViewer}
          onClose={() => setShowPdfViewer(false)}
          pdfContent={pdfData.pdfContent}
          downloadUrl={pdfData.downloadUrl}
          pdfBlob={pdfData.pdfBlob}
          filename={pdfData.filename}
          userEmail={userInfo.email}
          userName={userInfo.name}
        />
      )}

      {/* Barre de notification en bas */}
      <NotificationBar
        isVisible={showNotificationBar}
        pdfGenerated={pdfGenerated}
        emailSent={emailSent}
        isProcessing={isSubmitting}
        userName={userInfo.name || formData.name}
        userEmail={userInfo.email || formData.email}
        onClose={() => setShowNotificationBar(false)}
      />

    </section>
  );
};

export default LeadForm;
