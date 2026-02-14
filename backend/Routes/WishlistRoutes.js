const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const Wishlist = require("../Models/Wishlist");

/* GET wishlist */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ADD / REMOVE wishlist */
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { productId } = req.body;
    productId = productId.trim(); // IMPORTANT (fix ObjectId error)

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    const index = wishlist.products.findIndex(
      (p) => p.toString() === productId
    );

    if (index > -1) {
      wishlist.products.splice(index, 1); // remove
    } else {
      wishlist.products.push(productId); // add
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
