// backend/utils/SistersCardSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import SectionText from "../models/sisters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedSistersCard = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const sistersCard = {
      key: "sisters_card",
      title: "sisters in STEM",
      description: [
        { text: "Amelia and Vienna", highlight: true },
        {
          text: "started STEM Inspires when we moved to Rwanda in 2022 after visiting Kigali often in our childhood. Having been involved with FIRST since primary school, we have first-hand experience with not just the method and quality of engineering education, but also the competitive fun FIRST offers.",
          highlight: false,
        },
        {
          text: "Together, we're inspiring students to embrace the challenge, power, and FUN of STEM.",
          highlight: true,
        },
      ],
    };

    await SectionText.deleteMany({ key: "sisters_card" });
    await SectionText.create(sistersCard);
    console.log("✅ Sisters Card seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSistersCard();
