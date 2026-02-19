const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// In-memory store for OTPs (for demo; use Redis or DB in production)
const otpStore = {};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// SEND OTP (Step 1)
exports.sendOtp = async (req, res) => {
  try {
    const { mobileNo } = req.body;
    if (!mobileNo) return res.status(400).json({ message: "Mobile number is required" });

    // Check if already registered
    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) return res.status(400).json({ message: "Mobile number already registered" });

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore[mobileNo] = { otp, otpExpiry, verified: false };
    console.log(`OTP for ${mobileNo}: ${otp}`);
    res.json({ message: "OTP sent", expiresIn: "5 minutes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OTP (Step 2)
exports.verifyOTP = async (req, res) => {
  try {
    const { mobileNo, otp } = req.body;
    if (!mobileNo || !otp) return res.status(400).json({ message: "Mobile number and OTP are required" });

    const otpData = otpStore[mobileNo];
    if (!otpData) return res.status(400).json({ message: "No OTP requested for this number" });
    if (Date.now() > otpData.otpExpiry) return res.status(400).json({ message: "OTP expired" });
    if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    otpData.verified = true;
    res.json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER (Step 3)
exports.register = async (req, res) => {
  try {
    const { username, email, mobileNo, password } = req.body;
    if (!username || !email || !mobileNo || !password) return res.status(400).json({ message: "All fields are required" });

    // Check OTP verified
    const otpData = otpStore[mobileNo];
    if (!otpData || !otpData.verified) return res.status(400).json({ message: "OTP not verified for this number" });

    // Check if already registered
    const existingUser = await User.findOne({ $or: [ { mobileNo }, { email } ] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        return res.status(400).json({ message: "Mobile number already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      mobileNo,
      password: hashedPassword,
    });

    // Clean up OTP store
    delete otpStore[mobileNo];

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN (for existing users, not used in signup flow)
exports.login = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;
    if (!mobileNo || !password) {
      return res.status(400).json({ message: "Mobile number and password are required" });
    }
    const user = await User.findOne({ mobileNo });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
