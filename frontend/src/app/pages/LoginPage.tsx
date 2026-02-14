
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Stethoscope, ArrowLeft, KeyRound } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logo from 'figma:asset/2142bc52670aec246c08f5e53b9fddca1c4539cb.png';

export const LoginPage = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { id: 'PATIENT', title: 'Patient', icon: <User className="w-8 h-8" />, desc: 'Book appointments & view health records' },
    { id: 'RECEPTIONIST', title: 'Receptionist', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Manage queue & clinical operations' },
    { id: 'DOCTOR', title: 'Doctor', icon: <Stethoscope className="w-8 h-8" />, desc: 'View schedule & mark availability' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <ImageWithFallback src={logo} alt="Logo" className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-white tracking-tight">System Access</h2>
          <p className="text-slate-500">Select your role to continue</p>
        </div>

        <div className="space-y-4 mb-8">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                selectedRole === role.id 
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`p-3 rounded-xl ${selectedRole === role.id ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-emerald-400'}`}>
                {role.icon}
              </div>
              <div>
                <h3 className={`font-bold ${selectedRole === role.id ? 'text-emerald-400' : 'text-slate-200'}`}>{role.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{role.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {selectedRole && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="password" 
                placeholder="Enter Access Key (Mock: Any)"
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl py-4 pl-12 pr-4 text-white outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => onLogin(selectedRole)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              Initialize Session
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
