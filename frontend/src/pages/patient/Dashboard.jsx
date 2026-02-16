import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock, Plus } from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import followUpService from '../../services/followUpService';
import prescriptionService from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    appointments: [],
    followUps: [],
    prescriptions: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointments, followUps, prescriptions] = await Promise.all([
        appointmentService.getMyAppointments(),
        followUpService.getMyFollowUps(),
        prescriptionService.getMyPrescriptions(),
      ]);
      setData({ appointments, followUps, prescriptions });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const upcomingAppointments = data.appointments.filter(
    (apt) => apt.status === 'BOOKED' || apt.status === 'CONFIRMED'
  ).slice(0, 3);

  const pendingFollowUps = data.followUps.filter(
    (fu) => fu.status === 'PENDING'
  ).slice(0, 3);

  const recentPrescriptions = data.prescriptions.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => navigate('/patient/book')}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Book Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{data.appointments.length}</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-purple-50 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Pending Follow-ups</p>
              <p className="text-3xl font-bold text-purple-900">{pendingFollowUps.length}</p>
            </div>
            <Clock className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Prescriptions</p>
              <p className="text-3xl font-bold text-green-900">{data.prescriptions.length}</p>
            </div>
            <FileText className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Dr. {appointment.doctor?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(appointment.date)} at {formatTime(appointment.slot)}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
        )}
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pending Follow-ups</h2>
            <button
              onClick={() => navigate('/patient/followups')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {pendingFollowUps.map((followUp) => (
              <div
                key={followUp._id}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Follow-up with Dr. {followUp.doctor?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(followUp.followUpDate)}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/patient/followups')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Respond
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Prescriptions */}
      {recentPrescriptions.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Prescriptions</h2>
          </div>
          <div className="space-y-3">
            {recentPrescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Dr. {prescription.doctor?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(prescription.createdAt)}
                  </p>
                </div>
                <StatusBadge status={prescription.paymentStatus} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
