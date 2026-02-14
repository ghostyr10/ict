const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const Cart = require("../Models/Cart");

// helper: remove broken items whose product is deleted (populate returns null)
async function cleanNullProducts(cart) {
  const before = cart.products.length;
  cart.products = cart.products.filter((p) => p && p.product);
  if (cart.products.length !== before) {
    await cart.save();
  }
}

// GET user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
      return res.json({ products: [] });
    }

    // ✅ cleanup null populated products (deleted product etc.)
    await cleanNullProducts(cart);

    // ✅ return ONLY what frontend expects
    res.json({ products: cart.products });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD item to cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "productId required" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, products: [] });

    const qty = Math.max(1, Number(quantity || 1));

    const existing = cart.products.find((p) => String(p.product) === String(productId));
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.products.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("products.product");

    await cleanNullProducts(cart);

    res.json({ products: cart.products });
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;