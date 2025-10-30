import express from "express";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMidleware.js";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = req.admin;

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
