import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

const seedAdmin = async () => {
  await connectDB();
  await Admin.deleteMany({}); // delete all admins

  const admin = new Admin({ email: "niyobyoseobed1@gmail.com", password: "123" });
  await admin.save();
  console.log("Admin created:", admin.email);
  process.exit();
};

seedAdmin();
