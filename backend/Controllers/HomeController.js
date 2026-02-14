const Product = require("../Models/Product");

exports.getHomeProducts = async (req, res) => {
  try {
    const { search, category, subCategory } = req.query;

    let query = { status: "approved" };

    // 🔍 Search by name OR subCategory (Dell, HP, etc.)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
      ];
    }

    // 📂 Filter category
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // 📂 Filter subCategory
    if (subCategory) {
      query.subCategory = { $regex: `^${subCategory}$`, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // 🧠 Group by category
    const grouped = {};
    products.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push({
        ...p._doc,
        image: p.image
          ? `${req.protocol}://${req.get("host")}/uploads/products/${p.image}`
          : null,
      });
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};