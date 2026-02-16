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

    type: {
      type: String,
      enum: ["NEW", "FOLLOW_UP"],
      default: "NEW",
    },

    status: {
      type: String,
      enum: [
        "BOOKED",
        "SEEN",
        "PRESCRIPTION_DONE",
        "RESCHEDULE_REQUIRED",
        "NO_SHOW",
        "CANCELLED",
      ],
      default: "BOOKED",
    },

    symptoms: { type: String },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "CASH"],
      default: "CASH",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "CASH_PENDING"],
      default: "CASH_PENDING",
    },

    confirmationStatus: {
      type: String,
      enum: ["NOT_CONFIRMED", "CONFIRMED"],
      default: "NOT_CONFIRMED",
    },

    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    rescheduleReason: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
