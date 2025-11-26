import { Admin } from "../models/admin.model.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { User } from "../models/user.model.js";
import { TempUser } from "../models/temp.model.js";
import bcrypt from "bcryptjs";
import { sendVerificationMail, sendPasswordMail } from "../utils/mail.js";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(admin._id);

    //console.log("token",token)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({ message: "Admin logged in", token });
  } catch (error) {
    return res.status(500).json({ message: `Error during login: ${error}` });
  }
};

const adminLogout = async (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "Admin signed out" });
};

{
  /*user controllers */
}

const emailOtp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "user already exists" });
    }

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

    const token = generateToken(user._id);

    await TempUser.deleteOne({ email });

    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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

const signIn = async(req,res) => {
    try {
        const {email, password} = req.body
        
        if(!email){
            return res.status(400).json({ message: "all field reqiuired" });
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({ message: "No user found with this email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Incorrect password" });
        }

        const loggedInUser = await User.findById(user._id).select("-password")

        const token = await generateToken(user._id)

        res.cookie("token",token,{
        secure:false,
        sameSite:"lax",
        maxAge:7*24*60*60*1000,
        httpOnly:true
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            user: loggedInUser
        },
        "user signed in"
    ))
    } catch (error) {
        return res
      .status(500)
      .json({ message: `Error during user SignIn: ${error}` });
    }
}

const signOut = async (req,res) => {
    return res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "user signed out" });
}


const passwordOtp = async (req,res)=>{
    try {
        //get user
        const {email} = req.body

        //find user
        const user = await User.findOne({email})

        //check if user exist
        if(!user){
            return res.status(400).json({
                message:"User does not exist"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.resetOtp = otp,
        user.otpExpires = Date.now()+5*60*1000
        user.isOtpVerified=false
        await user.save()
        await sendPasswordMail(email, otp, user.username)
        return res.status(200).json({message:"password reset mail send successfully"})
    } catch (error) {
        return res.status(500).json(`error during sending otp ${error}`)
    }
}

const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body

        const user = await User.findOne({email})

        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({message: "invalid or expired otp"})
        }

        user.resetOtp=undefined
        user.isOtpVerified=true
        user.otpExpires=undefined

        await user.save() 

        return res.status(200).json({message:"otp verified successfully"})

    } catch (error) {
        return res.status(500).json(`otp verification failed ${error}`)
    }
}


const resetPassword = async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user || !user.isOtpVerified){
            return res.status(400).json({
                message:"Invalid input"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        user.isOtpVerified=false

        await user.save()

        return res.status(200).json({message:"password reset successfull"})
    } catch (error) {
        return res.status(500).json(`password reset failed ${error}`)
    }
}


export { adminLogin, adminLogout, emailOtp, signUp, signIn, passwordOtp, verifyOtp, resetPassword , signOut};
