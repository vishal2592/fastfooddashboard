require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dns = require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"])

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// ROUTES
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/admin", adminAuthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// =========================
// DATABASE
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });