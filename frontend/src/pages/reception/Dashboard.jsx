import React, { useState, useEffect } from 'react';
import { usePolling } from '../../hooks/usePolling';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';
import toast from 'react-hot-toast';
import { Calendar, FileText, Clock, Bell } from 'lucide-react';

const ReceptionDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    todayAppointments: [],
    pendingPrescriptions: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Poll for updates every 30 seconds
  usePolling(() => {
    fetchDashboardData();
  }, 30000);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [appointments, prescriptions] = await Promise.all([
        appointmentService.getAllAppointments({ date: today }),
        prescriptionService.getAllPrescriptions(),
      ]);
      
      const pendingPrescriptions = prescriptions.filter(
        p => p.paymentStatus === 'PENDING'
      );
      
      setData({
        todayAppointments: appointments,
        pendingPrescriptions,
      });
      setLoading(false);
    } catch (error) {
      if (!loading) {
        console.error('Failed to refresh data');
      } else {
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const totalToday = data.todayAppointments.length;
  const completedToday = data.todayAppointments.filter(apt => apt.status === 'SEEN').length;
  const pendingPayments = data.pendingPrescriptions.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Bell className="h-4 w-4 mr-2 animate-pulse text-purple-600" />
          Auto-refreshing every 30 seconds
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{totalToday}</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900">{completedToday}</p>
            </div>
            <FileText className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending Payments</p>
              <p className="text-3xl font-bold text-orange-900">{pendingPayments}</p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Appointments</h2>
        {data.todayAppointments.length > 0 ? (
          <div className="space-y-3">
            {data.todayAppointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {appointment.patient?.name} → Dr. {appointment.doctor?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(appointment.slot)}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments for today</p>
        )}
      </div>

      {/* Pending Prescriptions */}
      {data.pendingPrescriptions.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Payment Confirmations
          </h2>
          <div className="space-y-3">
            {data.pendingPrescriptions.slice(0, 5).map((prescription) => (
              <div
                key={prescription._id}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {prescription.patient?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dr. {prescription.doctor?.name} • ₹{prescription.totalAmount}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/reception/prescriptions'}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Process
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionDashboard;
