import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
