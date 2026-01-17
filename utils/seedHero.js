import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import HeroSettings from "../models/heroSettings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);

await HeroSettings.deleteMany();

await HeroSettings.create({
  title: { word1: "STEM", word2: "Inspires" },
  subtitle:
    "Inspiring the next generation of innovators through inclusive, exciting, and hands-on robotics curriculums that empower creativity and real-world problem solving.",
  logoImage: "hero-logo.png",
  buttons: [
    { label: "Learn About STEM Inspires", link: "/about", type: "primary" },
    { label: "See Events", link: "/ourProjects", type: "secondary" },
  ],
});

console.log("✅ Hero seeded");
process.exit();
