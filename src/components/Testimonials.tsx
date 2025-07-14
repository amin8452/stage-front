
import { Star, Quote, Bot, TrendingUp } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "CEO, TechStart",
      sector: "Technologie",
      content: "Le rapport IA a révélé des opportunités que je n'avais jamais envisagées. Les prédictions sur 3 ans se sont révélées étonnamment précises et m'ont aidée à pivoter ma stratégie d'entreprise au bon moment.",
      rating: 5,
      highlight: "Révélateur d'opportunités"
    },
    {
      name: "Alexandre Dubois",
      role: "Directeur Marketing",
      sector: "E-commerce",
      content: "L'analyse comportementale de Ai a identifié mes forces cachées en leadership. Grâce aux recommandations, j'ai été promu en 6 mois et mon équipe a augmenté ses performances de 40%.",
      rating: 5,
      highlight: "Promotion en 6 mois"
    },
    {
      name: "Marie Lefebvre",
      role: "Consultante Senior",
      sector: "Finance",
      content: "Le plan d'action était si précis que j'ai pu restructurer complètement mon approche client. Mes revenus ont doublé en un an grâce aux stratégies recommandées par l'IA.",
      rating: 5,
      highlight: "Revenus doublés"
    },
    {
      name: "Thomas Bernard",
      role: "CTO",
      sector: "FinTech",
      content: "Les prédictions technologiques m'ont permis d'anticiper les tendances du marché. J'ai investi dans les bonnes compétences au bon moment et mon équipe est maintenant leader sur notre segment.",
      rating: 5,
      highlight: "Leader du marché"
    },
    {
      name: "Camille Rousseau",
      role: "Entrepreneur",
      sector: "Santé digitale",
      content: "L'IA a analysé mon profil et m'a conseillé de me spécialiser dans l'IA médicale. Ma startup a levé 2M€ en suivant exactement la roadmap suggérée dans le rapport.",
      rating: 5,
      highlight: "Levée de 2M€"
    },
    {
      name: "Nicolas Moreau",
      role: "VP Sales",
      sector: "SaaS",
      content: "Les insights comportementaux ont transformé ma façon de gérer mon équipe. Nous avons dépassé nos objectifs de 150% en appliquant les recommandations de communication de l'IA.",
      rating: 5,
      highlight: "+150% objectifs"
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-4 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-bold text-purple-300 mb-8">
            <Star className="w-5 h-5 mr-2" />
            TÉMOIGNAGES CLIENTS
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Des résultats{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              extraordinaires
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Découvrez comment notre IA  v3 a transformé la carrière de nos clients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:border-white/30 group"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-purple-400/50 absolute -top-2 -left-2" />
                <p className="text-slate-300 leading-relaxed pl-6 group-hover:text-slate-200 transition-colors duration-300">
                  {testimonial.content}
                </p>
              </div>

              {/* Highlight */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-3 mb-6">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="text-emerald-400 font-bold text-sm">
                    {testimonial.highlight}
                  </span>
                </div>
              </div>

              {/* Author */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-white font-bold mb-1 group-hover:text-purple-400 transition-colors duration-300">
                  {testimonial.name}
                </h4>
                <p className="text-slate-400 text-sm mb-1">{testimonial.role}</p>
                <p className="text-purple-400 text-sm font-semibold">{testimonial.sector}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-purple-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">
              Rejoignez ces professionnels d'exception
            </h3>
          </div>
          <p className="text-slate-300 mb-6">
            Découvrez votre potentiel caché avec notre IA 
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
            <span>⭐ 4.9/5 satisfaction</span>
            <span>🚀 2,500+ analyses</span>
            <span>⚡ Résultats en 3min</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
