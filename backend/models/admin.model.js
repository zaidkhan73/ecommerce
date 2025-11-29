import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetOtp: String,
otpExpires: Date,
isOtpVerified: { type: Boolean, default: false },
},{
    timestamps:true
})

export const Admin = mongoose.model("Admin",adminSchema)