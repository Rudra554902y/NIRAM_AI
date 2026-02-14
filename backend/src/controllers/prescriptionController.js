const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.createPrescription = async (req, res) => {
  const prescription = await Prescription.create(req.body);

  await Appointment.findByIdAndUpdate(
    req.body.appointmentId,
    { status: "COMPLETED" }
  );

  res.json(prescription);
};
