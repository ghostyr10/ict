const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../Middlewares/authMiddleware");
const adminMiddleware = require("../Middlewares/adminMiddleware");

const {
  getPendingProducts,
  getApprovedProducts,
  getRejectedProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,

  getAdminAnalytics,

  getUpdateRequests,
  approveUpdateRequest,
  rejectUpdateRequest,

  getDeleteRequests,
  approveDeleteRequest,
  rejectDeleteRequest,

  adminAddProductDirect,

  banSeller,
  unbanSeller,
  getAllSellers,
} = require("../Controllers/AdminController");

// multer for admin direct add
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// protect admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// PRODUCTS
router.get("/products/pending", getPendingProducts);
router.get("/products/approved", getApprovedProducts);
router.get("/products/rejected", getRejectedProducts);

router.put("/products/approve/:id", approveProduct);
router.put("/products/reject/:id", rejectProduct);
router.delete("/products/:id", deleteProduct);

// ✅ ADMIN ANALYTICS
router.get("/analytics", getAdminAnalytics);

// ✅ UPDATE REQUESTS PAGE
router.get("/update-requests", getUpdateRequests);
router.put("/update-requests/approve/:id", approveUpdateRequest);
router.put("/update-requests/reject/:id", rejectUpdateRequest);

// ✅ DELETE REQUESTS PAGE
router.get("/delete-requests", getDeleteRequests);
router.put("/delete-requests/approve/:id", approveDeleteRequest);
router.put("/delete-requests/reject/:id", rejectDeleteRequest);

// ✅ ADMIN DIRECT ADD PRODUCT (no approval)
router.post("/products/add-direct", upload.single("image"), adminAddProductDirect);

// SELLERS
router.put("/seller/ban/:id", banSeller);
router.put("/seller/unban/:id", unbanSeller);
router.get("/sellers", getAllSellers);

module.exports = router;
