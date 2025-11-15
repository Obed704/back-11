import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Champion from "../models/Champion.js";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env correctly
dotenv.config({ path: path.join(__dirname, "../.env") });

// Ensure MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found! Check your .env file.");
  process.exit(1);
}

// Champion seed data with year field
const data = [
  {
    id: 1,
    title: "G.S.O.B | 2025",
    season: "Submerged – 2025",
    year: 2025,
    description:
      "GSOB Indatwa n’Inkesha is the oldest and one of the most prestigious secondary schools in Rwanda, located in Huye District. It is well known for its strong academic performance and national significance.",
    roadToVictory:
      "Started at district level, promoted to province as no. 5, and finally ended up winning the national competition with an outstanding robot design.",
    image: "/championsImage/gsob.JPG",
    alt: "gsob 2025",
    showHeader: true,
  },
  {
    id: 2,
    title: "Christ Roi | 2024",
    season: "Masterpiece – 2024",
    year: 2024,
    description:
      "Collège du Christ-Roi de Nyanza is a Catholic school and government-aided. It is located in Butare Diocese, in Southern Province, Nyanza District, Kristu-Umwami Parish. It was started by the Butare Diocese in 1956.",
    roadToVictory:
      "After securing second place at the district level, they advanced to province as underdogs and later shocked everyone by lifting the national championship trophy.",
    image: "/championsImage/crlx-img.jpg",
    alt: "Champion Woman in STEM",
    showHeader: true,
  },
  {
    id: 3,
    title: "Maranyundo | 2023",
    season: "Energize – 2023",
    year: 2023,
    description:
      "Maranyundo Girls School is a leading Rwandan boarding school offering science-focused education rooted in respect, responsibility, and leadership. It serves over 400 girls, many from underserved communities, with half on scholarships.",
    roadToVictory:
      "They rose from being ranked fourth at district level, promoted to province as no. 2, and ended up dominating nationals with teamwork and innovation.",
    image: "/championsImage/maranyundo.jpg",
    alt: "Champion Woman in STEM",
    showHeader: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🟢 Connected to MongoDB");

    // Remove existing champions
    await Champion.deleteMany();

    // Insert new champions
    await Champion.insertMany(data);

    // Fetch and display sorted by year descending
    const champions = await Champion.find().sort({ year: -1 });
    console.log("✅ Champions seeded successfully! Sorted by latest year first:");
    champions.forEach((c) => console.log(`${c.year} - ${c.title}`));

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding champions:", err);
    process.exit(1);
  }
};

seedDB();
