const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
} = require("../controllers/adminAuthController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Register
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Profile
router.get("/profile", protectAdmin, getAdminProfile);

// Logout
router.post("/logout", protectAdmin, logoutAdmin);

module.exports = router;