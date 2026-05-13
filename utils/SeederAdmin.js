import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "../models/Admin.js";

// ─── Fix __dirname in ES Modules ─────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Load .env correctly ──────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── Seed config ──────────────────────────────────────────────
const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL || "niyobyoseobed1@gmail.com";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Niyobyose@1";

async function seed() {
  try {
    // ─── Connect MongoDB ──────────────────────────────────────
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ─── Check if admin already exists ────────────────────────
    const existing = await Admin.findOne({ email: SEED_EMAIL });

    if (existing) {
      console.log(`ℹ️ Admin already exists: ${SEED_EMAIL}`);
      return;
    }

    // ─── Create admin ──────────────────────────────────────────
    const admin = new Admin({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      twoFactorEnabled: true,
      twoFactorMethod: "email",
    });

    await admin.save();

    console.log("🎉 Admin seeded successfully!");
    console.log(`Email    : ${SEED_EMAIL}`);
    console.log(`Password : ${SEED_PASSWORD}`);

  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();