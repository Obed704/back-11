import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import EducationElement from "../models/education.js";
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
    folder: "education_assets",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    public_id: (req, file) => `edu-${Date.now()}`,
  },
});

const upload = multer({ storage });

// ✅ GET all elements
router.get("/", async (req, res) => {
  try {
    const elements = await EducationElement.find().sort({ createdAt: -1 });
    res.json(elements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE element
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { title, description, borderColor, alt } = req.body;

    // Find existing item first
    const existingItem = await EducationElement.findById(req.params.id);
    if (!existingItem) return res.status(404).json({ message: "Not found" });

    const updateData = {
      title: title || existingItem.title,
      description: description || existingItem.description,
      borderColor: borderColor || existingItem.borderColor,
      alt: alt || existingItem.alt
    };

    // If a new image was uploaded
    if (req.file) {
      updateData.img = req.file.path;

      // OPTIONAL: Delete old image from Cloudinary to save space
      if (existingItem.img.includes("cloudinary")) {
        const publicId = existingItem.img.split('/').pop().split('.')[0];
        cloudinary.uploader.destroy(`education_assets/${publicId}`).catch(e => console.log("Old image delete failed"));
      }
    }

    const updated = await EducationElement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
});

export default router;