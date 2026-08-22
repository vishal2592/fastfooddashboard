const express = require("express");
const multer = require("multer");

const {
  uploadImages,
  getAllImages,
  getImagesById,
  deleteGallery,
} = require("../controllers/imageGalleryController");

const router = express.Router();

// =====================================================
// MULTER CONFIG
// =====================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
    files: 25,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// =====================================================
// UPLOAD MAX 25 IMAGES
// field name: images
// =====================================================

router.post(
  "/upload",
  upload.array("images", 25),
  uploadImages
);

// =====================================================
// GET ALL
// =====================================================

router.get("/", getAllImages);

// =====================================================
// GET SINGLE
// =====================================================

router.get("/:id", getImagesById);

// =====================================================
// DELETE
// =====================================================

router.delete("/:id", deleteGallery);

module.exports = router;