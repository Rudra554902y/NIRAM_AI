/**
 * Doctor Dashboard
 * Role: DOCTOR
 * 
 * Features:
 * - View today's schedule
 * - Manage appointments
 * - Create prescriptions
 * - Update availability
 * - View patient queue
 * 
 * Schema alignment:
 * - Doctor (specialization, workingDays, startTime, endTime, slotDuration, leaveDate)
 * - Appointment viewing and management
 * - Prescription creation (medicines, tests, notes, followUpDate)
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Settings,
  Stethoscope,
  Plus,
  CheckCircle2,
  AlertCircle,
  Pill,
  TestTube
} from 'lucide-react';
import { useAuth } from '../../App.jsx';
import Layout from '../../components/layout/Layout.jsx';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { MOCK_APPOINTMENTS, MOCK_PRESCRIPTIONS } from '../../services/mockData.js';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: [],
    tests: [],
    notes: '',
    followUpDate: ''
  });

  const menuItems = [
    { id: 'schedule', label: 'Today\'s Schedule', icon: <Calendar className="w-5 h-5" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-5 h-5" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { id: 'availability', label: 'Availability', icon: <Settings className="w-5 h-5" /> }
  ];

  // Filter appointments for this doctor
  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.doctorId === user._id);
  const todayAppointments = myAppointments.filter(a => a.date === '2026-02-14');
  const upcomingAppointments = todayAppointments.filter(a => a.status === 'BOOKED');
  const completedToday = todayAppointments.filter(a => a.status === 'COMPLETED');

  const handleCreatePrescription = (e) => {
    e.preventDefault();
    toast.success('Prescription created successfully!');
    setIsPrescriptionModalOpen(false);
    setPrescriptionForm({ medicines: [], tests: [], notes: '', followUpDate: '' });
  };

  const getStatusBadge = (status) => {
    const map = { BOOKED: 'warning', COMPLETED: 'success', CANCELLED: 'danger' };
    return <Badge variant={map[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Layout user={user} activeTab={activeTab} onTabChange={setActiveTab} menuItems={menuItems}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Good day, {user.name} 👨‍⚕️
          </h1>
          <p className="text-slate-400">Your clinic dashboard • {user.specialization}</p>
        </header>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="Today's Appointments"
                value={todayAppointments.length}
                icon={<Calendar className="w-6 h-6" />}
                color="emerald"
              />
              <StatCard
                label="Completed"
                value={completedToday.length}
                icon={<CheckCircle2 className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                label="Pending"
                value={upcomingAppointments.length}
                icon={<Clock className="w-6 h-6" />}
                color="amber"
              />
              <StatCard
                label="Total Patients"
                value={myAppointments.length}
                icon={<Users className="w-6 h-6" />}
                color="purple"
              />
            </div>

            {/* Today's Appointments */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-emerald-400" />
                Today's Schedule
              </h2>

              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map(appointment => (
                    <Card key={appointment._id}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-lg">{appointment.patientName}</p>
                            <p className="text-sm text-slate-400">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {appointment.timeSlot} • Patient ID: {appointment.patientId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(appointment.status)}
                          {appointment.status === 'BOOKED' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setIsPrescriptionModalOpen(true);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                              Prescribe
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
                    <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No appointments scheduled for today</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Prescription History</h2>
            
            {MOCK_PRESCRIPTIONS.filter(p => p.doctorId === user._id).length > 0 ? (
              <div className="space-y-4">
                {MOCK_PRESCRIPTIONS.filter(p => p.doctorId === user._id).map(prescription => (
                  <Card key={prescription._id}>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold text-lg">{prescription.patientName}</p>
                          <p className="text-sm text-slate-400">
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="success">COMPLETED</Badge>
                      </div>
                      
                      {prescription.medicines.length > 0 && (
                        <div className="p-4 rounded-lg bg-white/5">
                          <p className="text-sm font-bold mb-2 text-emerald-400">Medicines:</p>
                          <ul className="text-sm space-y-1">
                            {prescription.medicines.map((med, idx) => (
                              <li key={idx} className="text-slate-300">
                                • {med.name} - {med.dosage} ({med.duration})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {prescription.notes && (
                        <p className="text-sm italic text-slate-400 p-3 bg-amber-500/5 rounded-lg">
                          "{prescription.notes}"
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-center py-12 text-slate-500">No prescriptions yet</p>
              </Card>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Patient List</h2>
            
            <div className="space-y-3">
              {Array.from(new Set(myAppointments.map(a => a.patientId))).map((patientId, idx) => {
                const patientApps = myAppointments.filter(a => a.patientId === patientId);
                const patientName = patientApps[0]?.patientName;
                
                return (
                  <Card key={patientId}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-purple-400">
                          {patientName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{patientName}</p>
                          <p className="text-sm text-slate-500">{patientApps.length} appointments</p>
                        </div>
                      </div>
                      <Badge variant="info">ACTIVE</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Availability</h2>
            
            <Card>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Specialization</label>
                  <input
                    type="text"
                    value={user.specialization}
                    disabled
                    className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Start Time</label>
                    <input
                      type="time"
                      value={user.startTime}
                      disabled
                      className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">End Time</label>
                    <input
                      type="time"
                      value={user.endTime}
                      disabled
                      className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Slot Duration (minutes)</label>
                  <input
                    type="number"
                    value={user.slotDuration}
                    disabled
                    className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
                  />
                </div>
                
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Preview Mode: Availability editing is disabled in this version
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Create Prescription Modal */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title={`Create Prescription - ${selectedAppointment?.patientName}`}
        size="lg"
      >
        <form onSubmit={handleCreatePrescription} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-3">Clinical Notes</label>
            <textarea
              value={prescriptionForm.notes}
              onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
              placeholder="Enter diagnosis and treatment notes..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none min-h-[120px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3">Follow-up Date</label>
            <input
              type="date"
              value={prescriptionForm.followUpDate}
              onChange={(e) => setPrescriptionForm({...prescriptionForm, followUpDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-300">
              <Pill className="w-4 h-4 inline mr-2" />
              Medicine and test management available in full version
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsPrescriptionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create Prescription
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default DoctorDashboard;
