import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';
import appointmentService from '../../services/appointmentService';
import { formatDate } from '../../utils/formatters';
import CardSkeleton from '../../components/skeletons/CardSkeleton';
import toast from 'react-hot-toast';
import { Search, Calendar, User } from 'lucide-react';

const BookAppointmentReception = () => {
  const [step, setStep] = useState(1); // 1: Select Patient, 2: Select Doctor, 3: Select Slot
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data.patients || data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const fetchSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      setLoading(true);
      const data = await appointmentService.getSlots(selectedDoctor._id, selectedDate);
      setSlots(data.availableSlots || []);
    } catch (error) {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      
      const appointmentData = {
        patientId: selectedPatient.id || selectedPatient._id,
        doctorId: selectedDoctor._id,
        date: selectedDate,
        slot: selectedSlot,
      };
      
      await appointmentService.bookAppointmentForPatient(appointmentData);
      toast.success('Appointment booked successfully!');
      
      // Reset form
      setStep(1);
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setSelectedSlot(null);
      setSelectedDate('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  );

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Book appointments for patients</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex justify-between w-96 text-xs text-gray-600">
            <span>Select Patient</span>
            <span>Select Doctor</span>
            <span>Select Slot</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Patient */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Patient</h2>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <CardSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id || patient._id}
                  onClick={() => handlePatientSelect(patient)}
                  className="card cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Doctor</h2>
              <p className="text-sm text-gray-600">Patient: {selectedPatient?.name}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700"
            >
              Change Patient
            </button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={doctorSearchTerm}
                onChange={(e) => setDoctorSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => handleDoctorSelect(doctor)}
                className="card cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <p className="text-sm font-medium text-blue-600 mt-2">₹{doctor.consultationFee}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Slot */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Time Slot</h2>
              <p className="text-sm text-gray-600">
                Patient: {selectedPatient?.name} | Doctor: {selectedDoctor?.name}
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-700"
            >
              Change Doctor
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <CardSkeleton />
          ) : (
            <>
              {slots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No slots available for the selected date
                </p>
              )}

              {selectedSlot && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleBookAppointment}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookAppointmentReception;
