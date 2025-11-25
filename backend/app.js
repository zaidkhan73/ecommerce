import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";

const app = e()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(e.json())

app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)
app.use("/api/product",productRouter)


export {app}
