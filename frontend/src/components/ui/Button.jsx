/**
 * Reusable Button Component
 * Standardized button styles across the application
 */

import React from 'react';
import { motion } from 'motion/react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/20',
    secondary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20',
    outline: 'bg-transparent border-2 border-white/10 hover:border-emerald-500/50 text-slate-200',
    ghost: 'bg-white/5 hover:bg-white/10 text-slate-200',
    danger: 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        font-bold rounded-xl transition-all flex items-center justify-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
