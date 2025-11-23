import mongoose from"mongoose";
import dotenv from"dotenv";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected !! ",connect.connection.host)
    } catch (error) {
        console.log("db connection error: ",error);
        process.exit(1);
    }
}