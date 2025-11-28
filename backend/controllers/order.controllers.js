import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Cart } from "../models/cart.model.js";
import { razorpay } from "../utils/razorpay.js";
import { sendNewOrderMail } from "../utils/mail.js";

export const createOrder = async (req, res) => {
  try {
    const { payment_method, total_amount, address, online_amount, cod_amount, discount } = req.body;

    const userId = req.user.id;

    if (!payment_method || !total_amount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const payment_status =
      payment_method === "online_payment" ? "pending" : "partial_pending";

    // Create order
    const order = await Order.create({
  user_id: userId,
  items: cart.items.map((item) => ({
    product_id: item.product_id._id,
    product_name: item.product_id.name,
    product_image: item.product_id.product_image[0].url,
    price: item.product_id.final_price,
    quantity: item.quantity,
  })),
  payment_method,
  total_amount,
  address,
  payment_status,
  online_amount,
  cod_amount,
  discount,
});


    // Email send (non-blocking)
    const userEmail = req.user.email;
    sendNewOrderMail(
      order._id,
      userEmail,
      payment_method,
      total_amount,
      online_amount,
      cod_amount,
      discount,

      JSON.stringify(address)
    ).catch((err) => console.log("EMAIL ERROR:", err));

    // 🟣 COD FLOW → No Razorpay order
    if (payment_method === "split_online_cod") {
      cart.items = [];
      await cart.save();

      return res.json({
        message: "COD Order Placed Successfully",
        order,
        razorpayOrder: null,
      });
    }

    // 🔵 ONLINE PAYMENT → Create Razorpay Order
    const razorOrder = await razorpay.orders.create({
  amount: Math.round(online_amount * 100),
  currency: "INR",
  receipt: `order_${order._id}`,
});


    await Payment.create({
  user_id: userId,
  order_id: order._id,
  amount: online_amount,
  status: "created",
  razorpay_order_id: razorOrder.id,
  method: payment_method,
});


    res.json({
      message: "Order created, proceed with payment",
      order,
      razorpayOrder: razorOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Signature validation
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update DB after payment success
    payment.status = "paid";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    await payment.save();

    const order = await Order.findById(payment.order_id);
    order.payment_status = "paid";
    order.order_status = "placed";
    await order.save();

    // Clear cart after completed order
    await Cart.findOneAndUpdate({ user_id: order.user_id }, { items: [] });

    res.json({ message: "Payment Verified Successfully", order });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
