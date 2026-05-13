import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },

  // Email 2FA
  twoFactorEnabled: { type: Boolean, default: true },
  twoFactorMethod: { type: String, enum: ["email", "totp", "google"], default: "email" },
  twoFactorSecret: { type: String, select: false },

  // Email verification codes
  emailVerificationCode: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },

  // Google OAuth (for alternative)
  googleId: { type: String },

  // Account security
  refreshToken: { type: String, select: false },
  loginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, select: false },

  createdAt: { type: Date, default: Date.now },
});

// Check if account is locked
AdminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts
AdminSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000;
  }

  await this.save();
};

// Reset login attempts
AdminSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", AdminSchema);