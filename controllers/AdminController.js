import Admin from "../models/Admin.js";
import Payment from "../models/payment.js"; // fixed typo
import bcrypt from "bcryptjs";

// ----------------------------
// Change Admin Password
// ----------------------------
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

    // Assign new password — pre-save hook will hash it
    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Fetch All Payments (Admin Dashboard)
// ----------------------------
export const getAllPayments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Admin fetch payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
