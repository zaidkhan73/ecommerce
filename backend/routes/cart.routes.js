import express from "express"
import { addToCart, clearCart, deleteFromCart, getCartById, updateCartQuantity } from "../controllers/cart.controllers.js";
import { userAuth} from "../middlewares/isAuth.js";


const cartRouter = express.Router()

cartRouter.post("/add",userAuth, addToCart);
cartRouter.put("/update",userAuth, updateCartQuantity);

// Delete single product from cart
cartRouter.delete("/delete",userAuth,deleteFromCart);

// Clear entire cart
cartRouter.delete("/clear",userAuth,  clearCart);

// Get user's cart
cartRouter.get("/", userAuth, getCartById);

export default cartRouter;