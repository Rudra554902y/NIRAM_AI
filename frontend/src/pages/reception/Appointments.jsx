import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

const ReceptionAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments(filters);
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleMarkNoShow = async (id) => {
    if (!confirm('Mark this appointment as no-show?')) return;

    try {
      await appointmentService.markNoShow(id);
      toast.success('Marked as no-show');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const searchTerm = filters.search.toLowerCase();
    return (
      apt.patient?.name?.toLowerCase().includes(searchTerm) ||
      apt.doctor?.name?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading && appointments.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Appointments</h1>
        <TableSkeleton rows={10} columns={7} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Appointments</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="BOOKED">Booked</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SEEN">Seen</option>
              <option value="NO_SHOW">No Show</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Patient or doctor name..."
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctor?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctor?.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(appointment.slot)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{appointment.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(appointment.status === 'BOOKED' || appointment.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleMarkNoShow(appointment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          No Show
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default ReceptionAppointments;
