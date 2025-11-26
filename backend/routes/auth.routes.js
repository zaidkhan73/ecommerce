import express from "express"
import { adminLogin, adminLogout, signOut } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/admin-login",adminLogin)
authRouter.get("/admin-logout",adminLogout)
authRouter.get("/signout",signOut)

export default authRouter;