import api from './api';

export const appointmentService = {
  // Get slots for a doctor
  getSlots: async (doctorId, date) => {
    const response = await api.get(`/appointments/slots/${doctorId}`, {
      params: { date }
    });
    return response.data;
  },

  // Book appointment
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  },

  // Book appointment for patient (receptionist)
  bookAppointmentForPatient: async (appointmentData) => {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  },

  // Get patient appointments
  getMyAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  // Get doctor appointments
  getDoctorAppointments: async (date) => {
    const response = await api.get('/appointments/doctor', {
      params: { date }
    });
    return response.data;
  },

  // Get all appointments (reception)
  getAllAppointments: async (filters = {}) => {
    const response = await api.get('/appointments/all', { params: filters });
    return response.data;
  },

  // Mark no-show
  markNoShow: async (appointmentId) => {
    const response = await api.patch(`/appointments/${appointmentId}/no-show`);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    const response = await api.patch(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  },
};

export default appointmentService;
