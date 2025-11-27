import express from "express"
import { adminLogin, adminLogout, emailOtp, passwordOtp, resetPassword, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/admin-login",adminLogin)
authRouter.get("/admin-logout",adminLogout)

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)
authRouter.post("/password-otp",passwordOtp)
authRouter.post("/verify-otp",verifyOtp)
authRouter.post("/email-otp",emailOtp)
authRouter.post("/reset-password",resetPassword)


export default authRouter;