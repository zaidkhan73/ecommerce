import express from "express"
import { addToCart, clearCart, deleteFromCart, getCartById } from "../controllers/cart.controllers.js";
import { auth} from "../middlewares/isAuth.js";


const cartRouter = express.Router()

cartRouter.post("/cart/add", addToCart);

// Delete single product from cart
cartRouter.delete("/cart/delete",deleteFromCart);

// Clear entire cart
cartRouter.delete("/cart/clear",  clearCart);

// Get user's cart
cartRouter.get("/",  getCartById);

export default cartRouter;