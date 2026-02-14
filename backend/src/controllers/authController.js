const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * ===============================
 * PATIENT REGISTRATION
 * ===============================
 */
exports.registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: "Missing required fields: name, email, phone, password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        error:
          existingUser.email === email
            ? "Email already registered"
            : "Phone number already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 1️⃣ Create User
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role: "PATIENT",
    });

    // 2️⃣ Create Patient Profile (separate collection)
    await Patient.create({
      userId: user._id,
      allergies: [],
      chronicDiseases: [],
      medicalHistory: [],
      medicalFiles: [],
    });

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5️⃣ Return user data without password
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ error: "Failed to register patient" });
  }
};

/**
 * ===============================
 * LOGIN (ALL ROLES)
 * ===============================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return user data
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 * ===============================
 * LOGOUT
 * ===============================
 */
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};

/**
 * ===============================
 * GET CURRENT USER
 * ===============================
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

/**
 * ===============================
 * GOOGLE OAUTH CALLBACK
 * ===============================
 */
exports.googleCallback = async (req, res) => {
  try {
    // User is authenticated via passport
    const user = req.user;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend dashboard or success page
    const redirectUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${redirectUrl}/dashboard?login=success`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    const redirectUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${redirectUrl}/login?error=oauth_failed`);
  }
};

/**
 * ===============================
 * GOOGLE OAUTH FAILURE
 * ===============================
 */
exports.googleFailure = (req, res) => {
  const redirectUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${redirectUrl}/login?error=oauth_failed`);
};
