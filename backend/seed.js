require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Doctor = require("./src/models/Doctor");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected");

    const existing = await User.findOne({
      email: "superdoctor@niram.com",
    });

    if (existing) {
      console.log("Super Doctor already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("super123", 10);

    const doctorUser = await User.create({
      name: "Dr. NIRAM",
      email: "superdoctor@niram.com",
      phone: "9000000000",
      password: hashed,
      role: "DOCTOR",
    });

    await Doctor.create({
      userId: doctorUser._id,
      specialization: "General Medicine",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 15,
      consultationFee: 500,
      isSuperDoctor: true,
    });

    console.log("✅ Super Doctor Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
