const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const FollowUp = require("../models/FollowUp");
const generateSlots = require("../utils/slotGenerator");
const { createOrder, verifyPaymentSignature } = require("../utils/paymentService");

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
    const { doctorId, date, timeSlot, paymentMethod, symptoms } = req.body;

    // Validate required fields
    if (!doctorId || !date || !timeSlot || !paymentMethod) {
      return res.status(400).json({ 
        error: "Missing required fields: doctorId, date, timeSlot, paymentMethod" 
      });
    }

    // Validate payment method
    if (!["ONLINE", "CASH"].includes(paymentMethod)) {
      return res.status(400).json({ 
        error: "Invalid payment method. Must be ONLINE or CASH" 
      });
    }

    // Get patientId from authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId).populate("userId", "name");
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

    // For CASH payment, create appointment directly
    if (paymentMethod === "CASH") {
      const appointment = await Appointment.create({
        patientId: req.user.id,
        doctorId,
        date,
        timeSlot,
        type: "NEW",
        status: "BOOKED",
        symptoms: symptoms || "",
        paymentMethod: "CASH",
        paymentStatus: "CASH_PENDING",
        confirmationStatus: "NOT_CONFIRMED",
      });

      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("patientId", "name email phone")
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name specialization" },
        });

      return res.status(201).json({
        message: "Appointment created. Please pay at reception for confirmation.",
        appointment: populatedAppointment,
      });
    }

    // For ONLINE payment, return error (payment should be created first)
    return res.status(400).json({ 
      error: "For online payment, please create payment order first using /appointments/payment/create endpoint" 
    });
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
    const { date, timeSlot, rescheduleReason } = req.body;

    // Validate required fields
    if (!date || !timeSlot) {
      return res.status(400).json({ 
        error: "Missing required fields: date, timeSlot" 
      });
    }

    // Find old appointment
    const oldAppointment = await Appointment.findById(id);
    if (!oldAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if new slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId: oldAppointment.doctorId,
      date: new Date(date),
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        error: "New slot is already booked. Please choose another slot." 
      });
    }

    // Verify doctor is available on new date
    const doctor = await Doctor.findById(oldAppointment.doctorId);
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    
    if (!doctor.workingDays.includes(dayName)) {
      return res.status(400).json({ 
        error: "Doctor is not available on this day" 
      });
    }

    // Mark old appointment as RESCHEDULE_REQUIRED
    oldAppointment.status = "RESCHEDULE_REQUIRED";
    await oldAppointment.save();

    // Create new appointment
    const newAppointment = await Appointment.create({
      patientId: oldAppointment.patientId,
      doctorId: oldAppointment.doctorId,
      date: new Date(date),
      timeSlot,
      type: oldAppointment.type || "NEW",
      status: "BOOKED",
      symptoms: oldAppointment.symptoms,
      paymentMethod: oldAppointment.paymentMethod,
      // Keep payment status as PAID if already paid
      paymentStatus: oldAppointment.paymentStatus === "PAID" ? "PAID" : oldAppointment.paymentStatus,
      confirmationStatus: oldAppointment.paymentStatus === "PAID" ? "CONFIRMED" : oldAppointment.confirmationStatus,
      rescheduledFrom: oldAppointment._id,
      rescheduleReason: rescheduleReason || "Rescheduled by reception",
    });

    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.json({
      message: "Appointment rescheduled successfully",
      oldAppointment,
      newAppointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
};

// PUT /appointments/:id/no-show - Mark appointment as NO_SHOW
exports.markNoShow = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Update appointment status to NO_SHOW
    appointment.status = "NO_SHOW";
    await appointment.save();

    // Check if this appointment is linked to a follow-up
    const followUp = await FollowUp.findOne({
      followUpAppointmentId: id,
      status: "CONFIRMED",
    });

    if (followUp) {
      // Update follow-up status to MISSED
      followUp.status = "MISSED";
      await followUp.save();
    }

    const populatedAppointment = await Appointment.findById(id)
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.json({
      message: "Appointment marked as no-show",
      appointment: populatedAppointment,
      followUpUpdated: !!followUp,
    });
  } catch (error) {
    console.error("Error marking no-show:", error);
    res.status(500).json({ error: "Failed to mark no-show" });
  }
};

