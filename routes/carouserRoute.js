import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ProjectSlide from "../models/carouserSlider.js";
import dotenv from "dotenv";

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
    folder: "project_slides",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// GET all slides
router.get("/", async (req, res) => {
  try {
    const slides = await ProjectSlide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new slide
router.post("/", upload.single("src"), async (req, res) => {
  try {
    const { alt, caption } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file required" });

    const slide = new ProjectSlide({
      src: req.file.path, // Cloudinary URL
      alt: alt || "",
      caption: caption || "",
    });
    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE slide
router.put("/:id", upload.single("src"), async (req, res) => {
  try {
    const { alt, caption } = req.body;
    const updateData = {};

    if (alt !== undefined) updateData.alt = alt;
    if (caption !== undefined) updateData.caption = caption;
    if (req.file) updateData.src = req.file.path;

    const updatedSlide = await ProjectSlide.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedSlide) return res.status(404).json({ message: "Slide not found" });
    res.json(updatedSlide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE slide
router.delete("/:id", async (req, res) => {
  try {
    const slide = await ProjectSlide.findByIdAndDelete(req.params.id);
    // Note: To delete from Cloudinary as well, you'd extract the public_id from slide.src
    res.json({ message: "Slide deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;