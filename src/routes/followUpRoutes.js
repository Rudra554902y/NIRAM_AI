const express = require("express");
const router = express.Router();
const followUpController = require("../controllers/followUpController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Get patient follow-ups
router.get(
  "/patient/:id",
  authenticate,
  followUpController.getPatientFollowUps
);

// Confirm follow-up and create appointment
router.post(
  "/:id/confirm",
  authenticate,
  followUpController.confirmFollowUp
);

// Decline follow-up
router.put(
  "/:id/decline",
  authenticate,
  followUpController.declineFollowUp
);

// Get all follow-ups (reception/admin)
router.get(
  "/all",
  authenticate,
  authorize("RECEPTIONIST", "SUPER_DOCTOR"),
  followUpController.getAllFollowUps
);

module.exports = router;
