const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialization, workingDays, startTime, endTime, slotDuration, consultationFee } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ 
        error: "Missing required fields: name, email, phone, password, role" 
      });
    }

    // Validate role
    if (!["DOCTOR", "RECEPTIONIST"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be DOCTOR or RECEPTIONIST" });
    }

    // Validate doctor-specific fields
    if (role === "DOCTOR") {
      if (!specialization) {
        return res.status(400).json({ error: "Specialization is required for doctors" });
      }
      if (!consultationFee || consultationFee <= 0) {
        return res.status(400).json({ error: "Valid consultation fee is required for doctors" });
      }
    }

    // Check if user already exists
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(409).json({ 
        error: existing.email === email 
          ? "Email already registered" 
          : "Phone number already registered" 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
    });

    // Create doctor profile if role is DOCTOR
    if (role === "DOCTOR") {
      await Doctor.create({
        userId: user._id,
        specialization,
        workingDays: workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: startTime || "09:00",
        endTime: endTime || "17:00",
        slotDuration: slotDuration || 15,
        consultationFee,
        isSuperDoctor: false, // Regular doctors are not super doctors
      });
    }

    res.status(201).json({ 
      message: `${role} created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ error: "Failed to create staff" });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    // Get all staff members (doctors and receptionists)
    const staff = await User.find({
      role: { $in: ["DOCTOR", "RECEPTIONIST"] }
    }).select("-password -refreshToken");

    // Get doctor profiles
    const doctors = await Doctor.find().populate("userId", "name email phone");

    // Combine data
    const staffWithDetails = staff.map(user => {
      const doctorProfile = doctors.find(d => d.userId._id.toString() === user._id.toString());
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        doctorDetails: doctorProfile ? {
          specialization: doctorProfile.specialization,
          workingDays: doctorProfile.workingDays,
          startTime: doctorProfile.startTime,
          endTime: doctorProfile.endTime,
          slotDuration: doctorProfile.slotDuration,
          consultationFee: doctorProfile.consultationFee,
          isSuperDoctor: doctorProfile.isSuperDoctor,
        } : null,
        createdAt: user.createdAt,
      };
    });

    res.json({
      staff: staffWithDetails,
      total: staffWithDetails.length,
      doctors: staffWithDetails.filter(s => s.role === "DOCTOR").length,
      receptionists: staffWithDetails.filter(s => s.role === "RECEPTIONIST").length,
    });
  } catch (error) {
    console.error("Error getting staff:", error);
    res.status(500).json({ error: "Failed to get staff list" });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Prevent deleting patients
    if (user.role === "PATIENT") {
      return res.status(400).json({ error: "Cannot delete patients through this endpoint" });
    }

    // Check if trying to delete a super doctor
    if (user.role === "DOCTOR") {
      const doctor = await Doctor.findOne({ userId: id });
      if (doctor && doctor.isSuperDoctor) {
        return res.status(403).json({ error: "Cannot delete Super Doctor" });
      }
      
      // Delete doctor profile
      if (doctor) {
        await Doctor.deleteOne({ userId: id });
      }
    }

    // Delete user
    await User.deleteOne({ _id: id });

    res.json({ message: `${user.role} deleted successfully` });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ error: "Failed to delete staff" });
  }
};
