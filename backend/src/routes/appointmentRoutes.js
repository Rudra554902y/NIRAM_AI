const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const appointmentController = require("../controllers/appointmentController");
const doctorController = require("../controllers/doctorController");
const prescriptionController = require("../controllers/prescriptionController");

// Get available slots
router.get(
  "/available-slots",
  authenticate,
  appointmentController.getAvailableSlots
);

// Create payment order for online booking
router.post(
  "/payment/create",
  authenticate,
  authorize("PATIENT"),
  appointmentController.createPaymentOrder
);

// Verify payment and book appointment
router.post(
  "/payment/verify",
  authenticate,
  authorize("PATIENT"),
  appointmentController.verifyPaymentAndBook
);

// Book appointment (Receptionist or Patient)
router.post(
  "/",
  authenticate,
  authorize("RECEPTIONIST", "PATIENT"),
  appointmentController.bookAppointment
);

// Get today's appointments (Doctor) - redirects to doctor controller
router.get(
  "/doctor/today",
  authenticate,
  authorize("DOCTOR"),
  doctorController.getTodayAppointments
);

// Get today's appointments (Reception)
router.get(
  "/reception/today",
  authenticate,
  authorize("RECEPTIONIST"),
  appointmentController.getReceptionTodayAppointments
);

// Get all appointments with filters (Reception)
router.get(
  "/reception/all",
  authenticate,
  authorize("RECEPTIONIST", "SUPER_DOCTOR"),
  appointmentController.getReceptionAllAppointments
);

// Reschedule appointment
router.put(
  "/:id/reschedule",
  authenticate,
  authorize("RECEPTIONIST"),
  appointmentController.rescheduleAppointment
);

// Mark appointment as no-show
router.put(
  "/:id/no-show",
  authenticate,
  authorize("RECEPTIONIST"),
  appointmentController.markNoShow
);

// Confirm cash payment
router.put(
  "/:id/confirm-cash",
  authenticate,
  authorize("RECEPTIONIST"),
  appointmentController.confirmCashPayment
);

// Mark-seen by doctor - redirects to doctor controller
router.put(
  "/:id/mark-seen",
  authenticate,
  authorize("DOCTOR"),
  doctorController.markAppointmentSeen
);

// Receptionist pending prescriptions - redirects to prescription controller
router.get(
  "/reception/pending-prescriptions",
  authenticate,
  authorize("RECEPTIONIST"),
  prescriptionController.getPendingPrescriptions
);

module.exports = router;
