import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import StatsSettings from "../models/Starts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found. Check .env");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

await StatsSettings.deleteMany();

await StatsSettings.create({
  backgroundColor: "bg-black",
  stats: [
    { label: "Teams Started", target: 125, color: "rgb(247,244,46)", plus: false },
    { label: "Students Learning", target: 2500, color: "rgb(23,207,220)", plus: true },
    { label: "Competitions", target: 13, color: "rgb(242,30,167)", plus: false },
  ],
});

console.log("✅ Stats seeded successfully");
process.exit();
