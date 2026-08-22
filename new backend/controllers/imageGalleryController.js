const ImageGallery = require("../models/ImageGallery");
const uploadToImgBB = require("../utils/uploadToImgBB");

// =====================================================
// UPLOAD MAX 25 IMAGES TO IMGBB
// =====================================================
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    if (req.files.length > 25) {
      return res.status(400).json({
        success: false,
        message: "Maximum 25 images are allowed",
      });
    }

    const uploadedImages = [];

    // Upload images one by one
    for (const file of req.files) {
      try {
        const uploadedImage = await uploadToImgBB(file);

        uploadedImages.push({
          url: uploadedImage.url,
          deleteUrl: uploadedImage.deleteUrl || null,
          originalName: file.originalname,
        });
      } catch (error) {
        console.error(
          `Failed to upload ${file.originalname}:`,
          error.message
        );
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload images to ImgBB",
      });
    }

    const gallery = await ImageGallery.create({
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: gallery,
    });
  } catch (error) {
    console.error("Upload Images Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL IMAGE GALLERIES
// =====================================================
const getAllImages = async (req, res) => {
  try {
    const galleries = await ImageGallery.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    console.error("Get Images Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get images",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE GALLERY
// =====================================================
const getImagesById = async (req, res) => {
  try {
    const gallery = await ImageGallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Image gallery not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Get Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get gallery",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE GALLERY FROM DATABASE
// =====================================================
const deleteGallery = async (req, res) => {
  try {
    const gallery = await ImageGallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Image gallery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image gallery deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImages,
  getAllImages,
  getImagesById,
  deleteGallery,
};