const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

const {
  getSellerDashboard,
  getMyProducts,
  requestUpdateProduct,
  requestDeleteProduct,
  getSellerOrdersSimple,
} = require("../Controllers/SellerController");

// multer for update request image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/dashboard", authMiddleware, getSellerDashboard);
router.get("/my-products", authMiddleware, getMyProducts);

// update request + image
router.put("/my-products/:id/request-update", authMiddleware, upload.single("image"), requestUpdateProduct);

// delete request
router.put("/my-products/:id/request-delete", authMiddleware, requestDeleteProduct);

router.get("/orders-simple", authMiddleware, getSellerOrdersSimple);

module.exports = router;
