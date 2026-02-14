const mongoose = require("mongoose");

const productUpdateRequestSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // only fields that seller wants to change
    updates: { type: Object, default: {} },

    // optional new image filename
    newImage: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductUpdateRequest", productUpdateRequestSchema);
