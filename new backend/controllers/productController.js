const Product = require("../models/Product");
const Category = require("../models/Category");
const uploadToImgBB = require("../utils/uploadToImgBB");

// Calculate discounted price
const calculateDiscountedPrice = (originalPrice, discount) => {
  return Number(
    (originalPrice - (originalPrice * discount) / 100).toFixed(2)
  );
};

// ===============================
// CREATE PRODUCT
// ===============================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      originalPrice,
      discount = 0,
      stock = 0,
      status = "Available",
      rating = 0,
    } = req.body;

    if (!name || !category || originalPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and originalPrice are required",
      });
    }

    // Check category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const price = Number(originalPrice);
    const discountValue = Number(discount);

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid original price",
      });
    }

    if (
      isNaN(discountValue) ||
      discountValue < 0 ||
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    // Upload image
    const uploadedImage = await uploadToImgBB(req.file);

    const discountedPrice = calculateDiscountedPrice(
      price,
      discountValue
    );

    const product = await Product.create({
      name,
      category,
      description,
      originalPrice: price,
      discount: discountValue,
      discountedPrice,
      stock: Number(stock),
      status,
      rating: Number(rating),
      image: uploadedImage.url,
      imageDeleteUrl: uploadedImage.deleteUrl,
    });

    // Increase category product count
    await Category.findByIdAndUpdate(category, {
      $inc: { productCount: 1 },
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      description,
      originalPrice,
      discount,
      stock,
      status,
      rating,
    } = req.body;

    // If category is changed
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "New category not found",
        });
      }
    }

    // Price
    const price =
      originalPrice !== undefined
        ? Number(originalPrice)
        : product.originalPrice;

    // Discount
    const discountValue =
      discount !== undefined
        ? Number(discount)
        : product.discount;

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid original price",
      });
    }

    if (
      isNaN(discountValue) ||
      discountValue < 0 ||
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    // Update image only if new image provided
    let image = product.image;
    let imageDeleteUrl = product.imageDeleteUrl;

    if (req.file) {
      const uploadedImage = await uploadToImgBB(req.file);

      image = uploadedImage.url;
      imageDeleteUrl = uploadedImage.deleteUrl;
    }

    const oldCategory = product.category.toString();
    const newCategory = category || oldCategory;

    product.name = name ?? product.name;
    product.category = newCategory;
    product.description = description ?? product.description;
    product.originalPrice = price;
    product.discount = discountValue;

    product.discountedPrice = calculateDiscountedPrice(
      price,
      discountValue
    );

    product.stock =
      stock !== undefined ? Number(stock) : product.stock;

    product.status = status ?? product.status;

    product.rating =
      rating !== undefined ? Number(rating) : product.rating;

    product.image = image;
    product.imageDeleteUrl = imageDeleteUrl;

    await product.save();

    // Update category counts if category changed
    if (oldCategory !== newCategory) {
      await Category.findByIdAndUpdate(oldCategory, {
        $inc: { productCount: -1 },
      });

      await Category.findByIdAndUpdate(newCategory, {
        $inc: { productCount: 1 },
      });
    }

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const categoryId = product.category;

    await Product.findByIdAndDelete(id);

    // Decrease category product count
    await Category.findByIdAndUpdate(categoryId, {
      $inc: { productCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};