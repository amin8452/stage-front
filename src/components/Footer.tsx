
import { Shield, Globe, Heart, ExternalLink } from "lucide-react";
import { getCompanyConfig } from "../config/companyConfig";
import MS360Logo from "./ui/MS360Logo";
import ContactInfo from "./ui/ContactInfo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyConfig = getCompanyConfig();

  const links = {
    product: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Comment ça marche", href: "#how-it-works" },
      { name: "Témoignages", href: "#testimonials" },
      { name: "FAQ", href: "#faq" }
    ],
    legal: [
      { name: "Mentions légales", href: "/legal" },
      { name: "Politique de confidentialité", href: "/privacy" },
      { name: "Conditions d'utilisation", href: "/terms" },
      { name: "RGPD", href: "/gdpr" }
    ],
    support: [
      { name: "Centre d'aide", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Status", href: "/status" }
    ]
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-white/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <MS360Logo variant="full" size="lg" />
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              {companyConfig.description}
            </p>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-slate-400 text-sm">RGPD Conforme</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-slate-400 text-sm">🇫🇷 Made in France</span>
              </div>
            </div>

            <ContactInfo
              variant="compact"
              showIcons={true}
              showWebsite={true}
              className="text-sm"
            />
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Produit</h4>
            <ul className="space-y-3">
              {links.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Légal</h4>
            <ul className="space-y-3">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm flex items-center"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              {links.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm flex items-center"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10 mb-8">
          {[
            { label: "Analyses générées", value: "2,500+" },
            { label: "Satisfaction client", value: "97%" },
            { label: "Temps moyen", value: "<3min" },
            { label: "Précision IA", value: "94%" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center text-slate-400 text-sm mb-4 md:mb-0">
            <span>© {currentYear} {companyConfig.name}. Tous droits réservés.</span>
            <Heart className="w-4 h-4 text-red-400 mx-2" />
            <span>Créé avec passion</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              Tous systèmes opérationnels
            </span>
            <a href={companyConfig.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              {companyConfig.domain} • v1.0.0
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
