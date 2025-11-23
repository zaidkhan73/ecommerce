import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createDefaultAdmin } from "./utils/createAdmin.js";

dotenv.config()

const port = process.env.PORT || 5000;

connectDB()
.then(async()=>{
    await createDefaultAdmin();
    app.listen(port, ()=>{
        console.log(`server is listening at ${port}`)
    })
})
