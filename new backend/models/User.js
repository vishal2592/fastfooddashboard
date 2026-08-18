const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional user-specific fields
    phone: {
      type: String,
      trim: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    profileImage: {
      type: String,
      default: null,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);