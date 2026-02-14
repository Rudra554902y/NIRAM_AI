const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, tests, notes, followUpDate } = req.body;

    // Validate required fields
    if (!appointmentId) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name email phone")
      .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if appointment status is SEEN
    if (appointment.status !== "SEEN") {
      return res.status(400).json({ 
        error: "Prescription can only be created for appointments marked as SEEN" 
      });
    }

    // Check if prescription already exists
    const existingPrescription = await Prescription.findOne({ appointmentId });
    if (existingPrescription) {
      return res.status(409).json({ 
        error: "Prescription already exists for this appointment" 
      });
    }

    // Validate medicines array
    if (medicines && !Array.isArray(medicines)) {
      return res.status(400).json({ error: "Medicines must be an array" });
    }

    // Validate tests array
    if (tests && !Array.isArray(tests)) {
      return res.status(400).json({ error: "Tests must be an array" });
    }

    // Create prescription
    const prescription = await Prescription.create({
      appointmentId,
      medicines: medicines || [],
      tests: tests || [],
      notes: notes || "",
      followUpDate: followUpDate || null,
    });

    // Update appointment status to PRESCRIPTION_DONE
    appointment.status = "PRESCRIPTION_DONE";
    await appointment.save();

    // Populate and return prescription with appointment details
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: "appointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name" } },
        ],
      });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: populatedPrescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Failed to create prescription" });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate patient ID
    if (!id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Authorization check - patients can only view their own prescriptions
    if (req.user.role === "PATIENT" && req.user.id !== id) {
      return res.status(403).json({ 
        error: "Unauthorized to view other patient's prescriptions" 
      });
    }

    // Find all appointments for the patient
    const appointments = await Appointment.find({ patientId: id });
    
    if (!appointments || appointments.length === 0) {
      return res.json({ prescriptions: [], total: 0 });
    }

    const appointmentIds = appointments.map((a) => a._id);

    // Find all prescriptions for these appointments
    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    })
      .populate({
        path: "appointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name specialization" } },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      prescriptions,
      total: prescriptions.length,
    });
  } catch (error) {
    console.error("Error getting patient prescriptions:", error);
    res.status(500).json({ error: "Failed to get prescriptions" });
  }
};

exports.getPendingPrescriptions = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find appointments that are SEEN but don't have prescriptions yet
    const seenAppointments = await Appointment.find({
      status: "SEEN",
      date: { $gte: today },
    })
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort({ date: 1, timeSlot: 1 });

    // Filter out appointments that already have prescriptions
    const appointmentIds = seenAppointments.map((a) => a._id);
    const existingPrescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    });

    const prescriptionAppointmentIds = existingPrescriptions.map((p) =>
      p.appointmentId.toString()
    );

    const pendingAppointments = seenAppointments.filter(
      (a) => !prescriptionAppointmentIds.includes(a._id.toString())
    );

    res.json({
      appointments: pendingAppointments,
      total: pendingAppointments.length,
    });
  } catch (error) {
    console.error("Error getting pending prescriptions:", error);
    res.status(500).json({ error: "Failed to get pending prescriptions" });
  }
};
