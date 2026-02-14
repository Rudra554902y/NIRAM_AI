/**
 * Logo Component
 * Reusable logo component used throughout the application
 * Uses actual logo image from assets
 */

import React from 'react';
import { motion } from 'motion/react';

const Logo = ({ size = 'md', showText = false, className = '', animated = true }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const LogoImage = animated ? motion.img : 'img';
  const animationProps = animated ? {
    whileHover: { scale: 1.05, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }
  } : {};

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoImage 
        src="/logo.png" 
        alt="NIRAM Logo" 
        className={`${sizes[size]} object-contain`}
        {...animationProps}
      />
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-lg font-bold tracking-tight">NIRAM</div>
          <div className="text-xs text-slate-500">Healthcare System</div>
        </motion.div>
      )}
    </div>
  );
};

export default Logo;
