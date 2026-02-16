const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["DOCTOR", "RECEPTIONIST", "PATIENT"],
      required: true,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
