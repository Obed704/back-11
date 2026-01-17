import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import NavbarSettings from "../models/NavbarSettings.js";

// Resolve __dirname (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env no matter where script is run from
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found. Check backend/.env");
  process.exit(1);
}

try {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  // Clear old navbar config
  await NavbarSettings.deleteMany();

  // Seed navbar
  await NavbarSettings.create({
    textColor: "text-white",
    hoverColor: "#f7f42e", // yellow (can be hex or rgb)
    logoMode: "logo-with-text",
    links: [
      { name: "Home", link: "/" },
      { name: "Our Project", link: "/ourProjects" },
      { name: "Donate", link: "/donate" },
      { name: "Champions", link: "/champions" },
      { name: "Resources", link: "/resources" },
      { name: "FTC", link: "/ftc" },
      { name: "About", link: "/about" },
      { name: "Contact", link: "/contact" },
    ],
  });

  console.log("✅ Navbar seeded successfully");
  process.exit();
} catch (error) {
  console.error("❌ Navbar seeding failed:", error);
  process.exit(1);
}
