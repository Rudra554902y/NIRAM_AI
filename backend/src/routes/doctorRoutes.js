const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/doctorController");

// Get doctor profile
router.get(
  "/profile",
  authenticate,
  authorize("DOCTOR"),
  controller.getDoctorProfile
);

// Mark emergency leave
router.put(
  "/emergency-leave",
  authenticate,
  authorize("DOCTOR"),
  controller.markEmergencyLeave
);

module.exports = router;
