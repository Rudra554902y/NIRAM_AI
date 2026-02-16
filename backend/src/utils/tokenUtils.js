const jwt = require("jsonwebtoken");

/**
 * Generate short-lived access token (15 minutes)
 * @param {Object} user - User object with id and role
 * @returns {String} Access token
 */
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

/**
 * Generate long-lived refresh token (7 days)
 * @param {Object} user - User object with id and role
 * @returns {String} Refresh token
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Verify access token
 * @param {String} token - Access token
 * @returns {Object} Decoded token payload
 */
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify refresh token
 * @param {String} token - Refresh token
 * @returns {Object} Decoded token payload
 */
exports.verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};

/**
 * Get cookie options for access token
 * @returns {Object} Cookie options
 */
exports.getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
});

/**
 * Get cookie options for refresh token
 * @returns {Object} Cookie options
 */
exports.getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});
