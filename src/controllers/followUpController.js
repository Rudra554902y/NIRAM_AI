const FollowUp = require("../models/FollowUp");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// GET /followups/patient/:id - Get all follow-ups for a patient
exports.getPatientFollowUps = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization check - patients can only view their own follow-ups
    if (req.user.role === "PATIENT" && req.user.id !== id) {
      return res.status(403).json({ 
        error: "Unauthorized to view other patient's follow-ups" 
      });
    }

    const followUps = await FollowUp.find({ patientId: id })
      .populate({
        path: "originalAppointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name specialization" } },
        ],
      })
      .populate({
        path: "followUpAppointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name specialization" } },
        ],
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort({ recommendedDate: -1 });

    res.json({
      followUps,
      total: followUps.length,
    });
  } catch (error) {
    console.error("Error getting patient follow-ups:", error);
    res.status(500).json({ error: "Failed to get follow-ups" });
  }
};

// POST /followups/:id/confirm - Confirm a follow-up and create appointment
exports.confirmFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    // Validate required fields
    if (!date || !timeSlot) {
      return res.status(400).json({ 
        error: "Missing required fields: date, timeSlot" 
      });
    }

    // Find follow-up
    const followUp = await FollowUp.findById(id)
      .populate("patientId")
      .populate("doctorId");

    if (!followUp) {
      return res.status(404).json({ error: "Follow-up not found" });
    }

    // Check if already confirmed or completed
    if (followUp.status !== "PENDING") {
      return res.status(400).json({ 
        error: `Follow-up is already ${followUp.status.toLowerCase()}` 
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId: followUp.doctorId._id,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "This slot is already booked" });
    }

    // Create new appointment
    const appointment = await Appointment.create({
      patientId: followUp.patientId._id,
      doctorId: followUp.doctorId._id,
      date,
      timeSlot,
      type: "FOLLOW_UP",
      status: "BOOKED",
      paymentStatus: "PAID", // Follow-up is free/already paid
      confirmationStatus: "CONFIRMED",
    });

    // Update follow-up
    followUp.status = "CONFIRMED";
    followUp.followUpAppointmentId = appointment._id;
    followUp.responseAt = new Date();
    await followUp.save();

    // Populate appointment details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patientId", "name email phone")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.status(201).json({
      message: "Follow-up confirmed and appointment created",
      followUp,
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Error confirming follow-up:", error);
    res.status(500).json({ error: "Failed to confirm follow-up" });
  }
};

// PUT /followups/:id/decline - Decline a follow-up
exports.declineFollowUp = async (req, res) => {
  try {
    const { id } = req.params;

    // Find follow-up
    const followUp = await FollowUp.findById(id);

    if (!followUp) {
      return res.status(404).json({ error: "Follow-up not found" });
    }

    // Check if already declined or completed
    if (followUp.status !== "PENDING") {
      return res.status(400).json({ 
        error: `Follow-up is already ${followUp.status.toLowerCase()}` 
      });
    }

    // Update follow-up status
    followUp.status = "DECLINED";
    followUp.responseAt = new Date();
    await followUp.save();

    res.json({
      message: "Follow-up declined successfully",
      followUp,
    });
  } catch (error) {
    console.error("Error declining follow-up:", error);
    res.status(500).json({ error: "Failed to decline follow-up" });
  }
};

// GET /followups/all - Get all follow-ups (for reception/admin)
exports.getAllFollowUps = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.recommendedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const followUps = await FollowUp.find(query)
      .populate({
        path: "originalAppointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name specialization" } },
        ],
      })
      .populate({
        path: "followUpAppointmentId",
        populate: [
          { path: "patientId", select: "name email phone" },
          { path: "doctorId", populate: { path: "userId", select: "name specialization" } },
        ],
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort({ recommendedDate: -1 });

    res.json({
      followUps,
      total: followUps.length,
    });
  } catch (error) {
    console.error("Error getting all follow-ups:", error);
    res.status(500).json({ error: "Failed to get follow-ups" });
  }
};
