import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';
import toast from 'react-hot-toast';
import { Calendar, Users, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodaysAppointments();
  }, []);

  const fetchTodaysAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorAppointments(today);
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'SEEN').length;
  const pendingAppointments = appointments.filter(
    apt => apt.status === 'BOOKED' || apt.status === 'CONFIRMED'
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{totalAppointments}</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900">{completedAppointments}</p>
            </div>
            <Users className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-orange-900">{pendingAppointments}</p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {appointment.patient?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(appointment.slot)} • {appointment.patient?.age} years • {appointment.patient?.gender}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
