
import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TechCard = ({ children, className, title, icon, action }) => {
  return (
    <div className={cn(
      "relative group rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden",
      className
    )}>
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/10" />
      
      {(title || icon) && (
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-emerald-400">{icon}</div>}
            {title && <h3 className="font-bold text-slate-200 tracking-tight">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const StatCard = ({ label, value, trend, icon, color = 'emerald' }) => {
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };

  return (
    <TechCard className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl border", colors[color])}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full",
            trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
    </TechCard>
  );
};
