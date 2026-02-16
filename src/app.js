const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const cors = require("cors");
const path = require("path");
const app = express();

// Suppress Mongoose deprecation warnings
process.env.MONGOOSE_SUPPRESS_INDEX_WARNING = 'true';

// CORS configuration - Allow all localhost origins
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration for passport (only for OAuth)
// MemoryStore is fine for development; use Redis/MongoDB in production
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
app.get("/",(req,res)=>{
  res.send("Welcome from NIRAM AI Server 🚀")
})
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
app.use("/api/followups", require("./routes/followUpRoutes"));
module.exports = app;
