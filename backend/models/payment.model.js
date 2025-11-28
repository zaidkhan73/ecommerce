    import mongoose from "mongoose";

    const paymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    amount: Number,
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    method: { type: String } // e.g., card, netbanking (optional)
    }, { timestamps: true });

    export const Payment = mongoose.model("Payment", paymentSchema);
