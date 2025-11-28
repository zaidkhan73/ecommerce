import express from "express";
import { auth } from "../middlewares/isAuth.js";
import { createOrder, verifyPayment } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/create", auth, createOrder);
orderRouter.post("/verify", auth, verifyPayment);

export default orderRouter;
