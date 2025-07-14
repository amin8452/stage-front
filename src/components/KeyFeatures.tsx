
import { Bot, Zap, Shield, Download, Brain, Target, TrendingUp, FileText } from "lucide-react";

const KeyFeatures = () => {
  const features = [
    {
      icon: Bot,
      title: "IA ",
      description: "Analyse prédictive avancée avec l'intelligence artificielle la plus performante du marché.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Brain,
      title: "Analyse Comportementale",
      description: "Compréhension approfondie de vos patterns professionnels et de votre potentiel caché.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Target,
      title: "Prédictions 3 ans",
      description: "Scénarios d'évolution professionnelle basés sur vos données et les tendances du marché.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "Recommandations Stratégiques",
      description: "Plan d'action concret pour maximiser votre impact et accélérer votre croissance.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Génération Ultra-Rapide",
      description: "Votre rapport complet généré en moins de 3 minutes grâce à notre infrastructure IA.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FileText,
      title: "Rapport PDF Premium",
      description: "Document professionnel de 12-15 pages, téléchargeable et personnalisé à votre profil.",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Vos données sont cryptées et protégées selon les standards les plus élevés (RGPD).",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Download,
      title: "Accès Instantané",
      description: "Téléchargement immédiat + envoi par email sécurisé de votre rapport personnalisé.",
      gradient: "from-indigo-500 to-cyan-500"
    }
  ];

  return (
    <section id="features" className="py-32 px-4 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm border border-cyan-500/30 rounded-full text-sm font-bold text-cyan-300 mb-8">
            <Brain className="w-5 h-5 mr-2" />
            FONCTIONNALITÉS AVANCÉES
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Pourquoi choisir notre{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              IA Prédictive
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Une technologie de pointe qui révolutionne l'analyse prédictive professionnelle 
            grâce à l'intelligence artificielle 
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:border-white/30"
            >
              <div className={`inline-flex p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-white/10">
          {[
            { number: "2,500+", label: "Professionnels analysés" },
            { number: "97%", label: "Satisfaction client" },
            { number: "<3min", label: "Temps de génération" },
            { number: "12-15p", label: "Pages de rapport" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-300 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
