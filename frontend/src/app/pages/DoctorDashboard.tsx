
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  CalendarOff, 
  Stethoscope, 
  Clock, 
  User, 
  FileText,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import { TechCard, StatCard } from '../components/ui/TechCard';
import { MOCK_APPOINTMENTS } from '../data/mockData';
import { toast } from 'sonner';

export const DoctorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isMarkingLeave, setIsMarkingLeave] = useState(false);

  const menuItems = [
    { id: 'schedule', label: 'My Schedule', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'patients', label: 'Patient History', icon: <Search className="w-5 h-5" /> },
    { id: 'leave', label: 'Availability', icon: <CalendarOff className="w-5 h-5" /> },
  ];

  const today = '2026-02-14';
  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.doctorId === user.id && a.date === today);

  const handleMarkLeave = (e) => {
    e.preventDefault();
    toast.info('Leave request submitted. Reception has been notified.');
    setIsMarkingLeave(false);
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Clinical Overview</h1>
            <p className="text-slate-400">Welcome, {user.name}. Here is your consultation roadmap for today.</p>
          </div>
          <button 
            onClick={() => setActiveTab('leave')}
            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all"
          >
            <CalendarOff className="w-5 h-5" />
            Mark Leave
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Today's Slots" value={myAppointments.length} icon={<Clock className="w-5 h-5" />} color="blue" />
          <StatCard label="Completed" value={myAppointments.filter(a => a.status === 'COMPLETED').length} icon={<Award className="w-5 h-5" />} color="emerald" />
          <StatCard label="Avg. Time" value="18m" icon={<TrendingUp className="w-5 h-5" />} color="amber" />
          <StatCard label="Next Patient" value={myAppointments.find(a => a.status === 'BOOKED')?.timeSlot || '--:--'} icon={<User className="w-5 h-5" />} color="rose" />
        </div>

        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                Patient Queue
              </h2>
              
              <div className="space-y-4">
                {myAppointments.map(app => (
                  <TechCard key={app.id} className={app.status === 'COMPLETED' ? 'opacity-60' : 'border-l-4 border-l-blue-500'}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center w-16">
                          <p className="text-lg font-bold text-white">{app.timeSlot}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Arrival</p>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div>
                          <p className="font-bold text-slate-200">{app.patientName}</p>
                          <p className="text-xs text-slate-500">ID: {app.patientId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {app.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                            <Award className="w-3 h-3" />
                            Session Over
                          </span>
                        ) : (
                          <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                            View Case History
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </TechCard>
                ))}
                {myAppointments.length === 0 && (
                  <div className="p-16 text-center rounded-3xl bg-white/5 border border-dashed border-white/10">
                    <CalendarCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No appointments scheduled for today yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Quick Insights</h2>
              <TechCard title="Clinic Performance" icon={<TrendingUp className="w-5 h-5" />}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>Daily Capacity</span>
                      <span className="text-slate-300">75%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>Patient Satisfaction</span>
                      <span className="text-slate-300">92%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </TechCard>

              <TechCard className="bg-emerald-500/5 border-emerald-500/10">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-400 mb-1">Clinic Notice</h4>
                    <p className="text-sm text-slate-400">The maintenance work on the pathology lab has been extended to Monday. All sample collections will be routed via the emergency ward.</p>
                  </div>
                </div>
              </TechCard>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Manage Availability</h2>
            <TechCard>
              <form onSubmit={handleMarkLeave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Leave Date</label>
                  <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white [color-scheme:dark] outline-none focus:border-rose-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reason (Optional)</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-rose-500 transition-all">
                    <option value="medical">Medical Leave</option>
                    <option value="personal">Personal Reasons</option>
                    <option value="emergency">Family Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                  <p className="text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Marking leave will automatically block your slots for the selected date.
                  </p>
                </div>
                <button type="submit" className="w-full py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:bg-rose-400 transition-all">
                  Request Leave Authorization
                </button>
              </form>
            </TechCard>
          </div>
        )}
      </div>
    </Layout>
  );
};
