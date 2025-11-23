import { Admin } from "../models/admin.model.js";
import { generateToken } from "../utils/tokenGenerator.js";
import bcrypt from "bcryptjs";

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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
            sameSite: "lax"
        })
        .status(200)
        .json({ message: "Admin signed out" });
};

export { adminLogin, adminLogout };
