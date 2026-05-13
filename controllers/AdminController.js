import Admin from "../models/Admin.js";
import Payment from "../models/payment.js";
import bcrypt from "bcryptjs";

// ─── Change Admin Password ────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords required" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    const admin = await Admin.findById(req.user.id).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Pre-save hook will hash the new password
    admin.password = newPassword;
    // Invalidate all refresh tokens on password change
    admin.refreshToken = undefined;
    await admin.save();

    res.clearCookie("refreshToken");
    res.json({ message: "Password updated successfully. Please log in again." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Admin Profile ────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      id: admin._id,
      email: admin.email,
      twoFactorEnabled: admin.twoFactorEnabled,
      twoFactorMethod: admin.twoFactorMethod,
      createdAt: admin.createdAt,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Fetch All Payments ───────────────────────────────────────────────────────
export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(),
    ]);

    res.json({
      payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};