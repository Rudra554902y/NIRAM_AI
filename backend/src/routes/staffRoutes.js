const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { onlySuperDoctor } = require("../middleware/superDoctorMiddleware");
const controller = require("../controllers/staffController");

// Create staff (Super Doctor only)
router.post(
  "/create",
  authenticate,
  authorize("DOCTOR"),
  onlySuperDoctor,
  controller.createStaff
);

// Get all staff (Super Doctor only)
router.get(
  "/",
  authenticate,
  authorize("DOCTOR"),
  onlySuperDoctor,
  controller.getAllStaff
);

// Delete staff (Super Doctor only)
router.delete(
  "/:id",
  authenticate,
  authorize("DOCTOR"),
  onlySuperDoctor,
  controller.deleteStaff
);

module.exports = router;
