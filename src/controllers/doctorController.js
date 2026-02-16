const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

exports.getDoctorProfile = async (req, res) => {
  try {
    // Find doctor by userId
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate(
      "userId",
      "name email phone"
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    res.json({
      doctor: {
        id: doctor._id,
        user: doctor.userId,
        specialization: doctor.specialization,
        workingDays: doctor.workingDays,
        startTime: doctor.startTime,
        endTime: doctor.endTime,
        slotDuration: doctor.slotDuration,
        leaves: doctor.leaves,
      },
    });
  } catch (error) {
    console.error("Error getting doctor profile:", error);
    res.status(500).json({ error: "Failed to get doctor profile" });
  }
};

exports.getTodayAppointments = async (req, res) => {
  try {
    // Find doctor by userId
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all appointments for today
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("patientId", "name phone email")
      .sort({ timeSlot: 1 });

    res.json({
      appointments,
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "BOOKED").length,
      seen: appointments.filter((a) => a.status === "SEEN").length,
    });
  } catch (error) {
    console.error("Error getting today's appointments:", error);
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

exports.markAppointmentSeen = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate appointment ID
    if (!id) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    // Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Find doctor by userId
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    // Ensure doctor is marking their own appointment
    if (!appointment.doctorId.equals(doctor._id)) {
      return res.status(403).json({ error: "Unauthorized to mark this appointment" });
    }

    // Check if already seen
    if (appointment.status === "SEEN" || appointment.status === "PRESCRIPTION_DONE") {
      return res.status(400).json({ error: "Appointment already marked as seen" });
    }

    // Update status
    appointment.status = "SEEN";
    await appointment.save();

    res.json({
      message: "Appointment marked as seen",
      appointment,
    });
  } catch (error) {
    console.error("Error marking appointment as seen:", error);
    res.status(500).json({ error: "Failed to mark appointment as seen" });
  }
};

exports.markEmergencyLeave = async (req, res) => {
  try {
    const { date, afterAppointments } = req.body;

    // Validate required fields
    if (!date || afterAppointments === undefined) {
      return res.status(400).json({
        error: "Missing required fields: date, afterAppointments",
      });
    }

    // Find doctor by userId
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    // Save leave record
    doctor.leaves.push({
      type: "EMERGENCY",
      date: new Date(date),
      emergencyAfterAppointments: afterAppointments,
      status: "ACTIVE",
    });

    await doctor.save();

    // Get remaining appointments sorted
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: new Date(date),
      status: "BOOKED",
    }).sort({ timeSlot: 1 });

    // Allow first N appointments
    const allowed = appointments.slice(0, afterAppointments);
    const toReschedule = appointments.slice(afterAppointments);

    // Mark appointments for rescheduling
    for (let app of toReschedule) {
      app.status = "RESCHEDULE_REQUIRED";
      await app.save();
    }

    res.json({
      message: "Emergency leave processed successfully",
      allowedCount: allowed.length,
      rescheduledCount: toReschedule.length,
    });
  } catch (error) {
    console.error("Error marking emergency leave:", error);
    res.status(500).json({ error: "Failed to mark emergency leave" });
  }
};

// GET /doctors/list - Public endpoint to get all doctors
exports.getPublicDoctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email")
      .select("specialization workingDays startTime endTime slotDuration consultationFee");

    // Format response
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor._id,
      name: doctor.userId.name,
      specialization: doctor.specialization,
      consultationFee: doctor.consultationFee,
      workingDays: doctor.workingDays,
      slotDuration: doctor.slotDuration,
      startTime: doctor.startTime,
      endTime: doctor.endTime,
    }));

    res.json({
      doctors: formattedDoctors,
      total: formattedDoctors.length,
    });
  } catch (error) {
    console.error("Error getting public doctor list:", error);
    res.status(500).json({ error: "Failed to get doctor list" });
  }
};
