const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/prescriptionController");

// Create prescription (Reception only)
router.post(
  "/",
  authenticate,
  authorize("RECEPTIONIST"),
  controller.createPrescription
);

// Get prescriptions by patient
router.get(
  "/patient/:id",
  authenticate,
  controller.getPatientPrescriptions
);

module.exports = router;
