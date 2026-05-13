import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { generateVerificationCode, sendVerificationEmail } from "../services/emailService.js";
import dotenv from "dotenv";

dotenv.config();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateAccessToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (admin) =>
  jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── Step 1: Login (Send Verification Code) ─────────────────────────────────
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email }).select(
      "+password +loginAttempts +lockUntil +twoFactorEnabled +twoFactorMethod +emailVerificationCode +emailVerificationExpires"
    );

    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    // ── Account lock check ────────────────────────────────────────────────
    if (admin.isLocked && admin.isLocked()) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Account locked. Try again in ${remaining} minute(s).`,
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reset failed attempts on successful password check
    await admin.resetLoginAttempts();

    // ── Generate and send verification code ──────────────────────────────
    const verificationCode = generateVerificationCode();

    admin.emailVerificationCode = verificationCode;
    admin.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await admin.save();

    // Send email with verification code
    try {
      await sendVerificationEmail(admin.email, verificationCode);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    // Create pre-auth token (valid for 10 minutes)
    const preAuthToken = jwt.sign(
      { id: admin._id, phase: "email-2fa" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      requiresTwoFactor: true,
      preAuthToken,
      twoFactorMethod: "email",
      message: `Verification code sent to ${admin.email}`,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Step 2: Verify Email Code ─────────────────────────────────────────────
export const verifyEmailCode = async (req, res) => {
  try {
    const { preAuthToken, code } = req.body;

    if (!preAuthToken || !code)
      return res.status(400).json({ message: "Token and verification code required" });

    let decoded;
    try {
      decoded = jwt.verify(preAuthToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    if (decoded.phase !== "email-2fa")
      return res.status(401).json({ message: "Invalid token phase" });

    const admin = await Admin.findById(decoded.id).select(
      "+emailVerificationCode +emailVerificationExpires +refreshToken"
    );

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    if (!admin.emailVerificationCode || !admin.emailVerificationExpires) {
      return res.status(401).json({ message: "No verification code found. Please login again." });
    }

    if (Date.now() > admin.emailVerificationExpires) {
      return res.status(401).json({ message: "Verification code expired. Please login again." });
    }

    if (admin.emailVerificationCode !== code) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    admin.emailVerificationCode = undefined;
    admin.emailVerificationExpires = undefined;

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshToken = refreshToken;
    await admin.save();

    setRefreshCookie(res, refreshToken);

    return res.json({
      message: "Login successful",
      token: accessToken,
      admin: { id: admin._id, email: admin.email },
    });

  } catch (err) {
    console.error("Email code verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Resend Verification Code ──────────────────────────────────────────────
export const resendVerificationCode = async (req, res) => {
  try {
    const { preAuthToken } = req.body;

    if (!preAuthToken)
      return res.status(400).json({ message: "Pre-auth token required" });

    let decoded;
    try {
      decoded = jwt.verify(preAuthToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    if (decoded.phase !== "email-2fa")
      return res.status(401).json({ message: "Invalid token phase" });

    const admin = await Admin.findById(decoded.id).select("+emailVerificationCode +emailVerificationExpires");

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const verificationCode = generateVerificationCode();

    admin.emailVerificationCode = verificationCode;
    admin.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await admin.save();

    try {
      await sendVerificationEmail(admin.email, verificationCode);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    const newPreAuthToken = jwt.sign(
      { id: admin._id, phase: "email-2fa" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({
      message: `New verification code sent to ${admin.email}`,
      preAuthToken: newPreAuthToken,
    });

  } catch (err) {
    console.error("Resend code error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Refresh Access Token ──────────────────────────────────────────────────
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const admin = await Admin.findById(decoded.id).select("+refreshToken");
    if (!admin || admin.refreshToken !== token)
      return res.status(403).json({ message: "Refresh token mismatch" });

    const accessToken = generateAccessToken(admin);
    res.json({ token: accessToken });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────
export const logoutAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("+refreshToken");
    if (admin) {
      admin.refreshToken = undefined;
      await admin.save();
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Profile ───────────────────────────────────────────────────────────
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

// ─── Change Password ───────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords required" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    const admin = await Admin.findById(req.user.id).select("+password +refreshToken");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    admin.refreshToken = undefined;
    await admin.save();

    res.clearCookie("refreshToken");
    res.json({ message: "Password updated successfully. Please log in again." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};