import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



// user-only route middleware
export const userAuth = (req, res, next) => {
  const token = req.cookies?.user_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") throw new Error("Forbidden");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// admin-only route middleware
export const adminAuth = (req, res, next) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") throw new Error("Forbidden");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};



