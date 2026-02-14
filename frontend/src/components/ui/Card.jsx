/**
 * Reusable Card Component
 * Consistent card styling across the application
 */

import React from 'react';
import { motion } from 'motion/react';

export const Card = ({ children, className = '', variant = 'default', animated = true, ...props }) => {
  const variants = {
    default: 'bg-white/5 border border-white/10',
    primary: 'bg-emerald-500/5 border border-emerald-500/20',
    secondary: 'bg-blue-500/5 border border-blue-500/20',
    warning: 'bg-amber-500/5 border border-amber-500/20',
    danger: 'bg-red-500/5 border border-red-500/20'
  };

  const CardWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <CardWrapper
      className={`p-6 rounded-2xl backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 ${variants[variant]} ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </CardWrapper>
  );
};

export const StatCard = ({ label, value, icon, trend, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10'
  };

  return (
    <Card animated={true}>
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`p-3 rounded-xl ${colorClasses[color]}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        {trend && (
          <motion.div 
            className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-3xl font-bold mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-500 uppercase tracking-wider">{label}</div>
    </Card>
  );
};

export default Card;
