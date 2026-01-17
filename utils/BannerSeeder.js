// backend/utils/BannerSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Banner from "../models/BannerChampions.js";
import Champion from "../models/Champion.js";

// Resolve the actual directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Log to verify it's loaded
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const seedBanner = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is undefined. Check .env path or filename.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const firstChampion = await Champion.findOne().sort({ _id: 1 });

    const banner = {
      title: "Our Commitment",
      description:
        "STEM Inspires is a company committed to empowering teams to achieve excellence in STEM. With our roots in hands-on STEM education and competitions, we understand the importance of creating an inclusive and motivating environment for teams to learn, innovate, and excel. That’s why we work with schools and student groups to provide mentorship, resources, and guidance, helping teams develop their skills and reach championship-level performance.",
      primaryColor: "rgb(23, 207, 220)",
      secondaryColor: "rgb(247, 244, 46)",
      backgroundColor: "rgb(242, 30, 167)",
      image: firstChampion ? firstChampion.image : null,
    };

    await Banner.deleteMany();
    await Banner.create(banner);

    console.log("✅ Banner seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedBanner();
