const { verifyAccessToken } = require("../utils/tokenUtils");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    // Get access token from cookie
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      // Token expired or invalid
      return res.status(401).json({ 
        error: "Invalid or expired access token",
        code: "TOKEN_EXPIRED"
      });
    }
    
    // Get user from token
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};
