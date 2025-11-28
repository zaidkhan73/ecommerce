import express from "express"
import { addToCart, clearCart, deleteFromCart, getCartById, updateCartQuantity } from "../controllers/cart.controllers.js";
import { auth} from "../middlewares/isAuth.js";


const cartRouter = express.Router()

cartRouter.post("/add",auth, addToCart);
cartRouter.put("/update",auth, updateCartQuantity);

// Delete single product from cart
cartRouter.delete("/delete",auth,deleteFromCart);

// Clear entire cart
cartRouter.delete("/clear",auth,  clearCart);

// Get user's cart
cartRouter.get("/", auth, getCartById);

export default cartRouter;