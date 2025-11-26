import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      product_name: { type: String, required: true },
      product_image: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],

  total_amount: {
    type: Number,
    required: true
  },

  order_status: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
    default: "placed"
  },

  payment_method:{
        type:String,
        enum:['cash_on_delivery','online_payment'],
        required:true
  },

  payment_status: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending"
  },

  address: {
    full_name: String,
    phone: String,
    address_line: String,
    city: String,
    state: String,
    pincode: String
  }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);

