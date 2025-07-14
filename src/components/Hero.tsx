
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Bot, Download, Play, CheckCircle, Zap, Brain } from "lucide-react";

const Hero = () => {
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm border border-cyan-500/30 rounded-full text-sm font-bold text-cyan-300 mb-8 animate-fade-in shadow-lg">
          <Bot className="w-5 h-5 mr-2 animate-pulse" />
          • IA PRÉDICTIVE • GÉNÉRATION INSTANTANÉE
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-fade-in">
          Votre{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Portrait Prédictif IA
          </span>{" "}
          en 3 minutes
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
          Découvrez votre potentiel professionnel avec un rapport de{" "}
          <span className="font-bold text-cyan-400">12-15 pages</span> généré par l'IA .
          <br />
          Prédictions, recommandations stratégiques et plan d'action personnalisé.
        </p>

        {/* Features List */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto animate-fade-in">
          {[
            { icon: Brain, text: "Analyse IA ", color: "text-purple-400" },
            { icon: Zap, text: "Génération <3 minutes", color: "text-yellow-400" },
            { icon: CheckCircle, text: "Rapport PDF Premium", color: "text-emerald-400" }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-3`} />
              <p className="text-white font-semibold">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in">
          <Button
            onClick={() => scrollToSection('#lead-form')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-cyan-500/25"
          >
            <Bot className="w-6 h-6 mr-3" />
            Générer mon Portrait IA
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <Button
            onClick={() => scrollToSection('#video')}
            variant="outline"
            className="border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Voir la démo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-slate-400 text-sm animate-fade-in">
          <p className="mb-2">✓ 100% Sécurisé • ✓ IA  • ✓ Livraison instantanée</p>
          <p>Déjà utilisé par 2,500+ professionnels</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
