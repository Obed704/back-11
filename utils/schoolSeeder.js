// backend/utils/schoolSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import School from "../models/School.js";

// Resolve the .env file path manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found. Check your .env path or file content.");
  process.exit(1);
}

const schools = [
  {
    name: "College Saint Andrew",
    img: "/ftc/saint-andre.jpg",
    location: "Kigali",
    website: "https://collegesaintandre.ac.rw",
  },
  {
    name: "Christ Roi Nyanza",
    img: "/ftc/christ-rio2.jpg",
    location: "Rwanda",
    website: "https://collegeduchristroi.ac.rw",
  },
  {
    name: "Gashora Girls Academy",
    img: "/ftc/gashora.webp",
    location: "Rwanda",
    website: "https://www.ggast.org/",
  },
  {
    name: "Maranyundo Girls Schools",
    img: "/ftc/maranyundo-2.jpg",
    location: "Rwanda",
    website: "http://maranyundogirlsschool.org",
  },
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await School.deleteMany();
    await School.insertMany(schools);
    console.log("🌱 Database seeded successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });
