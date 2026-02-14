
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FilePlus,
  ArrowUpRight,
  Filter,
  RefreshCcw,
  UserPlus
} from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import { TechCard, StatCard } from '../components/ui/TechCard';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../data/mockData';
import { toast } from 'sonner';

export const ReceptionDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPrescribing, setIsPrescribing] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const menuItems = [
    { id: 'queue', label: 'Today’s Queue', icon: <Users className="w-5 h-5" /> },
    { id: 'appointments', label: 'All Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'patients', label: 'Patient Directory', icon: <Filter className="w-5 h-5" /> },
  ];

  const today = '2026-02-14';
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === today);
  
  const handleMarkComplete = (app) => {
    setSelectedAppointment(app);
    setIsPrescribing(true);
  };

  const submitPrescription = (e) => {
    e.preventDefault();
    toast.success('Prescription saved. Appointment marked as COMPLETED.');
    setIsPrescribing(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (app) => {
    setSelectedAppointment(app);
    setIsRescheduling(true);
  };

  return (
    <Layout 
      user={user} 
      onLogout={onLogout} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      menuItems={menuItems}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Clinic Flow Control</h1>
            <p className="text-slate-400">Manage patient intake, scheduling, and digital records.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/5 border border-white/10 text-slate-200 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <UserPlus className="w-5 h-5" />
              Register Patient
            </button>
            <button className="bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
              <Plus className="w-5 h-5" />
              New Booking
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Today's Total" value={todayAppointments.length} icon={<Users className="w-5 h-5" />} color="emerald" />
          <StatCard label="Pending" value={todayAppointments.filter(a => a.status === 'BOOKED').length} icon={<Clock className="w-5 h-5" />} color="amber" />
          <StatCard label="Completed" value={todayAppointments.filter(a => a.status === 'COMPLETED').length} icon={<CheckCircle2 className="w-5 h-5" />} color="blue" />
          <StatCard label="Doctor On Leave" value="0" icon={<AlertCircle className="w-5 h-5" />} color="rose" />
        </div>

        <TechCard className="min-h-[500px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-emerald-500 animate-spin-slow" />
              Live Queue Tracker
            </h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search patient name or ID..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="pb-4 px-4">Time Slot</th>
                  <th className="pb-4 px-4">Patient Details</th>
                  <th className="pb-4 px-4">Consultant</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {todayAppointments
                  .filter(a => a.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((app) => (
                  <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="font-mono text-sm font-bold text-slate-300">{app.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {app.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">{app.patientName}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">ID: {app.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
                        {app.doctorName}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                        app.status === 'COMPLETED' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'BOOKED' && (
                          <>
                            <button 
                              onClick={() => handleMarkComplete(app)}
                              className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all"
                              title="Digitize Prescription"
                            >
                              <FilePlus className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReschedule(app)}
                              className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-slate-950 transition-all"
                              title="Reschedule"
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TechCard>
      </div>

      {/* Prescription Entry Modal */}
      <AnimatePresence>
        {isPrescribing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrescribing(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Digital Prescription Entry</h2>
                <p className="text-slate-400">Digitizing for <span className="text-emerald-400 font-bold">{selectedAppointment?.patientName}</span></p>
              </div>

              <form onSubmit={submitPrescription} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Appointment ID</p>
                    <p className="text-sm text-slate-200 font-mono">{selectedAppointment?.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Consulting Doctor</p>
                    <p className="text-sm text-slate-200">{selectedAppointment?.doctorName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Medication Details
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <input placeholder="Medicine Name" className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      <input placeholder="Dosage (e.g. 1-0-1)" className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                      <input placeholder="Duration" className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-blue-400">Laboratory Tests</h4>
                  <textarea placeholder="Recommended tests (comma separated)..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm min-h-[80px]" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-400">Clinical Notes</h4>
                  <textarea placeholder="Enter doctor's observations..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm min-h-[100px]" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsPrescribing(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold">Discard</button>
                  <button type="submit" className="flex-2 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold shadow-lg shadow-emerald-500/20">Finalize & Complete</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isRescheduling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRescheduling(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl p-8">
                <h2 className="text-xl font-bold mb-2">Reschedule Appointment</h2>
                <p className="text-slate-500 text-sm mb-6">Patient: {selectedAppointment?.patientName}</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">New Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Available Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['10:00', '10:15', '10:30', '11:00', '11:15', '11:30'].map(s => (
                        <button key={s} className="py-2 bg-white/5 border border-white/5 rounded-lg text-xs hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3">
                    <button onClick={() => setIsRescheduling(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-bold text-sm">Cancel</button>
                    <button onClick={() => {toast.success('Rescheduled!'); setIsRescheduling(false);}} className="flex-1 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold text-sm">Save Change</button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
