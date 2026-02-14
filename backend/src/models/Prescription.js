const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    medicines: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],
    tests: [String],
    notes: String,
    followUpDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
