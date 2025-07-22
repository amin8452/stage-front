import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Rocket, CheckCircle, Users, TrendingUp, Clock, Brain, Bot } from "lucide-react";

const AidaMarketingHook = () => {
  // Configuration des messages AIDA
  const messages = [
    {
      phase: "QUE FAISONS-NOUS ?",
      icon: Target,
      title: "Analyse IA de Votre Profil Professionnel",
      description: "Nous analysons vos compétences, expériences et objectifs pour créer votre portrait prédictif personnalisé",
      theme: "blue"
    },
    {
      phase: "COMMENT ÇA MARCHE ?",
      icon: Brain,
      title: "3 Étapes Simples en 3 Minutes",
      description: "1) Remplissez le formulaire • 2) L'IA analyse votre profil • 3) Recevez votre rapport PDF par email",
      theme: "purple"
    },
    {
      phase: "QUE RECEVEZ-VOUS ?",
      icon: CheckCircle,
      title: "Rapport PDF Complet de 12-15 Pages",
      description: "• Analyse de vos forces • Prédictions de carrière • Recommandations personnalisées • Plan d'action concret",
      theme: "green"
    },
    {
      phase: "POURQUOI NOUS CHOISIR ?",
      icon: Users,
      title: "2,500+ Professionnels Nous Font Confiance",
      description: "Service rapide, sécurisé et garanti • Technologie IA avancée • Support client réactif",
      theme: "orange"
    }
  ];

  // Thèmes de couleurs centralisés
  const themes = {
    blue: { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    purple: { gradient: "from-purple-500 to-indigo-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    green: { gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    orange: { gradient: "from-orange-500 to-red-500", bg: "bg-orange-500/10", border: "border-orange-500/30" }
  };

  // Bénéfices statiques
  const benefits = [
    { icon: Users, title: "2,500+ Professionnels", description: "Nous font déjà confiance", color: "text-blue-400" },
    { icon: Clock, title: "3 Minutes Chrono", description: "Pour votre rapport complet", color: "text-green-400" },
    { icon: TrendingUp, title: "Résultats Garantis", description: "Ou remboursé sous 30 jours", color: "text-purple-400" }
  ];

  const scrollToLeadForm = () => {
    if (typeof window !== 'undefined') {
      document.querySelector('#lead-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm border border-cyan-500/30 rounded-full text-xs sm:text-sm font-bold text-cyan-300 mb-4 sm:mb-6">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">SERVICE PORTRAIT PRÉDICTIF IA</span>
            <span className="sm:hidden">PORTRAIT IA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
            Comment Ça Marche ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Découvrez notre service en 4 étapes simples et claires
          </p>
        </div>

        {/* AIDA Cards Grid - Sections Indépendantes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16">
          {messages.map((message, index) => {
            const theme = themes[message.theme];
            const Icon = message.icon;

            return (
              <div key={index} className={`${theme.bg} backdrop-blur-sm border ${theme.border} rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden hover:scale-105 transition-all duration-300`}>
                {/* Phase Badge */}
                <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r ${theme.gradient} rounded-full text-white text-xs sm:text-sm font-bold mb-4 sm:mb-6`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{message.phase}</span>
                  <span className="sm:hidden">{message.phase.split(' ')[0]}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {message.title}
                </h3>

                {/* Description */}
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {message.description.split('•').map((item, itemIndex) => (
                    <div key={itemIndex} className={itemIndex === 0 ? 'mb-3' : 'flex items-start justify-start mb-2'}>
                      {itemIndex === 0 ? (
                        <p className="text-center">{item}</p>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-left">{item.trim()}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mb-12 sm:mb-16">
          <Button
            onClick={scrollToLeadForm}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-105 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-2xl transition-all duration-500 transform hover:shadow-cyan-500/25"
          >
            <Rocket className="w-5 h-5 mr-3" />
            Créer Mon Portrait IA Maintenant
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-5xl mx-auto px-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <benefit.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${benefit.color} mx-auto mb-2 sm:mb-3`} />
              <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{benefit.title}</h4>
              <p className="text-slate-400 text-xs sm:text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Urgency Message */}
        <div className="text-center mt-8 sm:mt-12 px-4">
          <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-sm border border-orange-500/30 rounded-full text-orange-300 font-semibold text-sm sm:text-base">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Offre  : Analyse gratuite </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AidaMarketingHook;
