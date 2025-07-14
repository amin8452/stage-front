
import { ArrowRight, Bot, FileText, Download, Zap, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Sparkles,
      title: "Remplissez le formulaire",
      description: "Partagez vos informations professionnelles, vos ambitions et votre vision stratégique en 3 étapes simples.",
      details: ["Informations personnelles", "Profil professionnel", "Vision à 3 ans"],
      duration: "2 minutes"
    },
    {
      number: "02",
      icon: Bot,
      title: "L'IA  analyse",
      description: "Notre intelligence artificielle avancée analyse votre profil et génère des prédictions personnalisées basées sur les données du marché.",
      details: ["Analyse comportementale", "Prédictions sectorielles", "Recommandations IA"],
      duration: "3 minutes"
    },
    {
      number: "03",
      icon: FileText,
      title: "Rapport PDF généré",
      description: "Recevez votre Portrait Prédictif de 12-15 pages avec analyse approfondie, prédictions et plan d'action concret.",
      details: ["Rapport personnalisé", "Prédictions 3 ans", "Plan d'action détaillé"],
      duration: "Instantané"
    },
    {
      number: "04",
      icon: Download,
      title: "Téléchargement & Email",
      description: "Accédez immédiatement à votre rapport via téléchargement direct et recevez-le également par email sécurisé.",
      details: ["Téléchargement direct", "Envoi par email", "Accès permanent"],
      duration: "Immédiat"
    }
  ];

  const scrollToSection = (href: string) => {
    // Vérification SSR - s'assurer que nous sommes côté client
    if (typeof window !== 'undefined') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="how-it-works" className="py-32 px-4 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 backdrop-blur-sm border border-emerald-500/30 rounded-full text-sm font-bold text-emerald-300 mb-8">
            <Zap className="w-5 h-5 mr-2" />
            PROCESSUS SIMPLIFIÉ
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Comment ça{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              fonctionne
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            4 étapes simples pour obtenir votre Portrait Prédictif IA personnalisé 
            en moins de 10 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {step.number}
                  </div>
                  <div className={`p-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {step.description}
                </p>

                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full">
                  <Zap className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-emerald-400 font-semibold text-sm">
                    Durée: {step.duration}
                  </span>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 max-w-md">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                  <div className="text-center">
                    <div className={`inline-flex p-6 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl mb-6`}>
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      Étape {step.number}
                    </h4>
                    <p className="text-slate-300">
                      {step.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-6">
            Prêt à découvrir votre potentiel ?
          </h3>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez les 2,500+ professionnels qui ont déjà transformé leur carrière 
            grâce à notre IA
          </p>
          
          <Button
            onClick={() => scrollToSection('#lead-form')}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-emerald-500/25"
          >
            <Bot className="w-6 h-6 mr-3" />
            Commencer maintenant
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>

          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-slate-400">
            <span>✓ Gratuit pendant 7 jours</span>
            <span>✓ Aucune carte requise</span>
            <span>✓ Résultats garantis</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
