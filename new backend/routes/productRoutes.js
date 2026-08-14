const express = require("express");
const multer = require("multer");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Store image in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Create
router.post("/", upload.single("image"), createProduct);

// Get all
router.get("/", getProducts);

// Get single
router.get("/:id", getProduct);

// Update
router.put("/:id", upload.single("image"), updateProduct);

// Delete
router.delete("/:id", deleteProduct);

module.exports = router;