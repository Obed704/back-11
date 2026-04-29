import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import SectionText from "../models/sisters.js";

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
    folder: "sections",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// GET
router.get("/:key", async (req, res) => {
  const section = await SectionText.findOne({ key: req.params.key });
  if (!section) return res.status(404).json({ error: "Not found" });
  res.json(section);
});

// UPDATE
router.put(
  "/:key",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const parsedDescription =
        typeof description === "string" ? JSON.parse(description) : description;

      const updateData = {
        title,
        description: parsedDescription,
      };

      if (req.files?.image1) {
        updateData.image1 = req.files.image1[0].path;
      }
      if (req.files?.image2) {
        updateData.image2 = req.files.image2[0].path;
      }

      const updated = await SectionText.findOneAndUpdate(
        { key: req.params.key },
        updateData,
        { new: true, upsert: true }
      );

      res.json(updated);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
