
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Send, User, AtSign, FileText, X } from "lucide-react";
import { EmailService } from "@/services/EmailService";
import { useToast } from "@/hooks/use-toast";

interface EmailViewProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

const EmailView = ({
  isOpen,
  onClose,
  defaultEmail = "",
  defaultName = ""
}: EmailViewProps) => {
  const [formData, setFormData] = useState({
    email: defaultEmail,
    name: defaultName,
    subject: `🤖 Votre Portrait Prédictif IA est prêt - ${defaultName}`,
    message: `Bonjour ${defaultName},

Félicitations ! Votre Portrait Prédictif IA personnalisé a été généré avec succès.

Ce rapport contient :
• Une analyse approfondie de votre profil professionnel
• Des prédictions IA pour les 3 prochaines années (2025-2027)
• Des recommandations stratégiques personnalisées
• Un plan d'action concret et actionnable
• Des opportunités de croissance spécifiques à votre secteur

Pour télécharger votre rapport PDF, retournez sur notre site web et cliquez sur le bouton "Télécharger le PDF".

Nous vous souhaitons beaucoup de succès dans la réalisation de vos ambitions professionnelles !

Cordialement,
L'équipe AI Portrait Pro`
  });

  // Mise à jour automatique quand les props changent
  useEffect(() => {
    if (defaultEmail || defaultName) {
      setFormData(prev => ({
        ...prev,
        email: defaultEmail,
        name: defaultName,
        subject: `🤖 Votre Portrait Prédictif IA est prêt - ${defaultName}`,
        message: `Bonjour ${defaultName},

Félicitations ! Votre Portrait Prédictif IA personnalisé a été généré avec succès.

Ce rapport contient :
• Une analyse approfondie de votre profil professionnel
• Des prédictions IA pour les 3 prochaines années (2025-2027)
• Des recommandations stratégiques personnalisées
• Un plan d'action concret et actionnable
• Des opportunités de croissance spécifiques à votre secteur

Le document PDF est joint à cet email pour votre consultation.

Nous vous souhaitons beaucoup de succès dans la réalisation de vos ambitions professionnelles !

Cordialement,
L'équipe AI Portrait Pro`
      }));
    }
  }, [defaultEmail, defaultName, isOpen]);
  
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmail = async () => {
    // Validation des champs
    if (!formData.email || !formData.name) {
      toast({
        title: "❌ Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Validation de l'email
    if (!EmailService.validateEmail(formData.email)) {
      toast({
        title: "❌ Email invalide",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await EmailService.sendWelcomeEmail(
        EmailService.sanitizeEmail(formData.email),
        formData.name
      );

      if (result.success) {
        toast({
          title: "📧 Email envoyé avec succès !",
          description: `Email de bienvenue envoyé à ${formData.email}`,
        });

        // Fermer le modal après succès
        setTimeout(() => {
          onClose();
        }, 1500);

      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast({
        title: "❌ Erreur d'envoi",
        description: "Impossible d'envoyer l'email. Veuillez vérifier votre connexion et réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 border border-white/20">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Mail className="w-6 h-6 mr-2 text-cyan-400" />
            Envoyer le rapport par email
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Info - Pré-rempli */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 mr-2 text-cyan-400" />
              <span className="text-white font-semibold">Destinataire</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nom</label>
                <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white">
                  {formData.name || defaultName || 'Non spécifié'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white flex items-center">
                  <AtSign className="w-4 h-4 mr-2 text-cyan-400" />
                  {formData.email || defaultEmail || 'Non spécifié'}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              ℹ️ Ces informations sont automatiquement récupérées du formulaire
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white flex items-center">
              <FileText className="w-4 h-4 mr-1 text-cyan-400" />
              Sujet
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">
              Message
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={8}
              className="bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="text-slate-400 text-sm">
              Le rapport PDF sera joint automatiquement
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailView;
