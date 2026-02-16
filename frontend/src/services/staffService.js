import api from './api';

export const staffService = {
  // Create staff
  createStaff: async (staffData) => {
    const response = await api.post('/staff/create', staffData);
    return response.data;
  },

  // Get all staff
  getAllStaff: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  // Delete staff
  deleteStaff: async (staffId) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },
};

export default staffService;
