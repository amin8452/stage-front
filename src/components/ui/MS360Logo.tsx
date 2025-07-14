import React from 'react';
import { getCompanyConfig } from '../../config/companyConfig';

interface MS360LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'simple' | 'icon';
  className?: string;
}

const MS360Logo: React.FC<MS360LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const companyConfig = getCompanyConfig();
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <rect x="3" y="3" width="6" height="6" fill="currentColor" rx="1"/>
            <rect x="15" y="3" width="6" height="6" fill="currentColor" rx="1"/>
            <rect x="3" y="15" width="6" height="6" fill="currentColor" rx="1"/>
            <rect x="15" y="15" width="6" height="6" fill="currentColor" rx="1"/>
            <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="18" y1="9" x2="18" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <span className={`font-bold text-blue-600 ${textSizes[size]}`}>
          {companyConfig.name}
        </span>
      </div>
    );
  }

  // Variant 'full' - logo complet
  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <rect x="3" y="3" width="6" height="6" fill="currentColor" rx="1"/>
          <rect x="15" y="3" width="6" height="6" fill="currentColor" rx="1"/>
          <rect x="3" y="15" width="6" height="6" fill="currentColor" rx="1"/>
          <rect x="15" y="15" width="6" height="6" fill="currentColor" rx="1"/>
          <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="18" y1="9" x2="18" y2="15" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <div>
        <span className={`font-bold text-white ${textSizes[size]}`}>
          {companyConfig.name}
          <span className="text-cyan-400 ml-1">AI</span>
        </span>
        {size !== 'sm' && (
          <p className="text-slate-400 text-xs">
            {companyConfig.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

export default MS360Logo;
