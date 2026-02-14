const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../Middlewares/authMiddleware");
const Product = require("../Models/Product");

const { getApprovedProducts, addProduct } = require("../Controllers/ProductController");

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ================= PUBLIC ROUTES ================= */
router.get("/approved", getApprovedProducts);

/* ================= SELLER ROUTES ================= */
router.post("/add", authMiddleware, upload.single("image"), addProduct);

/* ================= PDP (KEEP LAST) ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: "approved" });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("PDP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
