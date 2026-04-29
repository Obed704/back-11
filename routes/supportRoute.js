import express from "express";
import Support from "../models/support.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
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
    folder: "support",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// GET all support cards
router.get("/", async (req, res) => {
  try {
    const supports = await Support.find();
    res.json(supports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new support card
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newSupport = new Support({
      ...req.body,
      image: req.file ? req.file.path : req.body.image,
    });
    await newSupport.save();
    res.json(newSupport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update support card
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updated = await Support.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file && { image: req.file.path }),
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE support card
router.delete("/:id", async (req, res) => {
  try {
    await Support.findByIdAndDelete(req.params.id);
    res.json({ message: "Support card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
