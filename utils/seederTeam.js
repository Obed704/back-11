// backend/utils/seederTeam.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import TeamMember from "../models/team.js";

// Fix for ES modules to locate .env properly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env reliably from backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check if env loaded
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Make sure .env is loaded correctly.");
  process.exit(1);
}

const teamData = [
  {
    name: "Amelia Wyler",
    role: "Founder",
    email: "amelia@steminspires.tech",
    image: "/team/Amelia-Wyler.avif",
  },
  {
    name: "Vienna Wyler",
    role: "Founder",
    email: "vienna@steminspires.tech",
    image: "/team/vienna-wyler.avif",
  },
  {
    name: "Happy Herman",
    role: "Human Resources Manager",
    email: "happy@steminspires.tech",
    image: "/team/happ-herman.avif",
  },
  {
    name: "Philemon Mucyo",
    role: "Robotics Trainer",
    email: "philemon@steminspires.tech",
    image: "/team/philemon_edited.avif",
  },
  {
    name: "Prudence Ayivi",
    role: "STEM Coach",
    email: "prudence@steminspires.tech",
    image: "/team/Prudence-Ayivi_edited.avif",
  },
  {
    name: "Fidèle Manirafasha",
    role: "Robotics Trainer",
    email: null,
    image: "/team/Fidele-Manirafasha_PNG.avif",
  },
  {
    name: "Ismael Kaleeba",
    role: "Student Ambassador",
    email: null,
    image: "/team/ismael_edited.avif",
  },
  {
    name: "Jeremie Habumugisha",
    role: "Student Mentor",
    email: null,
    image: "/team/jeremie.avif",
  },
  {
    name: "Ishimwe Yves",
    role: "Student Ambassador",
    email: null,
    image: "/team/ishimwe karamage-yves_edited.avif",
  },
  {
    name: "Alma Power",
    role: "Robotics Trainer",
    email: null,
    image: "/team/Alma-Power_edited_edited.avif",
  },
  {
    name: "Owen Cooper",
    role: "Robotics Trainer",
    email: null,
    image: "/team/Owen-Cooper_edited.avif",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected...");
    await TeamMember.deleteMany();
    await TeamMember.insertMany(teamData);
    console.log("✅ Team data seeded successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  });
