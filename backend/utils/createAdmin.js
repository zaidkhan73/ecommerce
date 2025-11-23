// utils/createAdmin.js
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

export const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log("✔️ Default Admin Already Exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("🎉 Default Admin Created Successfully!");
  } catch (error) {
    console.log("❌ Error creating default admin:", error);
  }
};
