import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById } from "../controllers/product.controllers.js"

const productRouter = express.Router()

productRouter.post("/add-product",isAuth,upload.array("product_image",10),addProduct)
productRouter.put("/edit-product/:id",isAuth,upload.array("product_image",10),editProduct)
productRouter.delete("/delete-product/:id",isAuth,deleteProduct)
productRouter.get("/get-product/:id",isAuth,getProductById)
productRouter.get("/getAll-product",isAuth,getAllProducts)

export default productRouter;