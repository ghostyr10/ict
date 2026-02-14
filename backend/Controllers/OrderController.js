// Controllers/OrderController.js
const Order = require("../Models/Order");

/* ================= CREATE ORDER ================= */
const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    let totalAmount = 0;

    const formattedProducts = products.map((item) => {
      const qty = item.quantity || 1;
      totalAmount += item.price * qty;

      return {
        product: item._id,
        quantity: qty,
        price: item.price,
      };
    });

    const order = new Order({
      user: req.user._id,
      products: formattedProducts,
      totalAmount,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ================= MY ORDERS ================= */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= ORDER BY ID ================= */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};