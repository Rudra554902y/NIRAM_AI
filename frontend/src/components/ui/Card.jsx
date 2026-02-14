/**
 * Reusable Card Component
 * Consistent card styling across the application
 */

import React from 'react';

export const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white/5 border border-white/10',
    primary: 'bg-emerald-500/5 border border-emerald-500/20',
    secondary: 'bg-blue-500/5 border border-blue-500/20',
    warning: 'bg-amber-500/5 border border-amber-500/20',
    danger: 'bg-red-500/5 border border-red-500/20'
  };

  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
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
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-slate-500 uppercase tracking-wider">{label}</div>
    </Card>
  );
};

export default Card;
