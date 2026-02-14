/**
 * NIRAM Healthcare Workflow System
 * Main Application Entry Point
 * 
 * Architecture Notes:
 * - Converted from TypeScript to JavaScript for simplicity
 * - Implements role-based access control (RBAC)
 * - Three user roles: PATIENT, DOCTOR, RECEPTIONIST
 * - Uses React Router for proper routing
 * - Mock authentication for preview mode
 */

import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import PatientDashboard from './pages/patient/PatientDashboard.jsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import ReceptionistDashboard from './pages/reception/ReceptionistDashboard.jsx';

// Authentication Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);

  // Mock login - credentials match schema from requirements
  const login = (role, credentials) => {
    const mockUsers = {
      PATIENT: {
        _id: 'p1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91-9876543210',
        role: 'PATIENT',
        status: 'ACTIVE'
      },
      DOCTOR: {
        _id: 'd1',
        name: 'Dr. Alok Sharma',
        email: 'alok.sharma@niram.health',
        phone: '+91-9876543201',
        role: 'DOCTOR' ,
        status: 'ACTIVE',
        specialization: 'Ayurvedic Medicine',
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      },
      RECEPTIONIST: {
        _id: 'r1',
        name: 'Sarah Miller',
        email: 'sarah.miller@niram.health',
        phone: '+91-9876543202',
        role: 'RECEPTIONIST',
        status: 'ACTIVE'
      }
    };
    
    setUser(mockUsers[role]);
    return mockUsers[role];
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <Toaster position="top-right" richColors theme="dark" />
        
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Patient Routes */}
            <Route 
              path="/patient/*" 
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path="/doctor/*" 
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Receptionist Routes */}
            <Route 
              path="/receptionist/*" 
              element={
                <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
