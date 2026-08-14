const axios = require("axios");

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

module.exports = uploadToImgBB;