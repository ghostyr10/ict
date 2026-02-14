const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../Middlewares/authMiddleware");
const adminMiddleware = require("../Middlewares/adminMiddleware");

const {
  getBanner,
  addBanner,
  deleteBanner,
  toggleBanner,
} = require("../Controllers/BannerController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/banners"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// protect
router.use(authMiddleware);
router.use(adminMiddleware);

// ✅ THIS WAS MISSING
router.get("/", getBanner);

// admin actions
router.post("/add", upload.single("image"), addBanner);
router.put("/toggle/:id", toggleBanner);
router.delete("/:id", deleteBanner);

module.exports = router;