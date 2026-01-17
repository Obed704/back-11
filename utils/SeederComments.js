// backend/utils/SeederTestimonials.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Testimonial from "../models/Comments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load backend/.env reliably
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found. Check backend/.env");
  process.exit(1);
}

const data = [
  {
    text: "I had no idea how robots worked when I first joined the robotics team, but now I can put up a program and run it myself or with my team.",
    name: "Celestine Ineza",
    role: "Student of STEM Inspires",
    font: "'Dancing Script', cursive",
    borderColor: "#facc15",
    textColor: "#fef08a",
  },
  {
    text: "Robotics education is a critical component of STEM education in Rwanda, preparing students for a digital future, fostering innovation and creativity...",
    name: "Sandra Kayitaba",
    role: "Writer for the Digital Transformation Center of Rwanda",
    font: "'Pacifico', cursive",
    borderColor: "#60a5fa",
    textColor: "#bfdbfe",
  },
  {
    text: "The enthusiasm and dedication shown by the participating teams are a testament to the potential of the young people in Africa.",
    name: "Olajide Ade Ajayi",
    role: "Regional Coordinator of FLL, Founder of Coderina",
    font: "'Shadows Into Light', cursive",
    borderColor: "#34d399",
    textColor: "#bbf7d0",
  },
];

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    await Testimonial.deleteMany();
    await Testimonial.insertMany(data);
    console.log("✅ Testimonials seeded");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
};

runSeeder();
