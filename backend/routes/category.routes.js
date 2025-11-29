import express from "express"
import { createCategory, getAllCategories, updateCategory, deleteCategory , getCategoryById} from "../controllers/category.controllers.js"
import {  adminAuth,  userAuth } from "../middlewares/isAuth.js"


const categoryRouter = express.Router()

categoryRouter.post("/create-category",adminAuth,createCategory)
categoryRouter.get("/admin/getAll-categories",adminAuth,getAllCategories)
categoryRouter.get("/admin/get-category/:id",adminAuth,getCategoryById)
categoryRouter.put("/update-category/:id",adminAuth,updateCategory)
categoryRouter.delete("/delete-category/:id",adminAuth,deleteCategory)

categoryRouter.get("/getAll-categories",userAuth,getAllCategories)
categoryRouter.get("/get-category/:id",userAuth,getCategoryById)

export default categoryRouter;