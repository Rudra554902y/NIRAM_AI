import api from './api';

export const followUpService = {
  // Get patient follow-ups
  getMyFollowUps: async () => {
    const response = await api.get('/followups/my');
    return response.data;
  },

  // Confirm follow-up
  confirmFollowUp: async (followUpId) => {
    const response = await api.patch(`/followups/${followUpId}/confirm`);
    return response.data;
  },

  // Decline follow-up
  declineFollowUp: async (followUpId) => {
    const response = await api.patch(`/followups/${followUpId}/decline`);
    return response.data;
  },

  // Get all follow-ups (doctor/reception)
  getAllFollowUps: async () => {
    const response = await api.get('/followups/all');
    return response.data;
  },
};

export default followUpService;
