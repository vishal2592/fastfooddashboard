const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT for User
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =========================
// USER REGISTER
// =========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user", // Default role
      phone: phone || undefined,
      address: address || undefined,
    });

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return response (excluding password)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// USER LOGIN
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET USER PROFILE
// =========================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// UPDATE USER PROFILE
// =========================
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update basic info
    if (name) user.name = name.trim();
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Handle password change
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// USER LOGOUT
// =========================
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "User logout successful",
    });
  } catch (error) {
    console.error("Logout User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET ALL USERS (Admin only)
// =========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// DELETE USER (Admin only)
// =========================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last admin user",
        });
      }
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// TOGGLE USER STATUS (Admin only)
// =========================
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deactivating the last admin
    if (user.role === "admin" && user.isActive) {
      const adminCount = await User.countDocuments({ role: "admin", isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot deactivate the last active admin",
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
};