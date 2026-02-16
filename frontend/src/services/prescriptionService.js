import api from './api';

export const prescriptionService = {
  // Create prescription
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  // Get patient prescriptions
  getMyPrescriptions: async () => {
    const response = await api.get('/prescriptions/my');
    return response.data;
  },

  // Get prescriptions by appointment
  getPrescriptionByAppointment: async (appointmentId) => {
    const response = await api.get(`/prescriptions/appointment/${appointmentId}`);
    return response.data;
  },

  // Confirm cash payment
  confirmCashPayment: async (prescriptionId) => {
    const response = await api.post(`/prescriptions/${prescriptionId}/confirm-cash`);
    return response.data;
  },

  // Get all prescriptions (reception)
  getAllPrescriptions: async () => {
    const response = await api.get('/prescriptions/all');
    return response.data;
  },
};

export default prescriptionService;
