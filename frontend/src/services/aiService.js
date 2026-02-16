import api from './api';

export const aiService = {
  // Generate AI summary
  generateSummary: async (appointmentId) => {
    const response = await api.post('/ai/summary', { appointmentId });
    return response.data;
  },
};

export default aiService;
