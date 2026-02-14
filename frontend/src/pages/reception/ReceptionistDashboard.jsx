/**
 * Receptionist Dashboard
 * Role: RECEPTIONIST
 * 
 * Features:
 * - Manage patient queue
 * - Book appointments for walk-ins
 * - View all doctors' schedules  
 * - Check-in patients
 * - Manage appointment status
 * 
 * Schema alignment:
 * - Queue management
 * - Appointment creation and updates
 * - Patient registration
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Calendar,
  Clock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  CalendarPlus,
  List
} from 'lucide-react';
import { useAuth } from '../../App.jsx';
import Layout from '../../components/layout/Layout.jsx';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_QUEUE, MOCK_PATIENTS } from '../../services/mockData.js';
import { toast } from 'sonner';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('queue');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const menuItems = [
    { id: 'queue', label: 'Patient Queue', icon: <List className="w-5 h-5" /> },
    { id: 'appointments', label: 'All Appointments', icon: <Calendar className="w-5 h-5" /> },
    { id: 'doctors', label: 'Doctor Schedule', icon: <Stethoscope className="w-5 h-5" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" /> }
  ];

  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === '2026-02-14');
  const pendingCheckIn = todayAppointments.filter(a => a.status === 'BOOKED');

  const handleCheckIn = (appointmentId) => {
    toast.success('Patient checked in successfully!');
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    toast.success('Appointment booked successfully!');
    setIsBookingModalOpen(false);
  };

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    toast.success('Patient registered successfully!');
    setIsRegisterModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const map = { 
      BOOKED: 'warning', 
      COMPLETED: 'success', 
      CANCELLED: 'danger', 
      WAITING: 'info',
      CHECKED_IN: 'purple'
    };
    return <Badge variant={map[status] || 'default'}>{status}</Badge>;
  };

  const getQueueStatusBadge = (status) => {
    const map = {
      WAITING: 'warning',
      CHECKED_IN: 'success',
      IN_CONSULTATION: 'info',
      COMPLETED: 'default'
    };
    return <Badge variant={map[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Layout user={user} activeTab={activeTab} onTabChange={setActiveTab} menuItems={menuItems}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Reception Dashboard 📋
            </h1>
            <p className="text-slate-400">Manage clinic operations • {user.name}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={<UserPlus className="w-5 h-5" />} onClick={() => setIsRegisterModalOpen(true)}>
              Register Patient
            </Button>
            <Button variant="primary" icon={<CalendarPlus className="w-5 h-5" />} onClick={() => setIsBookingModalOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </header>

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="In Queue"
                value={MOCK_QUEUE.length}
                icon={<Users className="w-6 h-6" />}
                color="emerald"
              />
              <StatCard
                label="Checked In"
                value={MOCK_QUEUE.filter(q => q.status === 'CHECKED_IN').length}
                icon={<CheckCircle2 className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                label="Waiting"
                value={MOCK_QUEUE.filter(q => q.status === 'WAITING').length}
                icon={<Clock className="w-6 h-6" />}
                color="amber"
              />
              <StatCard
                label="Today's Total"
                value={todayAppointments.length}
                icon={<Calendar className="w-6 h-6" />}
                color="purple"
              />
            </div>

            {/* Queue List */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <List className="w-6 h-6 text-emerald-400" />
                Current Queue
              </h2>

              {MOCK_QUEUE.length > 0 ? (
                <div className="space-y-3">
                  {MOCK_QUEUE.map(item => (
                    <Card key={item._id} variant={item.status === 'WAITING' ? 'warning' : 'default'}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl font-bold text-emerald-400 w-16 text-center">
                            #{item.queuePosition}
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                            {item.patientName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold">{item.patientName}</p>
                            <p className="text-sm text-slate-400">
                              {item.doctorName} • {item.timeSlot}
                            </p>
                            <p className="text-xs text-slate-500">
                              Arrived: {new Date(item.arrivedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getQueueStatusBadge(item.status)}
                          {item.status === 'WAITING' && (
                            <Button size="sm" variant="primary" onClick={() => handleCheckIn(item._id)}>
                              Check In
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No patients in queue</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">All Appointments Today</h2>
            
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map(appointment => (
                  <Card key={appointment._id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{appointment.patientName}</p>
                          <p className="text-sm text-slate-400">
                            {appointment.doctorName} • {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        {appointment.status === 'BOOKED' && (
                          <Button size="sm" variant="primary" onClick={() => handleCheckIn(appointment._id)}>
                            Check In
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-center py-12 text-slate-500">No appointments today</p>
              </Card>
            )}
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Doctor Schedules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_DOCTORS.map(doctor => {
                const doctorApps = todayAppointments.filter(a => a.doctorId === doctor._id);
                
                return (
                  <Card key={doctor._id}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Stethoscope className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{doctor.name}</p>
                            <p className="text-sm text-slate-400">{doctor.specialization}</p>
                          </div>
                        </div>
                        <Badge variant="success">AVAILABLE</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Office Hours</p>
                          <p className="font-bold">{doctor.startTime} - {doctor.endTime}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Today's Patients</p>
                          <p className="font-bold text-emerald-400">{doctorApps.length}</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-2">UPCOMING SLOTS</p>
                        <div className="flex flex-wrap gap-2">
                          {doctorApps.slice(0, 4).map((app, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">
                              {app.timeSlot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Registered Patients</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PATIENTS.map(patient => (
                <Card key={patient._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{patient.name}</p>
                        <p className="text-sm text-slate-500">{patient.phone}</p>
                      </div>
                    </div>
                    <Badge variant="success">{patient.status}</Badge>
                  </div>
                </Card>
              ))}
            </div>
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
          <div>
            <label className="block text-sm font-bold mb-3">Select Patient</label>
            <select className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none">
              <option value="">Choose patient...</option>
              {MOCK_PATIENTS.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3">Select Doctor</label>
            <select className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none">
              <option value="">Choose doctor...</option>
              {MOCK_DOCTORS.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-3">Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3">Time</label>
              <input
                type="time"
                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Book Appointment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Register Patient Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Patient"
      >
        <form onSubmit={handleRegisterPatient} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-3">Full Name *</label>
            <input
              type="text"
              placeholder="Enter patient name"
              className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-3">Email *</label>
              <input
                type="email"
                placeholder="patient@example.com"
                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3">Phone *</label>
              <input
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsRegisterModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Register Patient
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ReceptionistDashboard;
