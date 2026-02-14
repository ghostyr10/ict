const Product = require("../Models/Product");
const User = require("../Models/User");
const Order = require("../Models/Order");

const ProductUpdateRequest = require("../Models/ProductUpdateRequest");
const ProductDeleteRequest = require("../Models/ProductDeleteRequest");

/* ----------------- PRODUCTS (Pending/Approved/Rejected) ----------------- */

exports.getPendingProducts = async (req, res) => {
  try {
    const { search = "", category = "", subCategory = "" } = req.query;
    const query = { status: "pending" };

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("seller", "name email isBanned")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Get pending products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .populate("seller", "name email isBanned")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Get approved products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRejectedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "rejected" })
      .populate("seller", "name email isBanned")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Get rejected products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product approved", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product rejected", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------- ADMIN ANALYTICS ----------------- */
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalPending = await Product.countDocuments({ status: "pending" });
    const totalOrders = await Order.countDocuments();

    res.json({ totalProducts, totalPending, totalOrders });
  } catch (err) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ message: "Analytics error" });
  }
};

/* ----------------- UPDATE REQUESTS ----------------- */
exports.getUpdateRequests = async (req, res) => {
  try {
    const requests = await ProductUpdateRequest.find({ status: "pending" })
      .populate("product")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Get update requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveUpdateRequest = async (req, res) => {
  try {
    const request = await ProductUpdateRequest.findById(req.params.id).populate("product");
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Request already processed" });

    const product = await Product.findById(request.product._id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // apply changes
    const updates = request.updates || {};
    Object.keys(updates).forEach((k) => {
      if (updates[k] !== undefined && updates[k] !== null && updates[k] !== "") {
        product[k] = updates[k];
      }
    });

    if (request.newImage) product.image = request.newImage;

    await product.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "Update request approved", product });
  } catch (err) {
    console.error("Approve update request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectUpdateRequest = async (req, res) => {
  try {
    const request = await ProductUpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    request.adminNote = req.body?.adminNote || "";
    await request.save();

    res.json({ message: "Update request rejected" });
  } catch (err) {
    console.error("Reject update request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------- DELETE REQUESTS ----------------- */
exports.getDeleteRequests = async (req, res) => {
  try {
    const requests = await ProductDeleteRequest.find({ status: "pending" })
      .populate("product")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Get delete requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveDeleteRequest = async (req, res) => {
  try {
    const request = await ProductDeleteRequest.findById(req.params.id).populate("product");
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Request already processed" });

    await Product.findByIdAndDelete(request.product._id);

    request.status = "approved";
    await request.save();

    res.json({ message: "Delete request approved. Product deleted." });
  } catch (err) {
    console.error("Approve delete request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectDeleteRequest = async (req, res) => {
  try {
    const request = await ProductDeleteRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    request.adminNote = req.body?.adminNote || "";
    await request.save();

    res.json({ message: "Delete request rejected" });
  } catch (err) {
    console.error("Reject delete request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------- ADMIN DIRECT ADD PRODUCT (NO APPROVAL) ----------------- */
exports.adminAddProductDirect = async (req, res) => {
  try {
    const { name, category, subCategory, price, quantity, description } = req.body;

    const product = new Product({
      name,
      category,
      subCategory,
      price,
      quantity,
      description,
      seller: req.user._id, // admin as seller
      image: req.file ? req.file.filename : null,
      status: "approved", // ✅ direct approve
    });

    await product.save();
    res.json({ message: "Product added by admin (approved)", product });
  } catch (err) {
    console.error("adminAddProductDirect error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------- SELLERS ----------------- */
exports.banSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ message: "Seller not found" });
    res.json({ message: "Seller banned", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.unbanSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: "Seller not found" });
    res.json({ message: "Seller unbanned", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
