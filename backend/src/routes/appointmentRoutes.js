const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/appointmentController");

// Get available slots
router.get(
  "/available-slots",
  authenticate,
  controller.getAvailableSlots
);

// Book appointment (Receptionist or Patient)
router.post(
  "/",
  authenticate,
  authorize("RECEPTIONIST", "PATIENT"),
  controller.bookAppointment
);

// Get today's appointments (Doctor)
router.get(
  "/doctor/today",
  authenticate,
  authorize("DOCTOR"),
  controller.getDoctorTodayAppointments
);

// Get today's appointments (Reception)
router.get(
  "/reception/today",
  authenticate,
  authorize("RECEPTIONIST"),
  controller.getReceptionTodayAppointments
);

// Reschedule appointment
router.put(
  "/reschedule/:id",
  authenticate,
  authorize("RECEPTIONIST"),
  controller.rescheduleAppointment
);

module.exports = router;
