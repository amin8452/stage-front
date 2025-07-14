
import { Plus, Minus, Bot, Shield, Zap, HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Comment fonctionne l'IA  ?",
      answer: "Notre IA  utilise des algorithmes d'apprentissage profond pour analyser votre profil professionnel, vos ambitions et les données du marché. Elle génère ensuite des prédictions personnalisées sur votre évolution de carrière, identifie vos forces cachées et recommande des stratégies spécifiques à votre secteur d'activité.",
      category: "Technologie"
    },
    {
      question: "Que contient exactement le rapport PDF de 12-15 pages ?",
      answer: "Votre Portrait Prédictif comprend : (1) Analyse approfondie de votre profil professionnel, (2) Prédictions d'évolution sur 3 ans, (3) Identification de vos forces et axes d'amélioration, (4) Recommandations stratégiques personnalisées, (5) Opportunités de croissance spécifiques à votre secteur, (6) Plan d'action concret avec étapes détaillées, (7) Analyse des tendances du marché impactant votre domaine.",
      category: "Contenu"
    },
    {
      question: "Combien de temps faut-il pour recevoir mon rapport ?",
      answer: "Le processus est ultra-rapide ! Après avoir complété le formulaire (2-3 minutes), notre IA  génère votre rapport en moins de 3 minutes. Vous recevez immédiatement un lien de téléchargement et une copie par email. L'ensemble du processus prend moins de 10 minutes du début à la fin.",
      category: "Timing"
    },
    {
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Absolument ! Nous utilisons un cryptage de niveau bancaire (AES-256) pour protéger vos données. Nous sommes conformes au RGPD et ne vendons jamais vos informations à des tiers. Vos données sont utilisées uniquement pour générer votre rapport personnalisé et sont automatiquement supprimées après 30 jours.",
      category: "Sécurité"
    },
    {
      question: "Le rapport est-il vraiment personnalisé ou s'agit-il d'un modèle générique ?",
      answer: "Chaque rapport est 100% unique et personnalisé. L'IA  analyse spécifiquement votre profil, votre secteur, votre poste et vos ambitions pour générer du contenu sur-mesure. Aucun deux rapports ne sont identiques, car ils reflètent votre situation professionnelle unique et vos objectifs personnels.",
      category: "Personnalisation"
    },
    {
      question: "Puis-je télécharger mon rapport plusieurs fois ?",
      answer: "Oui ! Une fois votre rapport généré, vous recevez un lien de téléchargement permanent et une copie par email. Vous pouvez télécharger votre PDF autant de fois que nécessaire pendant 12 mois. Le rapport reste également accessible depuis votre espace client.",
      category: "Accès"
    },
    {
      question: "Que se passe-t-il si je ne suis pas satisfait du rapport ?",
      answer: "Nous garantissons votre satisfaction ! Si le rapport ne répond pas à vos attentes, nous offrons une garantie de remboursement intégral sous 7 jours. De plus, notre équipe peut régénérer votre rapport avec des informations complémentaires si nécessaire.",
      category: "Garantie"
    },
    {
      question: "L'IA peut-elle analyser tous les secteurs d'activité ?",
      answer: "Oui, notre IA  a été entraînée sur des données de plus de 200 secteurs d'activité différents. Que vous soyez dans la tech, la finance, la santé, l'industrie, le commerce ou tout autre domaine, l'IA adapte son analyse aux spécificités de votre secteur et aux tendances actuelles du marché.",
      category: "Secteurs"
    }
  ];

  const categories = [
    { name: "Technologie", icon: Bot, color: "text-purple-400" },
    { name: "Sécurité", icon: Shield, color: "text-emerald-400" },
    { name: "Timing", icon: Zap, color: "text-yellow-400" },
    { name: "Contenu", icon: HelpCircle, color: "text-cyan-400" }
  ];

  return (
    <section id="faq" className="py-32 px-4 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-500/30 rounded-full text-sm font-bold text-blue-300 mb-8">
            <HelpCircle className="w-5 h-5 mr-2" />
            QUESTIONS FRÉQUENTES
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Tout savoir sur notre{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              IA Prédictive
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Réponses détaillées aux questions les plus fréquentes sur notre technologie 
            et notre processus d'analyse prédictive
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300">
              <category.icon className={`w-6 h-6 ${category.color} mx-auto mb-2`} />
              <span className="text-white font-semibold text-sm">{category.name}</span>
            </div>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-3 py-1 rounded-full mr-3">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>
                <div className="ml-6">
                  {openItems.includes(index) ? (
                    <Minus className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Plus className="w-6 h-6 text-slate-400" />
                  )}
                </div>
              </button>

              {openItems.includes(index) && (
                <div className="px-8 pb-6 animate-fade-in">
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Support */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Vous avez d'autres questions ?
          </h3>
          <p className="text-slate-300 mb-6">
            Notre équipe d'experts est disponible pour vous accompagner
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
            <span>📧 support@aiportrait.com</span>
            <span>🕒 Réponse en 2h max</span>
            <span>💬 Chat en direct</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
