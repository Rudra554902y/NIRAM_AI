const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/aiController");

router.get(
  "/summary/:patientId",
  authenticate,
  authorize("DOCTOR"),
  controller.getMedicalSummary
);

module.exports = router;
