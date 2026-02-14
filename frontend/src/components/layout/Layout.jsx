/**
 * Shared Layout Component for NIRAM Dashboards
 * Provides consistent navigation and structure across role-based dashboards
 * 
 * Features:
 * - Responsive sidebar navigation
 * - User profile display
 * - Logout functionality
 * - Mobile-friendly collapsible menu
 * - Role-appropriate branding
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Menu, X } from 'lucide-react';
import Logo from '../ui/Logo.jsx';

const Layout = ({ user, children, menuItems, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role) => {
    const colors = {
      PATIENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      DOCTOR: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      RECEPTIONIST: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    return colors[role] || 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900/50 border-r border-white/10 flex-col backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          {/* Logo */}
          <div className="mb-6">
            <Logo size="lg" showText={true} />
          </div>

          {/* User Info */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-slate-900 text-lg">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="font-bold">NIRAM</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-slate-900/95 backdrop-blur-lg"
            >
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-slate-900">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>

                {/* Menu Items */}
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                {/* Logout */}
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
