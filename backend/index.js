const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

require("./Models/db"); // DB connection

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(bodyParser.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROUTES IMPORT ==================
const authRoutes = require("./Routes/Router");
const productRoutes = require("./Routes/ProductRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const adminBannerRoutes = require("./Routes/AdminBannerRoutes");
const userRoutes = require("./Routes/UserRoutes");
const homeRoutes = require("./Routes/HomeRoutes");
const productListRoutes = require("./Routes/ProductList");
const cartRoutes = require("./Routes/CartRoutes");
const wishlistRoutes = require("./Routes/WishlistRoutes");
const sellerRoutes = require("./Routes/SellerRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");

// ================== API ROUTES ==================

// Auth
app.use("/auth", authRoutes);

// Products
app.use("/products", productRoutes);

// Admin (products, sellers, analytics, etc.)
app.use("/admin", adminRoutes);

// ✅ Admin banners (TRENDING / HERO)
app.use("/admin/banners", adminBannerRoutes);

// Users
app.use("/users", userRoutes);

// Seller
app.use("/api/seller", sellerRoutes);

// Cart & Wishlist
app.use("/api/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

// Orders & Payments
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Home & product listing
app.use("/api", productListRoutes);
app.use("/api/home", homeRoutes);

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("E-Collect API is running...");
});

// ================== SERVER ==================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);