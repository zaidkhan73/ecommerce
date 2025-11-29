import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function test() {
  try {
    const orders = await instance.orders.all({ count: 1 });
    console.log("API Auth Success:", orders);
  } catch (err) {
    console.error("API Auth Failed:", err);
  }
}

test();
