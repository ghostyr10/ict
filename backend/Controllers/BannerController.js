const Banner = require("../Models/Banner");

/* =====================
   GET ACTIVE BANNER
   ===================== */
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne().sort({ createdAt: -1 });
    res.json(banner || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

/* =====================
   ADD / UPDATE BANNER
   ===================== */
exports.addBanner = async (req, res) => {
  try {
    const { title, subtitle, active } = req.body;

    // remove old banner (only ONE banner system)
    await Banner.deleteMany({});

    const banner = await Banner.create({
      title,
      subtitle,
      active: active === "true",
      image: req.file?.filename || "",
    });

    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to save banner" });
  }
};

/* =====================
   TOGGLE ACTIVE
   ===================== */
exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.active = !banner.active;
    await banner.save();

    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle banner" });
  }
};

/* =====================
   DELETE
   ===================== */
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner" });
  }
};

/* ===============================
   GET HOME BANNERS (PUBLIC)
   =============================== */
exports.getHomeBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true })
      .sort({ createdAt: -1 });

    res.json(banners);
  } catch (err) {
    console.error("Get home banners error:", err);
    res.status(500).json({ message: "Server error" });
  }
};