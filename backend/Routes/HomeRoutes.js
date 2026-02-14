const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");
const { getHomeBanners } = require("../Controllers/BannerController");

// ✅ Public banners for homepage
// FINAL URL: GET http://localhost:8080/api/home/banners
router.get("/banners", getHomeBanners);

// ✅ Approved products for homepage
// FINAL URL: GET http://localhost:8080/api/home/products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .sort({ createdAt: -1 });

    const productsWithURL = products.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      subCategory: p.subCategory,
      seller: p.seller,
      image: p.image
        ? `${req.protocol}://${req.get("host")}/uploads/products/${p.image}`
        : null,
    }));

    res.json(productsWithURL);
  } catch (err) {
    console.error("Home products fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;