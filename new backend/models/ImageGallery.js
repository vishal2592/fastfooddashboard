const mongoose = require("mongoose");

const imageGallerySchema = new mongoose.Schema(
  {
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        deleteUrl: {
          type: String,
          default: null,
        },
        originalName: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ImageGallery", imageGallerySchema);