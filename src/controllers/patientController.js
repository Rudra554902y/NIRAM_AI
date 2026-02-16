const Patient = require("../models/Patient");
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    // Find patient by userId
    let patient = await Patient.findOne({ userId: req.user.id })
      .populate("userId", "name email phone");

    // If patient doesn't exist, create one
    if (!patient) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      patient = await Patient.create({
        userId: req.user.id,
        allergies: [],
        chronicDiseases: [],
        medicalHistory: [],
        medicalFiles: [],
      });

      patient = await Patient.findById(patient._id)
        .populate("userId", "name email phone");
    }

    res.json({ patient });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.updateMedicalInfo = async (req, res) => {
  try {
    let patient = await Patient.findOne({ userId: req.user.id });

    // Create patient profile if doesn't exist
    if (!patient) {
      patient = await Patient.create({
        userId: req.user.id,
        allergies: [],
        chronicDiseases: [],
        medicalHistory: [],
        medicalFiles: [],
      });
    }

    const {
      age,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      medicalHistory,
    } = req.body;

    // Validate age
    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 150)) {
      return res.status(400).json({ error: "Invalid age value" });
    }

    // Validate gender
    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ error: "Invalid gender value" });
    }

    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (bloodGroup !== undefined && !validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: "Invalid blood group" });
    }

    // Validate arrays
    if (allergies !== undefined && !Array.isArray(allergies)) {
      return res.status(400).json({ error: "Allergies must be an array" });
    }

    if (chronicDiseases !== undefined && !Array.isArray(chronicDiseases)) {
      return res.status(400).json({ error: "Chronic diseases must be an array" });
    }

    if (medicalHistory !== undefined && !Array.isArray(medicalHistory)) {
      return res.status(400).json({ error: "Medical history must be an array" });
    }

    // Update fields
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (allergies !== undefined) patient.allergies = allergies;
    if (chronicDiseases !== undefined) patient.chronicDiseases = chronicDiseases;
    if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;

    await patient.save();

    res.json({ 
      message: "Medical information updated successfully",
      patient 
    });
  } catch (error) {
    console.error("Error updating medical info:", error);
    res.status(500).json({ error: "Failed to update medical info" });
  }
};

exports.uploadMedicalFile = async (req, res) => {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file type (only PDF, images, and common medical file types)
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/dicom',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: "Invalid file type. Only PDF, images, and documents are allowed" 
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: "File too large. Maximum size is 10MB" 
      });
    }

    let patient = await Patient.findOne({ userId: req.user.id });

    // Create patient profile if doesn't exist
    if (!patient) {
      patient = await Patient.create({
        userId: req.user.id,
        allergies: [],
        chronicDiseases: [],
        medicalHistory: [],
        medicalFiles: [],
      });
    }

    // Add file to patient's medical files
    patient.medicalFiles.push({
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploadedAt: new Date(),
    });

    await patient.save();

    res.json({ 
      message: "File uploaded successfully",
      file: {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
