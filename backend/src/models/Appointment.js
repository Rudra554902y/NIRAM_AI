const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "BOOKED",
        "SEEN",
        "PRESCRIPTION_DONE",
        "RESCHEDULE_REQUIRED",
      ],
      default: "BOOKED",
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
