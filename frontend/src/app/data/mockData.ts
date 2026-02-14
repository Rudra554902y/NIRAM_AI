
export const MOCK_DOCTORS = [
  { id: 'd1', name: 'Dr. Alok Sharma', specialization: 'Ayurvedic Medicine', startTime: '09:00', endTime: '17:00', workingDays: [1, 2, 3, 4, 5] },
  { id: 'd2', name: 'Dr. Priya Nair', specialization: 'General Physician', startTime: '10:00', endTime: '18:00', workingDays: [1, 2, 3, 4, 6] },
  { id: 'd3', name: 'Dr. Rajesh V.', specialization: 'Skin & Wellness', startTime: '09:00', endTime: '16:00', workingDays: [0, 1, 2, 3, 4] },
];

export const MOCK_APPOINTMENTS = [
  { 
    id: 'a1', 
    patientName: 'Amit Kumar', 
    patientId: 'p2',
    doctorName: 'Dr. Alok Sharma', 
    doctorId: 'd1',
    date: '2026-02-14', 
    timeSlot: '10:30', 
    status: 'BOOKED' 
  },
  { 
    id: 'a2', 
    patientName: 'Sneha Rao', 
    patientId: 'p3',
    doctorName: 'Dr. Priya Nair', 
    doctorId: 'd2',
    date: '2026-02-14', 
    timeSlot: '11:15', 
    status: 'COMPLETED' 
  },
  { 
    id: 'a3', 
    patientName: 'John Doe', 
    patientId: 'p1',
    doctorName: 'Dr. Alok Sharma', 
    doctorId: 'd1',
    date: '2026-02-14', 
    timeSlot: '14:00', 
    status: 'BOOKED' 
  },
  { 
    id: 'a4', 
    patientName: 'Rahul Singh', 
    patientId: 'p4',
    doctorName: 'Dr. Alok Sharma', 
    doctorId: 'd1',
    date: '2026-02-15', 
    timeSlot: '09:30', 
    status: 'BOOKED' 
  },
];

export const MOCK_PRESCRIPTIONS = [
  {
    id: 'pr1',
    appointmentId: 'a2',
    patientId: 'p3',
    patientName: 'Sneha Rao',
    doctorId: 'd2',
    medicines: [
      { name: 'Ashwagandha Tab', dosage: '1-0-1', duration: '15 days' },
      { name: 'Triphala Powder', dosage: '0-0-1', duration: '30 days' }
    ],
    tests: ['Blood Sugar', 'Complete Blood Count'],
    notes: 'Rest well and avoid oily food.',
    createdAt: '2026-02-14T11:45:00Z'
  }
];
