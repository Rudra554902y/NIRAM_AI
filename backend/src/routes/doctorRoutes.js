const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/doctorController");

// Public endpoint - Get all doctors list
router.get("/list", controller.getPublicDoctorList);

// Get doctor profile
router.get(
  "/profile",
  authenticate,
  authorize("DOCTOR"),
  controller.getDoctorProfile
);

// Get today's appointments
router.get(
  "/appointments/today",
  authenticate,
  authorize("DOCTOR"),
  controller.getTodayAppointments
);

// Mark appointment as seen
router.put(
  "/appointments/:id/seen",
  authenticate,
  authorize("DOCTOR"),
  controller.markAppointmentSeen
);

// Mark emergency leave
router.post(
  "/emergency-leave",
  authenticate,
  authorize("DOCTOR"),
  controller.markEmergencyLeave
);

module.exports = router;
