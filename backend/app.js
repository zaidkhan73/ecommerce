import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";

const app = e()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(e.json())

app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)
app.use("/api/product",productRouter)


export {app}
