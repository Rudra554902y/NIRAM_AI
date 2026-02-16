import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import FormSkeleton from '../../components/skeletons/FormSkeleton';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

// Lazy load AI Summary component
const AISummary = lazy(() => import('../../components/AISummary'));

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    labTests: '',
    notes: '',
    followUpDate: '',
    followUpReason: '',
  });

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (error) {
      toast.error('Failed to load appointment');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dosage: '', frequency: '', duration: '' }
      ]
    });
  };

  const removeMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await prescriptionService.createPrescription({
        appointmentId,
        ...formData
      });
      toast.success('Prescription created successfully');
      navigate('/doctor/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Consultation</h1>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Consultation</h1>
        <button
          onClick={() => setShowAISummary(!showAISummary)}
          className="btn-primary flex items-center"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          {showAISummary ? 'Hide' : 'Show'} AI Summary
        </button>
      </div>

      {/* Patient Info */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{appointment.patient?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age / Gender</p>
            <p className="font-medium text-gray-900">
              {appointment.patient?.age} / {appointment.patient?.gender}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium text-gray-900">{appointment.patient?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{appointment.patient?.email}</p>
          </div>
          {appointment.patient?.medicalHistory && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Medical History</p>
              <p className="font-medium text-gray-900">{appointment.patient.medicalHistory}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {showAISummary && (
        <Suspense fallback={<FormSkeleton />}>
          <AISummary appointmentId={appointmentId} />
        </Suspense>
      )}

      {/* Prescription Form */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diagnosis */}
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              required
              value={formData.diagnosis}
              onChange={handleChange}
              rows={3}
              className="input-field mt-1"
              placeholder="Enter diagnosis..."
            />
          </div>

          {/* Medications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medications
            </label>
            {formData.medications.map((med, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  className="input-field"
                  required
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    className="input-field"
                    required
                  />
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedication}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Medication
            </button>
          </div>

          {/* Lab Tests */}
          <div>
            <label htmlFor="labTests" className="block text-sm font-medium text-gray-700">
              Lab Tests (Optional)
            </label>
            <textarea
              id="labTests"
              name="labTests"
              value={formData.labTests}
              onChange={handleChange}
              rows={2}
              className="input-field mt-1"
              placeholder="Enter recommended lab tests..."
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field mt-1"
              placeholder="Enter any additional notes..."
            />
          </div>

          {/* Follow-up */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">
                Follow-up Date (Optional)
              </label>
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label htmlFor="followUpReason" className="block text-sm font-medium text-gray-700">
                Follow-up Reason
              </label>
              <input
                type="text"
                id="followUpReason"
                name="followUpReason"
                value={formData.followUpReason}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Reason for follow-up"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation;
