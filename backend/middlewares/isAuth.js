import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



export const auth = (req, res, next) => {
  const adminToken = req.cookies?.admin_token;
  const userToken = req.cookies?.user_token;

  let token;
  let role;

  if (adminToken) {
    token = adminToken;
    role = "admin";
  } else if (userToken) {
    token = userToken;
    role = "user";
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) return res.status(403).json({ message: "Role mismatch" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


