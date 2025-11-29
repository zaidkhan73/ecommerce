import express from "express";
import { adminAuth, userAuth } from "../middlewares/isAuth.js";
import { createOrder, getOrders, getPendingOrdersCount, sendOrderOtp, verifyDeliveryOtp, verifyPayment } from "../controllers/order.controllers.js";
import { rateProduct } from "../controllers/rating.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/create", userAuth, createOrder);
orderRouter.post("/verify", userAuth, verifyPayment);
orderRouter.get("/user",userAuth,getOrders)
orderRouter.post("/rate", userAuth, rateProduct);
orderRouter.get("/send-otp/:orderId",adminAuth,sendOrderOtp)
orderRouter.post("/verify-otp", adminAuth, verifyDeliveryOtp);
orderRouter.get("/admin",adminAuth,getOrders)
orderRouter.get("/pending-count", adminAuth, getPendingOrdersCount);



export default orderRouter;
