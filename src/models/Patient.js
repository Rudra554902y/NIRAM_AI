const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    condition: String,          // e.g. Diabetes
    diagnosedDate: Date,
    notes: String,
    isChronic: Boolean,
  },
  { _id: false }
);

const medicalFileSchema = new mongoose.Schema(
  {
    fileUrl: String,
    fileName: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: Number,
    gender: String,
    bloodGroup: String,

    allergies: [String],              // ["Penicillin"]
    chronicDiseases: [String],        // ["Hypertension"]

    medicalHistory: [medicalHistorySchema],

    medicalFiles: [medicalFileSchema],

    lastSummaryGeneratedAt: Date,     // For AI optimization

  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
