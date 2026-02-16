import api from './api';

export const patientService = {
  // Get patient profile
  getProfile: async () => {
    const response = await api.get('/patients/profile');
    return response.data;
  },

  // Update patient profile
  updateProfile: async (profileData) => {
    const response = await api.put('/patients/profile', profileData);
    return response.data;
  },

  // Upload profile photo
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/patients/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default patientService;
