
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  History, 
  FileText, 
  User, 
  Plus, 
  Clock, 
  MapPin, 
  Stethoscope,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import { TechCard, StatCard } from '../components/ui/TechCard';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PRESCRIPTIONS } from '../data/mockData';
import { toast } from 'sonner';

export const PatientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Calendar className="w-5 h-5" /> },
    { id: 'history', label: 'Medical History', icon: <History className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
  ];

  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.patientId === user.id);
  const myPrescriptions = MOCK_PRESCRIPTIONS.filter(p => p.patientId === user.id);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast.error('Please complete all booking fields');
      return;
    }
    toast.success('Appointment booked successfully!');
    setIsBooking(false);
  };

  return (
    <Layout 
      user={user} 
      onLogout={onLogout} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      menuItems={menuItems}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user.name}</h1>
            <p className="text-slate-400">Your health journey is being monitored with NIRAM precision.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBooking(true)}
            className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" />
            Book New Appointment
          </motion.button>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats */}
            <StatCard 
              label="Next Session" 
              value={myAppointments.find(a => a.status === 'BOOKED')?.timeSlot || 'None'} 
              icon={<Clock className="w-6 h-6" />}
              color="emerald"
            />
            <StatCard 
              label="Prescriptions" 
              value={myPrescriptions.length} 
              icon={<FileText className="w-6 h-6" />}
              color="blue"
            />
            <StatCard 
              label="Health Score" 
              value="84" 
              trend={12}
              icon={<Activity className="w-6 h-6" />}
              color="amber"
            />

            {/* Upcoming Appointments */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Upcoming Appointments
              </h2>
              {myAppointments.filter(a => a.status === 'BOOKED').length > 0 ? (
                myAppointments.filter(a => a.status === 'BOOKED').map(app => (
                  <TechCard key={app.id} className="border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{app.doctorName}</p>
                          <p className="text-xs text-slate-500">{app.date} at {app.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">CONFIRMED</span>
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                  </TechCard>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl bg-white/5 border border-dashed border-white/10">
                  <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No upcoming appointments scheduled.</p>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                Wellness Tips
              </h2>
              <TechCard className="bg-blue-500/5 border-blue-500/20">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Maintain a regular sleep schedule to balance your Vata dosha. Try drinking warm water first thing in the morning."
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-400 tracking-widest uppercase">
                  <span>AI Generated</span>
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>Ayurveda Focus</span>
                </div>
              </TechCard>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Past Prescriptions & Records</h2>
            {myPrescriptions.map(presc => (
              <TechCard key={presc.id} title={`Prescription from ${presc.createdAt.split('T')[0]}`} icon={<FileText className="w-5 h-5 text-blue-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Medicines</h4>
                    <div className="space-y-2">
                      {presc.medicines.map((med, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <div>
                            <p className="text-sm font-bold text-slate-200">{med.name}</p>
                            <p className="text-xs text-slate-500">{med.duration}</p>
                          </div>
                          <span className="text-xs font-mono text-emerald-400">{med.dosage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Tests</h4>
                    <div className="flex flex-wrap gap-2">
                      {presc.tests.map((test, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/20">
                          {test}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Doctor Notes</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{presc.notes}</p>
                    </div>
                  </div>
                </div>
              </TechCard>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBooking(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5">
                <h2 className="text-2xl font-bold">Schedule Consultation</h2>
                <p className="text-slate-400 text-sm">Choose your preferred doctor and time slot.</p>
              </div>
              
              <form onSubmit={handleBooking} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Specialist</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                      value={selectedDoctor || ''}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="" disabled>Choose a doctor</option>
                      {MOCK_DOCTORS.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Appointment Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500 text-white [color-scheme:dark]"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">Available Slots</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          selectedSlot === slot 
                            ? 'bg-emerald-500 text-slate-950 font-bold' 
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsBooking(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
