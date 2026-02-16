const Doctor = require("../models/Doctor");

exports.onlySuperDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor || !doctor.isSuperDoctor) {
      return res.status(403).json({
        error: "Only Main Doctor can perform this action",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Authorization error" });
  }
};
