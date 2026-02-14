const Cart = require("../Models/Cart");

// helper: always return frontend-friendly format
function toFrontendCart(cart) {
  const products = (cart?.items || [])
    .filter((it) => it && it.product) // remove broken items
    .map((it) => ({
      product: it.product,
      quantity: it.quantity || 1,
    }));

  return { products };
}

// GET user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    // populate products
    await cart.populate("items.product");

    // ✅ auto-remove items whose product became null (deleted product etc.)
    const before = cart.items.length;
    cart.items = cart.items.filter((it) => it && it.product);
    if (cart.items.length !== before) await cart.save();

    res.json(toFrontendCart(cart));
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => {
      const id = item.product?._id ? item.product._id : item.product;
      return String(id) === String(productId);
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    await cart.populate("items.product");

    // cleanup nulls
    cart.items = cart.items.filter((it) => it && it.product);
    await cart.save();

    res.json(toFrontendCart(cart));
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined)
      return res.status(400).json({ message: "ProductId and quantity required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => {
      const id = i.product?._id ? i.product._id : i.product;
      return String(id) === String(productId);
    });

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = Math.max(1, Number(quantity));
    await cart.save();

    await cart.populate("items.product");
    cart.items = cart.items.filter((it) => it && it.product);
    await cart.save();

    res.json(toFrontendCart(cart));
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE item
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => {
      const id = i.product?._id ? i.product._id : i.product;
      return String(id) !== String(productId);
    });

    await cart.save();
    await cart.populate("items.product");

    cart.items = cart.items.filter((it) => it && it.product);
    await cart.save();

    res.json(toFrontendCart(cart));
  } catch (err) {
    console.error("removeCartItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};