import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = e()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(e.json())

app.use(cookieParser())

export {app}
