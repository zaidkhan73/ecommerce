import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
    },
    resetOtp: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
