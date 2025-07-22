import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, FileText, X, Clock, AlertCircle } from 'lucide-react';

interface NotificationBarProps {
  isVisible: boolean;
  pdfGenerated: boolean;
  emailSent: boolean;
  isProcessing: boolean;
  userName?: string;
  userEmail?: string;
  onClose: () => void;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({
  isVisible,
  pdfGenerated,
  emailSent,
  isProcessing,
  userName,
  userEmail,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isProcessing && !pdfGenerated) {
      setCurrentStep(1); // Génération en cours
    } else if (pdfGenerated && !emailSent && !isProcessing) {
      setCurrentStep(2); // PDF généré, email en cours
    } else if (pdfGenerated && emailSent) {
      setCurrentStep(3); // Tout terminé
      // Auto-fermeture après 8 secondes pour le succès
      setTimeout(() => {
        onClose();
      }, 8000);
    } else if (pdfGenerated && !emailSent && !isProcessing) {
      setCurrentStep(4); // PDF généré mais email échoué
      // Auto-fermeture après 10 secondes pour l'erreur
      setTimeout(() => {
        onClose();
      }, 10000);
    }
  }, [isProcessing, pdfGenerated, emailSent, onClose]);

  if (!isVisible) return null;

  const getStatusMessage = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <Clock className="w-4 h-4 text-blue-400 animate-spin" />,
          title: "Génération IA...",
          message: `Analyse de ${userName || 'votre profil'} en cours`,
          bgColor: "from-blue-900/95 to-indigo-900/95",
          borderColor: "border-blue-500/30"
        };
      case 2:
        return {
          icon: <Mail className="w-4 h-4 text-yellow-400 animate-pulse" />,
          title: "Envoi email...",
          message: `PDF prêt, envoi vers ${userEmail?.split('@')[0] || 'votre email'}...`,
          bgColor: "from-yellow-900/95 to-orange-900/95",
          borderColor: "border-yellow-500/30"
        };
      case 3:
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-400" />,
          title: "Terminé !",
          message: `Portrait envoyé à ${userName || 'vous'} avec succès`,
          bgColor: "from-green-900/95 to-emerald-900/95",
          borderColor: "border-green-500/30"
        };
      case 4:
        return {
          icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
          title: "PDF prêt",
          message: `Rapport généré, email échoué`,
          bgColor: "from-orange-900/95 to-red-900/95",
          borderColor: "border-orange-500/30"
        };
      default:
        return null;
    }
  };

  const status = getStatusMessage();
  if (!status) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-sm md:max-w-xs">
      <div className={`bg-gradient-to-r ${status.bgColor} backdrop-blur-xl border ${status.borderColor} rounded-xl shadow-xl`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Icône de statut */}
              <div className="flex-shrink-0">
                {status.icon}
              </div>

              {/* Contenu principal */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">
                  {status.title}
                </h3>
                <p className="text-slate-300 text-xs leading-tight">
                  {status.message}
                </p>
              </div>
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10 ml-2"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Indicateurs compacts */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <FileText className={`w-3 h-3 ${pdfGenerated ? 'text-green-400' : 'text-slate-500'}`} />
                <span className={pdfGenerated ? 'text-green-400' : 'text-slate-500'}>
                  PDF {pdfGenerated ? '✓' : '○'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className={`w-3 h-3 ${emailSent ? 'text-green-400' : 'text-slate-500'}`} />
                <span className={emailSent ? 'text-green-400' : 'text-slate-500'}>
                  Email {emailSent ? '✓' : '○'}
                </span>
              </div>
            </div>

            {/* Mini barre de progression */}
            {isProcessing && (
              <div className="w-16 bg-slate-700/50 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
