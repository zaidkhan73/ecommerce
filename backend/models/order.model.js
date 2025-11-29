import { request } from "express";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email:{type: String, required:true}
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
    enum: ["placed", "delivered"],
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
  otp: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },

  isOtpVerified:{
    type:Boolean,
    default:false
  },

  online_amount: Number,
cod_amount: Number,
discount: Number,


}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);

