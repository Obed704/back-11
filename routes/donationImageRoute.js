// routes/adminDonationRoute.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import DonationImage from "../models/donationImageModel.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "donation_images", // The folder name in your Cloudinary dashboard
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// ✅ CREATE (Upload to Cloudinary)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { side } = req.body;
    // Cloudinary provides the full secure URL in req.file.path
    const imagePath = req.file.path;
    const newImage = await DonationImage.create({ side, image: imagePath });
    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading to Cloudinary" });
  }
});

// ✅ READ (Keep same)
router.get("/", async (req, res) => {
  try {
    const images = await DonationImage.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching images" });
  }
});

// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { side } = req.body;
    const updateData = { side };
    if (req.file) updateData.image = req.file.path;

    const updated = await DonationImage.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating image" });
  }
});

// ✅ DELETE (Note: This deletes from DB; to delete from Cloudinary too, you'd need the public_id)
router.delete("/:id", async (req, res) => {
  try {
    await DonationImage.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted from database" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});

export default router;