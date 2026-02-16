import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import paymentService from '../../services/paymentService';
import { formatDate, formatTime } from '../../utils/formatters';
import CardSkeleton from '../../components/skeletons/CardSkeleton';
import toast from 'react-hot-toast';
import { Search, Calendar } from 'lucide-react';

const BookAppointment = () => {
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Slot, 3: Payment
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
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

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToPayment = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      
      // Create appointment
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        slot: selectedSlot,
      };
      
      const appointment = await appointmentService.bookAppointment(appointmentData);

      // Create payment order
      const order = await paymentService.createOrder(
        selectedDoctor.consultationFee,
        appointment._id
      );

      // Open Razorpay checkout
      paymentService.openRazorpayCheckout(
        order,
        (result) => {
          toast.success('Appointment booked successfully!');
          navigate('/patient/appointments');
        },
        (error) => {
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to proceed');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && step === 1) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Appointment</h1>
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Appointment</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Doctor</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Slot</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <div>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {doctor.experience} years
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fee:</span> ₹{doctor.consultationFee}
                  </p>
                </div>
                <button
                  onClick={() => handleDoctorSelect(doctor)}
                  className="w-full btn-primary"
                >
                  Select Doctor
                </button>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500">No doctors found</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Slot */}
      {step === 2 && (
        <div>
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {selectedDoctor?.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedDoctor?.specialization}</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Change Doctor
              </button>
            </div>
          </div>

          <div className="card">
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

            {selectedDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Available Time Slots</h4>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading slots...</p>
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {slots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                          selectedSlot === slot
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No slots available for this date
                  </p>
                )}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Consultation Fee:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{selectedDoctor?.consultationFee}
                  </span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
