import express from "express"
import { adminAuth, userAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById } from "../controllers/product.controllers.js"

const productRouter = express.Router()

productRouter.post("/add-product",adminAuth,upload.array("product_image",10),addProduct)
productRouter.put("/edit-product/:id",adminAuth,upload.array("product_image",10),editProduct)
productRouter.delete("/delete-product/:id",adminAuth,deleteProduct)
productRouter.get("/admin/get-product/:id",adminAuth,getProductById)
productRouter.get("/admin/getAll-product",adminAuth,getAllProducts)

productRouter.get("/get-product/:id",userAuth,getProductById)
productRouter.get("/getAll-product",userAuth,getAllProducts)

export default productRouter;