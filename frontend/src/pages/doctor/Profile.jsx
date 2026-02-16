import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import doctorService from '../../services/doctorService';
import FormSkeleton from '../../components/skeletons/FormSkeleton';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    consultationFee: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getProfile();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        specialization: data.specialization || '',
        experience: data.experience || '',
        consultationFee: data.consultationFee || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = await doctorService.updateProfile(formData);
      updateUser(updatedData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="input-field mt-1 bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experience (years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                id="consultationFee"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={fetchProfile}
              className="btn-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
