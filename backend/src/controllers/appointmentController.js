const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const generateSlots = require("../utils/slotGenerator");

exports.getAvailableSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  const doctor = await Doctor.findById(doctorId);
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  if (!doctor.workingDays.includes(dayName))
    return res.json([]);

  const allSlots = generateSlots(
    doctor.startTime,
    doctor.endTime,
    doctor.slotDuration
  );

  const booked = await Appointment.find({ doctorId, date });

  const bookedSlots = booked.map((a) => a.timeSlot);

  const available = allSlots.filter((s) => !bookedSlots.includes(s));

  res.json(available);
};

exports.bookAppointment = async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.json(appointment);
};
