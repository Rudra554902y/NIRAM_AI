/**
 * Logo Component
 * Reusable logo component used throughout the application
 * Uses actual logo image from assets
 */

import React from 'react';

const Logo = ({ size = 'md', showText = false, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="NIRAM Logo" 
        className={`${sizes[size]} object-contain`}
      />
      {showText && (
        <div>
          <div className="text-lg font-bold tracking-tight">NIRAM</div>
          <div className="text-xs text-slate-500">Healthcare System</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
