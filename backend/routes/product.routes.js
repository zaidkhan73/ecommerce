import express from "express"
import { auth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById } from "../controllers/product.controllers.js"

const productRouter = express.Router()

productRouter.post("/add-product",auth,upload.array("product_image",10),addProduct)
productRouter.put("/edit-product/:id",auth,upload.array("product_image",10),editProduct)
productRouter.delete("/delete-product/:id",auth,deleteProduct)
productRouter.get("/admin/get-product/:id",auth,getProductById)
productRouter.get("/admin/getAll-product",auth,getAllProducts)

productRouter.get("/get-product/:id",getProductById)
productRouter.get("/getAll-product",getAllProducts)

export default productRouter;