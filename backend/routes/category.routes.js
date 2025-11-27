import express from "express"
import { createCategory, getAllCategories, updateCategory, deleteCategory , getCategoryById} from "../controllers/category.controllers.js"
import {  auth } from "../middlewares/isAuth.js"


const categoryRouter = express.Router()

categoryRouter.post("/create-category",auth,createCategory)
categoryRouter.get("/getAll-categories",auth,getAllCategories)
categoryRouter.get("/get-category/:id",auth,getCategoryById)
categoryRouter.put("/update-category/:id",auth,updateCategory)
categoryRouter.delete("/delete-category/:id",auth,deleteCategory)

categoryRouter.get("/getAll-categories",auth,getAllCategories)
categoryRouter.get("/get-category/:id",auth,getCategoryById)

export default categoryRouter;