import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ProcessStep from "../models/recruiting.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ☁️ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recruiting_process",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const steps = await ProcessStep.find().sort({ createdAt: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching process steps" });
  }
});

// ✅ UPDATE STEP (Supports Text & Image)
router.put("/:id", upload.single("img"), async (req, res) => {
  const { id } = req.params;

  // 🛡️ Guard: Check if ID is valid MongoDB format
  if (!mongoose.Types.ObjectId.isValid(id) || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing ID format" });
  }

  try {
    const { title, description, alt, highlight } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (alt !== undefined) updateData.alt = alt;
    if (highlight !== undefined) updateData.highlight = highlight;

    // Add image if file was uploaded
    if (req.file) {
      updateData.img = req.file.path;
    }

    const updatedStep = await ProcessStep.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStep) {
      return res.status(404).json({ message: "Process step not found" });
    }

    res.json(updatedStep);
  } catch (error) {
    console.error("Backend Update Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;