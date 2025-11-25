import express from "express"
import { createCategory, getAllCategories, updateCategory, deleteCategory , getCategoryById} from "../controllers/category.controllers.js"
import isAuth from "../middlewares/isAuth.js"


const categoryRouter = express.Router()

categoryRouter.post("/create-category",isAuth,createCategory)
categoryRouter.get("/getAll-categories",isAuth,getAllCategories)
categoryRouter.get("/get-category/:id",isAuth,getCategoryById)
categoryRouter.put("/update-category/:id",isAuth,updateCategory)
categoryRouter.delete("/delete-category/:id",isAuth,deleteCategory)

export default categoryRouter;