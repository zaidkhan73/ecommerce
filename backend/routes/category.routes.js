import express from "express"
import { createCategory, getAllCategories, updateCategory, deleteCategory} from "../controllers/category.controllers.js"


const categoryRouter = express.Router()

categoryRouter.post("/create-category",createCategory)
categoryRouter.get("/getAll-categories",getAllCategories)
categoryRouter.put("/update-category/:id",updateCategory)
categoryRouter.delete("/delete-category/:id",deleteCategory)

export default categoryRouter;