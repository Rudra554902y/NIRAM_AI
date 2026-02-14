/**
 * NIRAM Login Page
 * Role-based authentication interface
 * 
 * Features:
 * - Three distinct role buttons (Patient, Doctor, Receptionist)
 * - Icon-based visual distinction
 * - Mock authentication (no backend)
 * - Automatic redirect to role-specific dashboard
 * - Healthcare-themed design
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, ShieldCheck, Stethoscope, ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { useAuth } from '../../App.jsx';
import { toast } from 'sonner';
import Logo from '../../components/ui/Logo.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [accessKey, setAccessKey] = useState('');

  const roles = [
    {
      id: 'PATIENT',
      title: 'Patient',
      icon: <User className="w-10 h-10" />,
      description: 'Book appointments & view health records',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      userId: 'p1',
      accessKey: 'patient@2026'
    },
    {
      id: 'RECEPTIONIST',
      title: 'Receptionist',
      icon: <ShieldCheck className="w-10 h-10" />,
      description: 'Manage queue & clinical operations',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      userId: 'r1',
      accessKey: 'reception@2026'
    },
    {
      id: 'DOCTOR',
      title: 'Doctor',
      icon: <Stethoscope className="w-10 h-10" />,
      description: 'View schedule & manage consultations',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      userId: 'd1',
      accessKey: 'doctor@2026'
    }
  ];

  const handleLogin = () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    // Mock authentication - any key works
    const user = login(selectedRole);
    toast.success(`Welcome, ${user.name}!`);

    // Redirect to role-specific dashboard
    const roleRoutes = {
      PATIENT: '/patient',
      DOCTOR: '/doctor',
      RECEPTIONIST: '/receptionist'
    };
    
    navigate(roleRoutes[selectedRole]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4">
            <Logo size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">System Access</h1>
          <p className="text-slate-400 text-lg">Select your role to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-center group overflow-hidden ${
                selectedRole === role.id
                  ? `bg-${role.color}-500/10 border-${role.color}-500 shadow-lg shadow-${role.color}-500/20`
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              {/* Background gradient on select */}
              {selectedRole === role.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5`} />
              )}

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${
                    selectedRole === role.id
                      ? `bg-gradient-to-br ${role.gradient} text-white shadow-lg`
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {role.icon}
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-bold mb-2 transition-colors ${
                    selectedRole === role.id ? `text-${role.color}-400` : 'text-slate-200'
                  }`}
                >
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Selection indicator */}
              {selectedRole === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}
                >
                  <LogIn className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Access Key Input (Appears when role is selected) */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            {/* Display selected role credentials */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div>
                <p className="text-xs text-slate-500">User ID</p>
                <p className="text-sm font-mono text-emerald-400">{roles.find(r => r.id === selectedRole)?.userId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Access Key</p>
                <p className="text-sm font-mono text-blue-400">{roles.find(r => r.id === selectedRole)?.accessKey}</p>
              </div>
            </div>

            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                placeholder="Enter Access Key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-slate-900 border border-white/10 focus:border-emerald-500 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Initialize Session</span>
              <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-xs text-slate-500 text-center">
              🔒 Use the access key shown above or any key to login
            </p>
          </motion.div>
        )}

        {/* Info Card - Credentials */}
        {!selectedRole && (
          <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm text-blue-400 font-bold text-center mb-4">Preview Mode Credentials</p>
            <div className="grid gap-3">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white scale-75`}>
                      {role.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">{role.title}</p>
                      <p className="text-xs text-slate-500">User ID: <span className="text-emerald-400 font-mono">{role.userId}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Access Key</p>
                    <p className="text-sm font-mono text-blue-400">{role.accessKey}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-slate-600 tracking-wider">
        NIRAM HEALTHCARE v1.0 • SECURE AUTHENTICATION
      </div>
    </div>
  );
};

export default LoginPage;
