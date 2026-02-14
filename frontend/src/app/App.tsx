
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { ReceptionDashboard } from './pages/ReceptionDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');

  // Simple routing simulation
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const login = (role) => {
    const mockUsers = {
      PATIENT: { id: 'p1', name: 'John Doe', role: 'PATIENT', email: 'john@example.com' },
      RECEPTIONIST: { id: 'r1', name: 'Sarah Miller', role: 'RECEPTIONIST', email: 'sarah@niram.com' },
      DOCTOR: { id: 'd1', name: 'Dr. Alok Sharma', role: 'DOCTOR', email: 'alok@niram.com', specialization: 'Ayurveda' },
    };
    setUser(mockUsers[role]);
    if (role === 'PATIENT') navigate('patient-dashboard');
    if (role === 'RECEPTIONIST') navigate('reception-dashboard');
    if (role === 'DOCTOR') navigate('doctor-dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('landing');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Toaster position="top-right" richColors theme="dark" />
      
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={() => navigate('login')} />
          </motion.div>
        )}

        {currentPage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <LoginPage onLogin={login} onBack={() => navigate('landing')} />
          </motion.div>
        )}

        {currentPage === 'patient-dashboard' && user?.role === 'PATIENT' && (
          <motion.div
            key="patient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PatientDashboard user={user} onLogout={logout} />
          </motion.div>
        )}

        {currentPage === 'reception-dashboard' && user?.role === 'RECEPTIONIST' && (
          <motion.div
            key="reception"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ReceptionDashboard user={user} onLogout={logout} />
          </motion.div>
        )}

        {currentPage === 'doctor-dashboard' && user?.role === 'DOCTOR' && (
          <motion.div
            key="doctor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DoctorDashboard user={user} onLogout={logout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
