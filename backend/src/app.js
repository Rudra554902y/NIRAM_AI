const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cookieParser());

// Session configuration for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
module.exports = app;
