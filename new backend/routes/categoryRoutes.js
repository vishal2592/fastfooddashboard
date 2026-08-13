const express = require("express");
const multer = require("multer");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// ==========================================
// MULTER CONFIG
// ==========================================

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter,
});

// ==========================================
// ROUTES
// ==========================================

// Create
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createCategory
);

// Get all
router.get(
  "/",
  getCategories
);

// Get single
router.get(
  "/:id",
  getCategoryById
);

// Update
router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateCategory
);

// Delete
router.delete(
  "/:id",
  protectAdmin,
  deleteCategory
);

module.exports = router;