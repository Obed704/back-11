import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import Slide from "../models/slide.js";
import { protect } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

// ☁️ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📁 Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "welcome_slides",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* PUBLIC — Get all slides */
router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Upload & add slide */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const slide = await Slide.create({
      bg: req.file.path,
    });

    res.status(201).json(slide);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Update slide image */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      { bg: req.file.path },
      { new: true }
    );

    res.json(slide);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Delete slide */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide removed" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
