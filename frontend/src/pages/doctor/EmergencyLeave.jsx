import React, { useState } from 'react';
import doctorService from '../../services/doctorService';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

const EmergencyLeave = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      await doctorService.applyEmergencyLeave(formData);
      toast.success('Emergency leave applied successfully. Patients will be notified.');
      setFormData({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply emergency leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Emergency Leave</h1>

      <div className="card max-w-2xl">
        <div className="flex items-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <p className="text-sm text-yellow-800">
            Applying emergency leave will cancel all your appointments during the specified period. 
            Patients will be notified and asked to reschedule.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              className="input-field mt-1"
              placeholder="Enter reason for emergency leave..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setFormData({ startDate: '', endDate: '', reason: '' })}
              className="btn-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-danger"
            >
              {loading ? 'Applying...' : 'Apply Emergency Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyLeave;
