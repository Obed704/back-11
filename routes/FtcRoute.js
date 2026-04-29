import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import FtcLanding from "../models/ftcLanding.js";

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
    folder: "ftc",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// === GET FTC CONTENT (PUBLIC) ===
router.get("/", async (req, res) => {
  const data = await FtcLanding.findOne();
  res.json(data);
});

// === UPDATE FTC CONTENT (ADMIN) ===
router.put(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.data);

      if (req.files?.heroImage)
        body.hero.backgroundImage = req.files.heroImage[0].path;

      if (req.files?.aboutImage)
        body.about.image = req.files.aboutImage[0].path;

      const updated = await FtcLanding.findOneAndUpdate(
        {},
        body,
        { new: true, upsert: true }
      );

      res.json(updated);
    } catch (err) {
      console.error("FTC Update error:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
