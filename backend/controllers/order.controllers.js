import dotenv from "dotenv";

dotenv.config();

import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Cart } from "../models/cart.model.js";
import Razorpay from "razorpay";    
import { sendDeliveryOtpMail, sendNewOrderMail } from "../utils/mail.js";
import { User } from "../models/user.model.js";



export const createOrder = async (req, res) => {
  try {
    const {
      payment_method,
      total_amount,
      address,
      online_amount,
      cod_amount,
      discount,
    } = req.body;



    const userId = req.user.id;


    // Fetch the full user object
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   

    if (!payment_method || !total_amount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let payment_status = "pending"; // default full online
    if (payment_method === "cod_only") payment_status = "pending_cod";
    else if (payment_method === "split_online_cod") payment_status = "partial_pending";

    

    // Create Order with user.name & user.phone
    const order = await Order.create({
  user: {
    id: user._id,
    name: user.username,
    phone: user.phone,
    email:user.email
  },
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

    // Send email with user name
    sendNewOrderMail(
      order._id,
      user.email,      // <-- pass user name
      payment_method,
      total_amount,
      online_amount,
      cod_amount,
      discount,
      JSON.stringify(address)
    ).catch((err) => console.log("EMAIL ERROR:", err));

    // Pure COD → no online payment
    if (payment_method === "cod_only") {
      cart.items = [];
      await cart.save();
      return res.json({
        message: "COD Order Placed Successfully",
        order,
        razorpayOrder: null,
      });
    }

    // Razorpay order creation
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorOrder = await razorpayInstance.orders.create({
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
      razorOrder,
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

    payment.status = "paid";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    await payment.save();


    const order = await Order.findById(payment.order_id);

    // Split Payment Handling
    if (order.payment_method === "split_online_cod") {
      order.payment_status = "partial_paid";
      order.cod_pending_amount = order.cod_amount;
    } else {
      order.payment_status = "paid";
    }

    order.order_status = "placed";
    await order.save();

    // Clear Cart After Success Payment
    await Cart.findOneAndUpdate({ user_id: order.user.id }, { items: [] });

    res.json({ message: "Payment Verified Successfully", order });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};


export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin should see ALL orders
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // User should see only their orders
      const userId = req.user.id;
      orders = await Order.find({ "user.id": userId }).sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const sendOrderOtp = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    order.otp = otp;
    order.otpExpiresAt = expires;
    await order.save();

    const userName = order?.user?.name || "Customer";
    const userEmail = order?.user?.email;

    if (!userEmail) {
      return res.status(400).json({ message: "User email missing in database!" });
    }

    await sendDeliveryOtpMail(userName, userEmail, orderId, otp);

    res.json({ message: "OTP sent to user email successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.otp || !order.otpExpiresAt) {
      return res.status(400).json({ message: "OTP not generated!" });
    }

    // Check expiration
    if (Date.now() > order.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    // Check OTP match
    if (order.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // Mark verified & update order status
    order.isOtpVerified = true;
    order.order_status = "delivered"; // ensure this field exists in your model

    // Reset OTP fields for security
    order.otp = undefined;
    order.otpExpiresAt = undefined;

    await order.save();

    res.json({ success: true, message: "OTP verified — Order Delivered!" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingOrdersCount = async (req, res) => {
  try {
    // Admin can see all orders → exclude pending and partial_pending orders
    let filter = {
  order_status: { $ne: "delivered" }, // delivered orders exclude
  payment_status: { $nin: ["pending", "partial_pending"] } // pending payments exclude
};


    // If user is not admin → show only his orders
    if (req.user.role !== "admin") {
      filter["user.id"] = req.user.id;
    }

    const pendingCount = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      pendingCount,
    });
  } catch (error) {
    console.error("GET PENDING ORDERS COUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending count",
    });
  }
};







