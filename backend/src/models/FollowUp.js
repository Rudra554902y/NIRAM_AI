const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    originalAppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
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
    recommendedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "MISSED",
        "DECLINED",
        "EXPIRED",
      ],
      default: "PENDING",
    },
    followUpAppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    responseAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", followUpSchema);
