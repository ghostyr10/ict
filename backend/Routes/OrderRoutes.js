const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../Controllers/OrderController");

/* ================= ROUTES ================= */
router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;