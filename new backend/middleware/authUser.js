const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authUser = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.userToken) {
      token = req.cookies.userToken;
    }

    // Check for token in Authorization header (Bearer token)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token.",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Auth User Middleware Error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
      error: error.message,
    });
  }
};

// Middleware to check specific roles
const authorizeUserRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = {
  authUser,
  authorizeUserRoles,
};