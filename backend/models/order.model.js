import { request } from "express";
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
    enum: ["placed", "delivered", "cancelled"],
    default: "placed"
  },

  payment_method:{
        type:String,
        enum:['split_online_cod','online_payment'],
        required:true
  },

  payment_status: {
    type: String,
    enum: [ "partial_paid", "paid", "pending", "partial_pending"],
    required:true
  },

  address: {
    type: String,
    required:true
  },

  online_amount: Number,
cod_amount: Number,
discount: Number,


}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);

