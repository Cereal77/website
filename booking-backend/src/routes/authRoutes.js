const express = require("express");
const router = express.Router();
const { register, login, verifyOTP, sendOtp } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


// Signup flow
router.post("/send-otp", sendOtp); // Step 1: send OTP to mobile
router.post("/verify-otp", verifyOTP); // Step 2: verify OTP
router.post("/register", register); // Step 3: register after OTP

// Login (for existing users)
router.post("/login", login);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.userId });
});

module.exports = router;
