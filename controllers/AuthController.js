import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 Login request:", email);

    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing!");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret not set" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.warn("⚠️ Admin not found:", email);
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      console.warn("⚠️ Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token safely
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ JWT created successfully");
    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
