const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["PLANNED_FULL", "PLANNED_PARTIAL", "EMERGENCY"],
      required: true,
    },

    date: { type: Date, required: true },

    // For partial planned leave
    fromTime: String, // "13:00"
    toTime: String,

    // For emergency leave
    emergencyAfterAppointments: Number, // e.g. 2 (leave after 2 more patients)
    emergencyAfterMinutes: Number, // optional alternative

    status: {
      type: String,
      enum: ["ACTIVE", "PROCESSED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: String,
  workingDays: [String],
  startTime: String,
  endTime: String,
  slotDuration: Number,
  consultationFee: {
    type: Number,
    required: true,
  },

  leaves: [leaveSchema], // 🔥 important change

  isSuperDoctor: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
