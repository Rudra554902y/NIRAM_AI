
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Calendar, ClipboardList, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logo from 'figma:asset/2142bc52670aec246c08f5e53b9fddca1c4539cb.png';

export const LandingPage = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <ImageWithFallback 
            src={logo} 
            alt="NIRAM Logo" 
            className="w-32 h-32 md:w-48 md:h-48 relative drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4"
        >
          NIRAM
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 font-medium"
        >
          The next-generation healthcare operating system. 
          Bridging ancient wisdom with modern precision for clinics that care.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 w-full max-w-4xl"
        >
          {[
            { icon: <Shield className="w-6 h-6" />, label: "Secure RBAC" },
            { icon: <Activity className="w-6 h-6" />, label: "Health Insights" },
            { icon: <Calendar className="w-6 h-6" />, label: "Smart Slots" },
            { icon: <ClipboardList className="w-6 h-6" />, label: "Digital RX" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-emerald-400">{item.icon}</div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative px-8 py-4 bg-emerald-500 text-slate-900 font-bold rounded-full overflow-hidden transition-all flex items-center gap-3"
        >
          <span className="relative z-10">Access Dashboard</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </motion.div>

      <footer className="absolute bottom-8 text-slate-500 text-sm font-medium tracking-wider">
        © 2026 NIRAM SYSTEMS · HACKATHON EDITION v1.0
      </footer>
    </div>
  );
};
