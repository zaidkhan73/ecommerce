import express from "express";
import { adminAuth, userAuth } from "../middlewares/isAuth.js";
import { createOrder, getOrders, sendOrderOtp, verifyDeliveryOtp, verifyPayment } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/create", userAuth, createOrder);
orderRouter.post("/verify", userAuth, verifyPayment);
orderRouter.get("/user",userAuth,getOrders)
orderRouter.get("/send-otp/:orderId",adminAuth,sendOrderOtp)
orderRouter.post("/verify-otp", adminAuth, verifyDeliveryOtp);
orderRouter.get("/admin",adminAuth,getOrders)


export default orderRouter;
