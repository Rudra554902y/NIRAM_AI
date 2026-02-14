const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const controller = require("../controllers/patientController");
const upload = require("../middleware/uploadMiddleware");

router.get(
  "/profile",
  authenticate,
  authorize("PATIENT"),
  controller.getProfile
);

router.put(
  "/medical-info",
  authenticate,
  authorize("PATIENT"),
  controller.updateMedicalInfo
);

router.post(
  "/upload",
  authenticate,
  authorize("PATIENT"),
  upload.single("file"),
  controller.uploadMedicalFile
);

module.exports = router;
