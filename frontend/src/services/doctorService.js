import api from './api';

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  // Apply emergency leave
  applyEmergencyLeave: async (leaveData) => {
    const response = await api.post('/doctors/emergency-leave', leaveData);
    return response.data;
  },

  // Get doctor profile
  getProfile: async () => {
    const response = await api.get('/doctors/profile');
    return response.data;
  },

  // Update doctor profile
  updateProfile: async (profileData) => {
    const response = await api.put('/doctors/profile', profileData);
    return response.data;
  },
};

export default doctorService;
