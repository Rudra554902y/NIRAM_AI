const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const generateSlots = require("../utils/slotGenerator");

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Validate required parameters
    if (!doctorId || !date) {
      return res.status(400).json({ 
        error: "Missing required parameters: doctorId, date" 
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if doctor works on this day
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.workingDays.includes(dayName)) {
      return res.json({ slots: [], message: "Doctor not available on this day" });
    }

    // Generate all possible slots
    const allSlots = generateSlots(
      doctor.startTime,
      doctor.endTime,
      doctor.slotDuration
    );

    // Find booked appointments
    const booked = await Appointment.find({ doctorId, date });
    const bookedSlots = booked.map((a) => a.timeSlot);

    // Filter available slots
    const available = allSlots.filter((s) => !bookedSlots.includes(s));

    res.json({ slots: available, total: available.length });
  } catch (error) {
    console.error("Error getting available slots:", error);
    res.status(500).json({ error: "Failed to get available slots" });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    // Validate required fields
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ 
        error: "Missing required fields: doctorId, date, timeSlot" 
      });
    }

    // Get patientId from authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "This slot is already booked" });
    }

    // Create appointment with validated data
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      timeSlot,
      status: "BOOKED",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
};

exports.getReceptionTodayAppointments = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all appointments for today across all doctors
    const appointments = await Appointment.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort({ timeSlot: 1 });

    // Group by status
    const stats = {
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "BOOKED").length,
      seen: appointments.filter((a) => a.status === "SEEN").length,
      prescriptionDone: appointments.filter((a) => a.status === "PRESCRIPTION_DONE").length,
      rescheduleRequired: appointments.filter((a) => a.status === "RESCHEDULE_REQUIRED").length,
    };

    res.json({
      appointments,
      stats,
    });
  } catch (error) {
    console.error("Error getting reception today's appointments:", error);
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    // Validate required fields
    if (!date || !timeSlot) {
      return res.status(400).json({ 
        error: "Missing required fields: date, timeSlot" 
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if new slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(date),
      timeSlot,
      _id: { $ne: id }, // Exclude current appointment
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        error: "New slot is already booked. Please choose another slot." 
      });
    }

    // Verify doctor is available on new date
    const doctor = await Doctor.findById(appointment.doctorId);
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    
    if (!doctor.workingDays.includes(dayName)) {
      return res.status(400).json({ 
        error: "Doctor is not available on this day" 
      });
    }

    // Update appointment
    appointment.date = new Date(date);
    appointment.timeSlot = timeSlot;
    appointment.status = "BOOKED"; // Reset status to BOOKED
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.json({
      message: "Appointment rescheduled successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
};
