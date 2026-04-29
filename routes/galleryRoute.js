import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import GalleryImage from "../models/gallery.js";
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
    folder: "champions_gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, crop: "limit" }], // Optional: Resize on upload
  },
});

const upload = multer({ storage });

// ✅ GET all
router.get("/", async (req, res) => {
  try {
    const items = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery", error: err.message });
  }
});

// ✅ POST new (upload to Cloudinary)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file required" });

    // req.file.path contains the secure Cloudinary URL
    const { alt, title } = req.body;

    const doc = new GalleryImage({
      image: req.file.path,
      alt: alt || "",
      title: title || ""
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});

// ✅ PUT update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await GalleryImage.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const { alt, title } = req.body;
    if (alt !== undefined) item.alt = alt;
    if (title !== undefined) item.title = title;

    if (req.file) {
      // item.image = new cloudinary URL
      item.image = req.file.path;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating image", error: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const item = await GalleryImage.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Note: To delete from Cloudinary as well, you would need the public_id.
    // For now, we delete the record from MongoDB.
    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image", error: err.message });
  }
});

export default router;