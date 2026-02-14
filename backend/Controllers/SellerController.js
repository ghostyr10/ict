const Product = require("../Models/Product");
const Order = require("../Models/Order");

const ProductUpdateRequest = require("../Models/ProductUpdateRequest");
const ProductDeleteRequest = require("../Models/ProductDeleteRequest");

/* =====================================================
   1) SELLER DASHBOARD (analytics)
   ===================================================== */
exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ seller: sellerId });
    const productIds = products.map((p) => p._id);

    const orders = await Order.find({ "products.product": { $in: productIds } })
      .populate("products.product");

    let totalRevenue = 0;
    let totalSoldQty = 0;

    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (item.product?.seller?.toString() === sellerId.toString()) {
          totalRevenue += (item.price || 0) * (item.quantity || 1);
          totalSoldQty += item.quantity || 1;
        }
      });
    });

    res.json({
      totalProducts: products.length,
      approvedProducts: products.filter((p) => p.status === "approved").length,
      pendingProducts: products.filter((p) => p.status === "pending").length,
      rejectedProducts: products.filter((p) => p.status === "rejected").length,
      totalRevenue,
      totalSoldQty,
    });
  } catch (err) {
    console.error("SELLER DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard load failed" });
  }
};

/* =====================================================
   2) SELLER: MY PRODUCTS
   ===================================================== */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("MY PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =====================================================
   3) SELLER: REQUEST UPDATE (image supported)
   - DOES NOT update product directly
   ===================================================== */
exports.requestUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only allow updates for seller's own product
    const allowed = ["name", "category", "subCategory", "price", "quantity", "description"];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") updates[key] = req.body[key];
    });

    const newImage = req.file ? req.file.filename : null;

    const request = await ProductUpdateRequest.create({
      product: product._id,
      seller: req.user._id,
      updates,
      newImage,
      status: "pending",
    });

    res.json({ message: "Update request sent to admin", request });
  } catch (err) {
    console.error("REQUEST UPDATE ERROR:", err);
    res.status(500).json({ message: "Update request failed" });
  }
};

/* =====================================================
   4) SELLER: REQUEST DELETE
   ===================================================== */
exports.requestDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // avoid duplicate pending requests
    const already = await ProductDeleteRequest.findOne({
      product: product._id,
      seller: req.user._id,
      status: "pending",
    });
    if (already) return res.status(400).json({ message: "Delete request already pending" });

    const request = await ProductDeleteRequest.create({
      product: product._id,
      seller: req.user._id,
      status: "pending",
    });

    res.json({ message: "Delete request sent to admin", request });
  } catch (err) {
    console.error("REQUEST DELETE ERROR:", err);
    res.status(500).json({ message: "Delete request failed" });
  }
};

/* =====================================================
   5) SELLER ORDERS (simple)
   ONLY buyerName + productName + quantity
   ===================================================== */
exports.getSellerOrdersSimple = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name seller");

    const result = [];

    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (item.product?.seller?.toString() === sellerId.toString()) {
          result.push({
            buyerName: order.user?.name || order.user?.email || "Unknown",
            productName: item.product.name,
            quantity: item.quantity || 1,
          });
        }
      });
    });

    res.json(result);
  } catch (err) {
    console.error("SELLER ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
};
