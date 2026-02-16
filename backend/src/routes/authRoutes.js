const router = require("express").Router();
const passport = require("passport");
const controller = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// Patient registration
router.post("/register", controller.registerPatient);

// Login (All roles)
router.post("/login", controller.login);

// Logout
router.post("/logout", controller.logout);

// Refresh access token
router.post("/refresh", controller.refreshAccessToken);

// Get current user
router.get("/me", authenticate, controller.getMe);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/api/auth/google/failure",
    session: false 
  }),
  controller.googleCallback
);

router.get("/google/failure", controller.googleFailure);

module.exports = router;
