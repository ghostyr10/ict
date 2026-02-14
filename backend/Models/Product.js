const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },

    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },

    image: { type: String, default: null }, // filename only

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
