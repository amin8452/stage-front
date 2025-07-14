import React from 'react';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { getCompanyConfig } from '../../config/companyConfig';

interface ContactInfoProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showIcons?: boolean;
  showWebsite?: boolean;
  showAddress?: boolean;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  variant = 'horizontal',
  showIcons = true,
  showWebsite = true,
  showAddress = false,
  className = ''
}) => {
  const companyConfig = getCompanyConfig();

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: companyConfig.email,
      href: `mailto:${companyConfig.email}`,
      show: true
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: companyConfig.phone,
      href: `tel:${companyConfig.phone}`,
      show: true
    },
    {
      icon: Globe,
      label: 'Site web',
      value: companyConfig.domain,
      href: companyConfig.website,
      show: showWebsite,
      external: true
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: companyConfig.address,
      href: null,
      show: showAddress
    }
  ].filter(item => item.show);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-4 text-sm ${className}`}>
        <a 
          href={`mailto:${companyConfig.email}`}
          className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {showIcons && <Mail className="w-4 h-4 mr-1" />}
          {companyConfig.email}
        </a>
        {showWebsite && (
          <a 
            href={companyConfig.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {showIcons && <Globe className="w-4 h-4 mr-1" />}
            {companyConfig.domain}
            {showIcons && <ExternalLink className="w-3 h-3 ml-1" />}
          </a>
        )}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`space-y-3 ${className}`}>
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors">
              {showIcons && <Icon className="w-5 h-5 mr-3 text-cyan-400" />}
              <div>
                <div className="font-medium">{item.value}</div>
                <div className="text-xs text-slate-500">{item.label}</div>
              </div>
              {item.external && showIcons && (
                <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
              )}
            </div>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="block"
            >
              {content}
            </a>
          ) : (
            <div key={index}>
              {content}
            </div>
          );
        })}
      </div>
    );
  }

  // Variant 'horizontal' (default)
  return (
    <div className={`flex flex-wrap items-center gap-6 ${className}`}>
      {contactItems.map((item, index) => {
        const Icon = item.icon;
        const content = (
          <div className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors">
            {showIcons && <Icon className="w-4 h-4 mr-2 text-cyan-400" />}
            <span className="text-sm">{item.value}</span>
            {item.external && showIcons && (
              <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
            )}
          </div>
        );

        return item.href ? (
          <a
            key={index}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            {content}
          </a>
        ) : (
          <div key={index}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ContactInfo;
