/**
 * Patient Dashboard
 * Role: PATIENT
 * 
 * Features:
 * - View upcoming appointments
 * - Book new appointments
 * - View medical history
 * - View prescriptions
 * - Health insights
 * - Profile management
 * 
 * Schema alignment:
 * - Appointment (patientId, doctorId, date, timeSlot, status)
 * - Prescription (medicines, tests, notes, followUpDate)
 * - User (patient details)
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  History,
  User,
  Plus,
  Clock,
  Stethoscope,
  ChevronRight,
  FileText,
  Activity,
  AlertCircle,
  Pill,
  TestTube,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../App.jsx';
import Layout from '../../components/layout/Layout.jsx';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { 
  MOCK_APPOINTMENTS, 
  MOCK_DOCTORS, 
  MOCK_PRESCRIPTIONS,
  generateTimeSlots 
} from '../../services/mockData.js';
import { toast } from 'sonner';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Calendar className="w-5 h-5" /> },
    { id: 'appointments', label: 'My Appointments', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> }
  ];

  // Filter data for current patient
  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.patientId === user._id);
  const myPrescriptions = MOCK_PRESCRIPTIONS.filter(p => p.patientId === user._id);
  const upcomingAppointments = myAppointments.filter(a => a.status === 'BOOKED');
  const pastAppointments = myAppointments.filter(a => a.status === 'COMPLETED');

  const handleBookAppointment = (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast.error('Please fill all fields');
      return;
    }

    const doctor = MOCK_DOCTORS.find(d => d._id === selectedDoctor);
    toast.success(`Appointment booked with ${doctor.name} on ${selectedDate} at ${selectedSlot}`);
    
    // Reset form
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedSlot('');
    setIsBookingModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      BOOKED: 'success',
      COMPLETED: 'info',
      CANCELLED: 'danger',
      RESCHEDULED: 'warning'
    };
    return <Badge variant={statusMap[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Layout
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      menuItems={menuItems}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400">Your health journey is being monitored with NIRAM precision.</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Appointment
          </Button>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Next Appointment"
                value={upcomingAppointments.length > 0 ? upcomingAppointments[0].timeSlot : 'None'}
                icon={<Clock className="w-6 h-6" />}
                color="emerald"
              />
              <StatCard
                label="Total Appointments"
                value={myAppointments.length}
                icon={<Calendar className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                label="Prescriptions"
                value={myPrescriptions.length}
                icon={<FileText className="w-6 h-6" />}
                color="purple"
              />
            </div>

            {/* Upcoming Appointments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                  Upcoming Appointments
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('appointments')}>
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map(appointment => (
                    <Card key={appointment._id} variant="primary">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Stethoscope className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-white">{appointment.doctorName}</p>
                            <p className="text-sm text-slate-400">{appointment.date} • {appointment.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(appointment.status)}
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No upcoming appointments scheduled</p>
                    <Button variant="primary" onClick={() => setIsBookingModalOpen(true)}>
                      <Plus className="w-5 h-5" />
                      Book Your First Appointment
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Health Tips */}
            <Card variant="secondary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 text-blue-400">Daily Wellness Tip</h3>
                  <p className="text-slate-300 leading-relaxed italic mb-3">
                    "Practice mindful breathing for 10 minutes daily to balance your Vata dosha. 
                    Drink warm water first thing in the morning to aid digestion."
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 tracking-wider uppercase">
                    <span>AI Generated</span>
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>Ayurveda Focus</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Appointments</h2>
            
            {/* Upcoming */}
            <div>
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Upcoming</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map(app => (
                    <Card key={app._id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold">{app.doctorName}</p>
                            <p className="text-sm text-slate-500">{app.date} • {app.timeSlot}</p>
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-slate-500 text-center py-8">No upcoming appointments</p>
                </Card>
              )}
            </div>

            {/* Past */}
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-4">Past Appointments</h3>
              {pastAppointments.length > 0 ? (
                <div className="space-y-3">
                  {pastAppointments.map(app => (
                    <Card key={app._id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold">{app.doctorName}</p>
                            <p className="text-sm text-slate-500">{app.date} • {app.timeSlot}</p>
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-slate-500 text-center py-8">No past appointments</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Prescriptions</h2>
            
            {myPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {myPrescriptions.map(prescription => (
                  <Card key={prescription._id}>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-lg">{prescription.doctorName}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="info">ACTIVE</Badge>
                      </div>

                      {/* Medicines */}
                      {prescription.medicines && prescription.medicines.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Pill className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-bold">Medicines</h4>
                          </div>
                          <div className="space-y-2">
                            {prescription.medicines.map((med, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-xs text-slate-500">{med.instructions}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-emerald-400">{med.dosage}</p>
                                  <p className="text-xs text-slate-500">{med.duration}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tests */}
                      {prescription.tests && prescription.tests.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TestTube className="w-5 h-5 text-blue-400" />
                            <h4 className="font-bold">Recommended Tests</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {prescription.tests.map((test, idx) => (
                              <Badge key={idx} variant="info">{test}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {prescription.notes && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <p className="text-sm text-amber-200 italic">{prescription.notes}</p>
                        </div>
                      )}

                      {/* Follow-up */}
                      {prescription.followUpDate && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <CalendarCheck className="w-4 h-4" />
                          <span>Follow-up: {prescription.followUpDate}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No prescriptions found</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-4xl font-bold text-slate-900">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
                    <Badge variant="success">{user.role}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">Phone</label>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">Patient ID</label>
                    <p className="font-mono text-sm">{user._id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">Status</label>
                    <Badge variant="success">{user.status}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book New Appointment"
      >
        <form onSubmit={handleBookAppointment} className="space-y-6">
          {/* Select Doctor */}
          <div>
            <label className="block text-sm font-bold mb-3">Select Doctor</label>
            <div className="space-y-2">
              {MOCK_DOCTORS.map(doctor => (
                <button
                  key={doctor._id}
                  type="button"
                  onClick={() => setSelectedDoctor(doctor._id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedDoctor === doctor._id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <p className="font-bold">{doctor.name}</p>
                  <p className="text-sm text-slate-400">{doctor.specialization}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doctor.startTime} - {doctor.endTime} • {doctor.slotDuration} min slots
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-sm font-bold mb-3">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
              required
            />
          </div>

          {/* Select Time Slot */}
          {selectedDoctor && (
            <div>
              <label className="block text-sm font-bold mb-3">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {generateTimeSlots(
                  MOCK_DOCTORS.find(d => d._id === selectedDoctor)?.startTime || '09:00',
                  MOCK_DOCTORS.find(d => d._id === selectedDoctor)?.endTime || '17:00',
                  MOCK_DOCTORS.find(d => d._id === selectedDoctor)?.slotDuration || 30
                ).slice(0, 12).map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedSlot === slot
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default PatientDashboard;
