import dotenv from "dotenv";

import { Admin } from "../models/admin.model.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { User } from "../models/user.model.js";
import { TempUser } from "../models/temp.model.js";
import bcrypt from "bcryptjs";
import { sendVerificationMail, sendPasswordMail } from "../utils/mail.js";
dotenv.config();

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 1: Check with .env credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken("env_admin", "admin");
      res.cookie("admin_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({ message: "Admin logged in via env", token });
    }

    // Step 2: Check inside database if not matched in .env
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // DB admin login success
    const token = generateToken(admin._id, "admin");
    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ message: "Admin logged in via DB", token });

  } catch (error) {
    return res.status(500).json({ message: `Error during login: ${error.message}` });
  }
};

const adminLogout = async (req, res) => {
  return res
    .clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Admin signed out" });
};

/* Admin Forgot Password Controllers */
const adminPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.otpExpires = Date.now() + 5 * 60 * 1000;
    admin.isOtpVerified = false;

    await admin.save();
    await sendPasswordMail(email, otp, admin.username); // You can create admin-specific mail too

    return res
      .status(200)
      .json({ message: "Password reset mail sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error sending OTP: ${error}` });
  }
};

const adminVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || admin.resetOtp !== otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.resetOtp = undefined;
    admin.isOtpVerified = true;
    admin.otpExpires = undefined;

    await admin.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `OTP verification failed: ${error}` });
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isOtpVerified) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.isOtpVerified = false;

    await admin.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Password reset failed: ${error}` });
  }
};


{
  /*user controllers */
}

const emailOtp = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    await TempUser.deleteOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const tempUser = new TempUser({
      email,
      username,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await tempUser.save();
    await sendVerificationMail(email, otp, tempUser.username);

    return res
      .status(200)
      .json({ message: "Verification mail sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during sending email: ${error}` });
  }
};

const signUp = async (req, res, next) => {
  try {
    const { username, email, password, phone, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ message: "No signup request found" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > tempUser.otpExpiry) {
      await TempUser.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length smaller than 6" });
    }
    if (phone.length !== 10) {
      return res.status(400).json({ message: "invalid phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      isEmailVerified: true,
    });

    const isUserCreated = await User.findById(user._id).select("-password");
    if (!isUserCreated) {
      throw new ApiError(500, "something went wrong while registering user");
    }

    await TempUser.deleteOne({ email });

    const token = generateToken(user._id, "user");

    res.cookie("user_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).json({
      success: true,
      user: isUserCreated,
      message: "user registered successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during user Signup: ${error}` });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "all field reqiuired" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    const token = generateToken(user._id, "user");
    res.cookie("user_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

     return res.status(201).json({
      success: true,
      user: loggedInUser,
      message: "user logged in successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during user SignIn: ${error}` });
  }
};

const signOut = async (req, res) => {
  return res
    .clearCookie("user_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "user signed out" });
};

const passwordOtp = async (req, res) => {
  try {
    //get user
    const { email } = req.body;

    //find user
    const user = await User.findOne({ email });

    //check if user exist
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    (user.resetOtp = otp), (user.otpExpires = Date.now() + 5 * 60 * 1000);
    user.isOtpVerified = false;
    await user.save();
    await sendPasswordMail(email, otp, user.username);
    return res
      .status(200)
      .json({ message: "password reset mail send successfully" });
  } catch (error) {
    return res.status(500).json(`error during sending otp ${error}`);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "invalid or expired otp" });
    }

    user.resetOtp = undefined;
    user.isOtpVerified = true;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "otp verified successfully" });
  } catch (error) {
    return res.status(500).json(`otp verification failed ${error}`);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: "password reset successfull" });
  } catch (error) {
    return res.status(500).json(`password reset failed ${error}`);
  }
};

export {
  adminLogin,
  adminLogout,
  emailOtp,
  signUp,
  signIn,
  passwordOtp,
  verifyOtp,
  resetPassword,
  signOut,
  adminPasswordOtp,
  adminResetPassword,
  adminVerifyOtp
};
