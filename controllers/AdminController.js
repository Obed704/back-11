import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const { currentPassword, newPassword } = req.body;

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // ✅ Just assign new password — Mongoose pre-save hook will hash it
    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};
