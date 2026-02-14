const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: String,
  workingDays: [String], // ["Monday", "Tuesday"]
  startTime: String,     // "09:00"
  endTime: String,       // "17:00"
  slotDuration: Number,  // in minutes
  leaveDate: Date,
  leaveFromTime: String, // optional (mid-day leave)
});

module.exports = mongoose.model("Doctor", doctorSchema);
