const Product = require("../Models/Product");

/* ================= PUBLIC ================= */
exports.getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("getApprovedProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SELLER ADD (pending approval) ================= */
exports.addProduct = async (req, res) => {
  try {
    const { name, category, subCategory, price, quantity, description } = req.body;

    const product = new Product({
      name,
      category,
      subCategory,
      price,
      quantity,
      description,
      seller: req.user._id,
      image: req.file ? req.file.filename : null,
      status: "pending",
    });

    await product.save();
    res.json({ message: "Product submitted for approval", product });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
