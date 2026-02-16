const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} = require("../utils/tokenUtils");

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

    // 3️⃣ Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 4️⃣ Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // 5️⃣ Set HTTP-only cookies
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    // 6️⃣ Return user data without password
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
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();


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

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set HTTP-only cookies
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

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
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    // Remove refresh token from database
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    // Clear both cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
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
    const user = await User.findById(req.user.id).select("-password -refreshToken");

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

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set HTTP-only cookies
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

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

/**
 * ===============================
 * REFRESH ACCESS TOKEN
 * ===============================
 */
exports.refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    // Find user and verify refresh token matches database
    // Note: We need refreshToken field here for validation, but it won't be exposed in response
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, getAccessTokenCookieOptions());

    // Return success
    res.json({
      message: "Access token refreshed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
