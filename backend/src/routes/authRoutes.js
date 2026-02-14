const router = require("express").Router();
const controller = require("../controllers/authController");

// Patient registration
router.post("/register", controller.registerPatient);

// Login (All roles)
router.post("/login", controller.login);

module.exports = router;
