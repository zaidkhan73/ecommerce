import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      total_price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
}, { timestamps: true });

// Prevent duplicates
cartSchema.pre("save", function (next) {
  const unique = new Set(this.items.map(i => i.product_id.toString()));
  if (unique.size !== this.items.length) {
    return next(new Error("Duplicate product in cart not allowed"));
  }
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
