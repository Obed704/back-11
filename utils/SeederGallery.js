// backend/utils/SeederGallery.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import GalleryImage from "../models/gallery.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load backend/.env no matter where you run the script from
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found. Check backend/.env");
  process.exit(1);
}

const data = [
  { image: "/championsImage/crlx-img.jpg", alt: "CRLX", title: "CRLX" },
  { image: "/championsImage/gsob.JPG", alt: "GSOB", title: "GSOB" },
  { image: "/championsImage/maranyundo.jpg", alt: "Maranyundo", title: "Maranyundo" },
  // add more if you want
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    await GalleryImage.deleteMany();
    await GalleryImage.insertMany(data);
    console.log("✅ Gallery seeded");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
};

run();
