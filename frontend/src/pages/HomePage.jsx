/**
 * NIRAM Home Page
 * Modern SaaS-style landing page for healthcare workflow system
 * 
 * Features:
 * - Hero section with project introduction
 * - Features grid showcasing capabilities
 * - Workflow explanation
 * - Call-to-action buttons
 * - Healthcare-themed design
 * - Fully responsive
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Shield,
  Activity,
  Calendar,
  ClipboardList,
  ArrowRight,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  BellRing
} from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure RBAC",
      description: "Role-based access control for Doctors, Receptionists, and Patients",
      color: "emerald"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Insights",
      description: "AI-powered health monitoring and wellness recommendations",
      color: "blue"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Intelligent appointment booking with conflict detection",
      color: "purple"
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Digital Prescriptions",
      description: "Paperless prescription management with medicine tracking",
      color: "amber"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Queue Management",
      description: "Real-time patient queue and workflow optimization",
      color: "rose"
    },
    {
      icon: <BellRing className="w-6 h-6" />,
      title: "Smart Reminders",
      description: "Automated appointment and medication reminders",
      color: "cyan"
    }
  ];

  const workflow = [
    {
      step: "01",
      title: "Patient Registration",
      description: "Quick onboarding with essential health information",
      icon: <Users className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Smart Booking",
      description: "AI-matched doctor selection and slot booking",
      icon: <Calendar className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Consultation",
      description: "Seamless doctor-patient interaction with digital records",
      icon: <Stethoscope className="w-8 h-8" />
    },
    {
      step: "04",
      title: "Follow-up Care",
      description: "Automated reminders and continuous health monitoring",
      icon: <HeartPulse className="w-8 h-8" />
    }
  ];

  const colorMap = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
            <span className="text-2xl font-bold tracking-tight">NIRAM</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 font-medium transition-all"
          >
            Sign In
          </button>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
              ✨ HEALTHCARE WORKFLOW SYSTEM
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent leading-tight">
              Healthcare Operating
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                System of Tomorrow
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
              NIRAM bridges ancient Ayurvedic wisdom with cutting-edge technology to deliver 
              seamless patient care, intelligent scheduling, and complete workflow automation 
              for modern healthcare practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-emerald-500 text-slate-900 font-bold rounded-full overflow-hidden transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/20"
              >
                <span className="relative z-10">Access Dashboard</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full border-2 border-white/10 hover:border-emerald-500/50 font-bold transition-all flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Appointments", value: "500+" },
              { label: "Active Users", value: "150+" },
              { label: "Doctors", value: "25+" },
              { label: "Success Rate", value: "99%" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to run a modern healthcare practice efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer ${colorMap[feature.color]}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color === 'emerald' ? 'bg-emerald-500 text-slate-900' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Streamlined patient journey from registration to follow-up care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-900 shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
                {i < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border border-white/10 p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Practice?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join modern healthcare providers using NIRAM for seamless workflow management
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-emerald-500 text-slate-900 font-bold rounded-full text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
              >
                Get Started Now
              </motion.button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <span className="text-sm font-medium text-slate-400">
                © 2026 NIRAM Systems. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <button className="hover:text-emerald-400 transition-colors">Privacy</button>
              <button className="hover:text-emerald-400 transition-colors">Terms</button>
              <button className="hover:text-emerald-400 transition-colors">Contact</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
