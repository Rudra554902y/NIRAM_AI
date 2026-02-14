const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.markEmergencyLeave = async (req, res) => {
  const { leaveDate, leaveFromTime } = req.body;

  const doctor = await Doctor.findOne({ userId: req.user._id });

  doctor.leaveDate = leaveDate;
  doctor.leaveFromTime = leaveFromTime;
  await doctor.save();

  const affected = await Appointment.find({
    doctorId: doctor._id,
    date: leaveDate,
    timeSlot: { $gt: leaveFromTime },
  });

  for (let app of affected) {
    app.status = "RESCHEDULE_REQUIRED";
    await app.save();
  }

  res.json({ message: "Emergency processed", affected });
};
