import express from "express"
import { adminLogin, adminLogout } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/admin-login",adminLogin)
authRouter.get("/admin-logout",adminLogout)

export default authRouter;