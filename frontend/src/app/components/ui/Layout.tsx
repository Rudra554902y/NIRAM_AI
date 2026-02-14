
import React from 'react';
import { motion } from 'motion/react';
import { 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  User, 
  Settings, 
  Bell, 
  Search,
  Activity
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logo from 'figma:asset/2142bc52670aec246c08f5e53b9fddca1c4539cb.png';

export const Layout = ({ children, user, onLogout, activeTab, onTabChange, menuItems }) => {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <ImageWithFallback src={logo} alt="Niram" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            NIRAM
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Session</p>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search patient, records, or appointments..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#020617]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
