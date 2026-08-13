const axios = require("axios");
const Category = require("../models/Category");

// ==========================================
// Upload Image To ImgBB
// ==========================================
const uploadToImgBB = async (file) => {
  try {
    if (!file) {
      throw new Error("Image file is required");
    }

    if (!process.env.IMGBB_API_KEY) {
      throw new Error("IMGBB_API_KEY is missing in .env");
    }

    const base64Image = file.buffer.toString("base64");

    const formData = new URLSearchParams();

    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", base64Image);
    formData.append("name", file.originalname);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        maxBodyLength: Infinity,
      }
    );

    if (!response.data?.success || !response.data?.data) {
      throw new Error("ImgBB image upload failed");
    }

    return {
      url: response.data.data.url,
      deleteUrl: response.data.data.delete_url || null,
    };
  } catch (error) {
    console.error(
      "ImgBB Upload Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to upload image to ImgBB"
    );
  }
};

// ==========================================
// Delete Image From ImgBB
// ==========================================
const deleteFromImgBB = async (deleteUrl) => {
  try {
    if (!deleteUrl) {
      return;
    }

    await axios.get(deleteUrl);

    console.log("Old ImgBB image deleted");
  } catch (error) {
    console.error(
      "ImgBB Delete Error:",
      error.response?.data || error.message
    );

    // Don't stop category operation if image deletion fails
  }
};

// ==========================================
// CREATE CATEGORY
// ==========================================
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      productCount,
      status,
    } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Upload image to ImgBB
    const uploadedImage = await uploadToImgBB(req.file);

    // Create category
    const category = await Category.create({
      name: name.trim(),

      description: description.trim(),

      image: uploadedImage.url,

      imageDeleteUrl: uploadedImage.deleteUrl,

      productCount:
        productCount !== undefined
          ? Number(productCount)
          : 0,

      status:
        status === "Unavailable"
          ? "Unavailable"
          : "Available",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE CATEGORY
// ==========================================
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      productCount,
      status,
    } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ======================================
    // Check duplicate name
    // ======================================
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name already exists",
        });
      }

      category.name = name.trim();
    }

    // ======================================
    // Update basic fields
    // ======================================
    if (description !== undefined) {
      category.description = description.trim();
    }

    if (productCount !== undefined) {
      const count = Number(productCount);

      if (Number.isNaN(count) || count < 0) {
        return res.status(400).json({
          success: false,
          message: "productCount must be a valid positive number",
        });
      }

      category.productCount = count;
    }

    if (status !== undefined) {
      if (!["Available", "Unavailable"].includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be Available or Unavailable",
        });
      }

      category.status = status;
    }

    // ======================================
    // Update Image
    // ======================================
    if (req.file) {
      // Upload new image
      const uploadedImage = await uploadToImgBB(req.file);

      const oldDeleteUrl = category.imageDeleteUrl;

      category.image = uploadedImage.url;

      category.imageDeleteUrl =
        uploadedImage.deleteUrl;

      // Save category first
      await category.save();

      // Delete old image
      if (oldDeleteUrl) {
        await deleteFromImgBB(oldDeleteUrl);
      }

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
      });
    }

    // Save without changing image
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image from ImgBB
    if (category.imageDeleteUrl) {
      await deleteFromImgBB(
        category.imageDeleteUrl
      );
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};