// PUT /appointments/:id/confirm-cash - Confirm cash payment
exports.confirmCashPayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if payment method is CASH
    if (appointment.paymentMethod !== "CASH") {
      return res.status(400).json({ 
        error: "This endpoint is only for cash payments" 
      });
    }

    // Update payment and confirmation status
    appointment.paymentStatus = "PAID";
    appointment.confirmationStatus = "CONFIRMED";
    await appointment.save();

    const populatedAppointment = await Appointment.findById(id)
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.json({
      message: "Cash payment confirmed",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Error confirming cash payment:", error);
    res.status(500).json({ error: "Failed to confirm cash payment" });
  }
};

// GET /appointments/reception/all - Get all appointments with filters
exports.getReceptionAllAppointments = async (req, res) => {
  try {
    const { date, status, paymentStatus, confirmationStatus } = req.query;

    // Build query
    const query = {};
    
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (confirmationStatus) {
      query.confirmationStatus = confirmationStatus;
    }

    // Get appointments
    const appointments = await Appointment.find(query)
      .populate("patientId", "name phone email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort({ date: -1, timeSlot: 1 });

    // Calculate stats
    const stats = {
      total: appointments.length,
      byStatus: {
        booked: appointments.filter((a) => a.status === "BOOKED").length,
        seen: appointments.filter((a) => a.status === "SEEN").length,
        prescriptionDone: appointments.filter((a) => a.status === "PRESCRIPTION_DONE").length,
        rescheduleRequired: appointments.filter((a) => a.status === "RESCHEDULE_REQUIRED").length,
        noShow: appointments.filter((a) => a.status === "NO_SHOW").length,
        cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
      },
      byPaymentStatus: {
        pending: appointments.filter((a) => a.paymentStatus === "PENDING").length,
        paid: appointments.filter((a) => a.paymentStatus === "PAID").length,
        cashPending: appointments.filter((a) => a.paymentStatus === "CASH_PENDING").length,
      },
      byConfirmationStatus: {
        notConfirmed: appointments.filter((a) => a.confirmationStatus === "NOT_CONFIRMED").length,
        confirmed: appointments.filter((a) => a.confirmationStatus === "CONFIRMED").length,
      },
    };

    res.json({
      appointments,
      stats,
    });
  } catch (error) {
    console.error("Error getting all appointments:", error);
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

// POST /appointments/payment/create - Create Razorpay order for appointment
exports.createPaymentOrder = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;

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
    const doctor = await Doctor.findById(doctorId).populate("userId", "name");
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if consultationFee is set
    if (!doctor.consultationFee) {
      return res.status(400).json({ error: "Consultation fee not set for this doctor" });
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

    // Create Razorpay order
    const receipt = `apt_${Date.now()}_${req.user.id}`;
    const orderResult = await createOrder(doctor.consultationFee, "INR", receipt);

    if (!orderResult.success) {
      return res.status(500).json({ error: "Failed to create payment order" });
    }

    res.json({
      orderId: orderResult.order.id,
      amount: orderResult.order.amount,
      currency: orderResult.order.currency,
      consultationFee: doctor.consultationFee,
      doctorName: doctor.userId.name,
      receipt,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// POST /appointments/payment/verify - Verify payment and create appointment
exports.verifyPaymentAndBook = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      doctorId,
      date,
      timeSlot,
      symptoms,
    } = req.body;

    // Validate required fields
    if (!orderId || !paymentId || !signature || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ 
        error: "Missing required payment or appointment fields" 
      });
    }

    // Get patientId from authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Check if slot is still available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        error: "Slot was booked by someone else. Please select another slot. Payment will be refunded." 
      });
    }

    // Create appointment with payment confirmed
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      timeSlot,
      type: "NEW",
      status: "BOOKED",
      symptoms: symptoms || "",
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      confirmationStatus: "CONFIRMED",
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patientId", "name email phone")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      });

    res.status(201).json({
      message: "Payment verified and appointment confirmed",
      appointment: populatedAppointment,
      paymentId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment and book appointment" });
  }
};
