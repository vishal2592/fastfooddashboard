const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");
const { authUser, authorizeUserRoles } = require("../middleware/authUser");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes (require authentication)
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);

// Admin only routes
router.get("/all", authUser, authorizeUserRoles("admin", "owner"), getAllUsers);
router.delete("/:id", authUser, authorizeUserRoles("admin", "owner"), deleteUser);
router.patch("/:id/toggle-status", authUser, authorizeUserRoles("admin", "owner"), toggleUserStatus);

module.exports = router;