/**
 * Mock Data for NIRAM Healthcare System
 * Aligned with system schema requirements
 * 
 * Schema Entities:
 * - User (with role, status, contact info)
 * - Doctor (with specialization, working hours, slots)
 * - Appointment (with patient, doctor, time, status)
 * - Prescription (with medicines, tests, notes)
 * - Reminder (with patient, appointment, status)
 */

// Mock Doctors - Aligned with Doctor schema
export const MOCK_DOCTORS = [
  {
    _id: 'd1',
    userId: 'user_d1',
    name: 'Dr. Alok Sharma',
    specialization: 'Ayurvedic Medicine',
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    leaveDate: null,
    leaveTime: null,
    email: 'alok.sharma@niram.health',
    phone: '+91-9876543201'
  },
  {
    _id: 'd2',
    userId: 'user_d2',
    name: 'Dr. Priya Nair',
    specialization: 'General Physician',
    workingDays: [1, 2, 3, 4, 6], // Monday to Thursday and Saturday
    startTime: '10:00',
    endTime: '18:00',
    slotDuration: 30,
    leaveDate: null,
    leaveTime: null,
    email: 'priya.nair@niram.health',
    phone: '+91-9876543202'
  },
  {
    _id: 'd3',
    userId: 'user_d3',
    name: 'Dr. Rajesh Verma',
    specialization: 'Skin & Wellness',
    workingDays: [0, 1, 2, 3, 4], // Sunday to Thursday
    startTime: '09:00',
    endTime: '16:00',
    slotDuration: 45,
    leaveDate: null,
    leaveTime: null,
    email: 'rajesh.verma@niram.health',
    phone: '+91-9876543203'
  }
];

// Mock Patients - Aligned with User schema
export const MOCK_PATIENTS = [
  {
    _id: 'p1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    role: 'PATIENT',
    status: 'ACTIVE'
  },
  {
    _id: 'p2',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91-9876543211',
    role: 'PATIENT',
    status: 'ACTIVE'
  },
  {
    _id: 'p3',
    name: 'Sneha Rao',
    email: 'sneha.rao@example.com',
    phone: '+91-9876543212',
    role: 'PATIENT',
    status: 'ACTIVE'
  },
  {
    _id: 'p4',
    name: 'Rahul Singh',
    email: 'rahul.singh@example.com',
    phone: '+91-9876543213',
    role: 'PATIENT',
    status: 'ACTIVE'
  }
];

// Mock Appointments - Aligned with Appointment schema
export const MOCK_APPOINTMENTS = [
  {
    _id: 'a1',
    patientId: 'p2',
    patientName: 'Amit Kumar',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    date: '2026-02-14',
    timeSlot: '10:30',
    status: 'BOOKED',
    rescheduledFrom: null
  },
  {
    _id: 'a2',
    patientId: 'p3',
    patientName: 'Sneha Rao',
    doctorId: 'd2',
    doctorName: 'Dr. Priya Nair',
    date: '2026-02-14',
    timeSlot: '11:15',
    status: 'COMPLETED',
    rescheduledFrom: null
  },
  {
    _id: 'a3',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    date: '2026-02-14',
    timeSlot: '14:00',
    status: 'BOOKED',
    rescheduledFrom: null
  },
  {
    _id: 'a4',
    patientId: 'p4',
    patientName: 'Rahul Singh',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    date: '2026-02-15',
    timeSlot: '09:30',
    status: 'BOOKED',
    rescheduledFrom: null
  },
  {
    _id: 'a5',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorId: 'd3',
    doctorName: 'Dr. Rajesh Verma',
    date: '2026-02-16',
    timeSlot: '10:00',
    status: 'BOOKED',
    rescheduledFrom: null
  }
];

// Mock Prescriptions - Aligned with Prescription schema
export const MOCK_PRESCRIPTIONS = [
  {
    _id: 'pr1',
    appointmentId: 'a2',
    patientId: 'p3',
    patientName: 'Sneha Rao',
    doctorId: 'd2',
    doctorName: 'Dr. Priya Nair',
    medicines: [
      { name: 'Ashwagandha Tablets', dosage: '1-0-1', duration: '15 days', instructions: 'After meals' },
      { name: 'Triphala Powder', dosage: '0-0-1', duration: '30 days', instructions: 'With warm water at bedtime' }
    ],
    tests: ['Blood Sugar (Fasting)', 'Complete Blood Count (CBC)'],
    notes: 'Rest well and avoid oily food. Follow up in 2 weeks.',
    followUpDate: '2026-02-28',
    createdAt: '2026-02-14T11:45:00Z'
  },
  {
    _id: 'pr2',
    appointmentId: 'a3',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    medicines: [
      { name: 'Chyawanprash', dosage: '2 tsp', duration: '30 days', instructions: 'Morning with milk' },
      { name: 'Tulsi Drops', dosage: '10 drops', duration: '15 days', instructions: 'In warm water twice daily' }
    ],
    tests: [],
    notes: 'Good progress. Continue with lifestyle modifications.',
    followUpDate: '2026-03-14',
    createdAt: '2026-02-14T14:30:00Z'
  }
];

// Mock Reminders - Aligned with Reminder schema
export const MOCK_REMINDERS = [
  {
    _id: 'r1',
    patientId: 'p1',
    appointmentId: 'a3',
    reminderDate: '2026-02-14T12:00:00Z',
    status: 'SENT',
    type: 'APPOINTMENT',
    message: 'Reminder: You have an appointment with Dr. Alok Sharma today at 14:00'
  },
  {
    _id: 'r2',
    patientId: 'p4',
    appointmentId: 'a4',
    reminderDate: '2026-02-15T08:00:00Z',
    status: 'PENDING',
    type: 'APPOINTMENT',
    message: 'Reminder: You have an appointment with Dr. Alok Sharma tomorrow at 09:30'
  },
  {
    _id: 'r3',
    patientId: 'p3',
    appointmentId: null,
    reminderDate: '2026-02-28T09:00:00Z',
    status: 'PENDING',
    type: 'FOLLOWUP',
    message: 'Follow-up reminder: Time for your check-up with Dr. Priya Nair'
  }
];

// Mock Queue Data (for Receptionist)
export const MOCK_QUEUE = [
  {
    _id: 'q1',
    patientId: 'p2',
    patientName: 'Amit Kumar',
    appointmentId: 'a1',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    timeSlot: '10:30',
    status: 'WAITING',
    arrivedAt: '2026-02-14T10:20:00Z',
    queuePosition: 1
  },
  {
    _id: 'q2',
    patientId: 'p1',
    patientName: 'John Doe',
    appointmentId: 'a3',
    doctorId: 'd1',
    doctorName: 'Dr. Alok Sharma',
    timeSlot: '14:00',
    status: 'CHECKED_IN',
    arrivedAt: '2026-02-14T13:45:00Z',
    queuePosition: 2
  }
];

// Available time slots generator (utility for booking)
export const generateTimeSlots = (startTime, endTime, slotDuration) => {
  const slots = [];
  let current = startTime;
  
  while (current < endTime) {
    slots.push(current);
    const [hours, minutes] = current.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + slotDuration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }
  
  return slots;
};

// Export all
export default {
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_PRESCRIPTIONS,
  MOCK_REMINDERS,
  MOCK_QUEUE,
  generateTimeSlots
};
