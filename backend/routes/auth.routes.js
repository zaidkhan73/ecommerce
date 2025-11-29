import express from "express"
import { adminLogin, adminLogout, adminPasswordOtp, adminResetPassword, adminVerifyOtp, emailOtp, passwordOtp, resetPassword, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/admin-login",adminLogin)
authRouter.get("/admin-logout",adminLogout)
authRouter.post("/admin/password-otp", adminPasswordOtp);
authRouter.post("/admin/verify-otp", adminVerifyOtp);
authRouter.post("/admin/reset-password", adminResetPassword);


authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)
authRouter.post("/password-otp",passwordOtp)
authRouter.post("/verify-otp",verifyOtp)
authRouter.post("/email-otp",emailOtp)
authRouter.post("/reset-password",resetPassword)


export default authRouter;